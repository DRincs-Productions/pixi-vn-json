import type { ReplaceHandler, ReplaceHandlerOptions } from "@/handlers/interfaces/ReplaceHandler";
import { RegisteredCharacters } from "@drincs/pixi-vn/characters";
import { ZodType } from "zod";

/**
 * Manages text replacement handlers that process content enclosed in square brackets (`[key]`).
 *
 * Handlers are called in the order they were added. For each handler, the current text is scanned
 * for all `[key]` patterns. If the handler's `validation` matches a key, the handler is
 * invoked with that key. If the handler returns a string, all occurrences of `[key]` are replaced
 * with the returned value. After a handler finishes processing the text, the next handler starts
 * on the updated text.
 *
 * Each handler specifies whether it runs before or after translation via the `type` field in its
 * options (defaults to `"after-translation"`).
 *
 * @example
 * ```ts title="content/text-replaces.ts"
 * import { TextReplaces } from 'pixi-vn-ink'
 * import { getCharacterById } from "@drincs/pixi-vn";
 *
 * // Replace [characterId] with the character's display name
 * TextReplaces.add(
 *     (key) => {
 *         const character = getCharacterById(key)
 *         return character?.name
 *     },
 *     {
 *         name: "character-name",
 *         description: "Replaces character IDs with their display names",
 *         validation: /^[a-z_]+$/,
 *         type: "after-translation",
 *     }
 * )
 * // "Hello [john], meet [jane]!" -> "Hello John, meet Jane!"
 * ```
 */
export namespace TextReplaces {
    /**
     * Configuration options for the `TextReplaces` system.
     */
    export const options = {
        /**
         * The regex used to find replacement tokens in the text (e.g. `[key]`).
         * @default /\[([^\]]+)\]/
         */
        replaceRegex: /\[([^\]]+)\]/,
    };

    /** Internal registry of handlers in insertion order. */
    const _handlers: { fn: ReplaceHandler; opts: ReplaceHandlerOptions }[] = [];

    /**
     * Registers a new replacement handler.
     *
     * Handlers are executed in the order they are added. The first handler added runs first.
     *
     * The {@link TranslatorManager} translation pipeline automatically calls
     * {@link TextReplaces.replace} for both phases (`"before-translation"` and
     * `"after-translation"`), so no additional setup is required after calling `add`.
     *
     * @param fn The handler function. Receives the key found inside `[...]` and should return
     *   the replacement string, or `undefined` to leave that token unchanged.
     * @param handlerOptions Configuration for this handler, including its name, optional
     *   description, validation regex, and execution phase.
     * @example
     * ```ts title="content/text-replaces.ts"
     * import { TextReplaces } from 'pixi-vn-ink'
     *
     * TextReplaces.add(
     *     (key) => key === "player" ? "Mario" : undefined,
     *     {
     *         name: "player-name",
     *         validation: /^player$/,
     *     }
     * )
     * ```
     */
    export function add(fn: ReplaceHandler, handlerOptions: ReplaceHandlerOptions): void {
        _handlers.unshift({ fn, opts: handlerOptions });
    }

    /**
     * Removes a previously registered handler function.
     *
     * Only the first registration matching `fn` is removed. If the same function was added
     * multiple times, subsequent registrations remain.
     *
     * @param fn The handler function to remove.
     */
    export function remove(fn: ReplaceHandler): void {
        const index = _handlers.findIndex((h) => h.fn === fn);
        if (index !== -1) {
            _handlers.splice(index, 1);
        }
    }

    /**
     * Returns metadata for all registered handlers, in registration order.
     *
     * @returns An array of {@link ReplaceHandlerOptions} for each registered handler.
     */
    export function info(): ReplaceHandlerOptions[] {
        return _handlers.map((h) => h.opts);
    }

    /**
     * Applies all registered handlers of the specified type to the given text in order.
     *
     * For each handler:
     * 1. All `[key]` tokens currently present in the text are collected.
     * 2. For each unique key, the handler's `validation` is tested against the key.
     * 3. If validation passes, the handler is called with the key.
     * 4. If the handler returns a string, **all** occurrences of `[key]` in the text are
     *    replaced with that string.
     * 5. After the handler has processed all tokens, the next handler starts on the updated text.
     *
     * @param text The source text to process.
     * @param replaceOptions Specifies which phase of handlers to run.
     * @returns The text after all matching handlers have been applied.
     * @example
     * ```ts title="content/text-replaces.ts"
     * // Given handlers that replace [name] -> "Mario" and [surname] -> "Rossi":
     * TextReplaces.replace("Ciao [name] [surname]. [name] vai pure", { type: "before-translation" })
     * // => "Ciao Mario Rossi. Mario vai pure"
     * ```
     */
    export function replace(
        text: string,
        replaceOptions: {
            /** Which phase of handlers to execute. */
            type: "after-translation" | "before-translation";
            /**
             * When `true`, skips the i18n interpolation pre-step that converts
             * `[key]` → `{{[key]}}` for handlers with `i18nInterpolation: true`.
             *
             * Use this when computing the i18n lookup key (where the pre-step must
             * not alter the key) vs. the translated value (where the pre-step is needed).
             */
            skipI18nPreStep?: boolean;
            /**
             * When `true`, applies the i18n interpolation pre-step to **all** registered
             * handlers, not only those with `i18nInterpolation: true`.
             *
             * Used by `generateJsonTranslation` when building the translation file VALUE:
             * a before-translation handler that maps `[sly]` → `"Sly"` should produce
             * `"{{Sly}}"` in the value (i18n interpolation variable), which is achieved by
             * first wrapping `[sly]` → `{{[sly]}}` and then letting the handler replace the
             * inner `[sly]` with `Sly`.
             */
            applyI18nPreStepToAll?: boolean;
        },
    ): string {
        // Pre-step: convert first [key] → {{[key]}} for every handler that has
        // i18nInterpolation enabled. This runs before the type-based handler filter
        // so that the i18n tokens are in place before either translation phase begins.
        if (!replaceOptions.skipI18nPreStep) {
            const preStepHandlers = replaceOptions.applyI18nPreStepToAll
                ? _handlers
                : _handlers.filter((h) => h.opts.i18nInterpolation);
            for (const handler of preStepHandlers) {
                text = applyI18nPreStep(text, handler.fn, handler.opts.validation);
            }
        }

        const activeHandlers = _handlers.filter(
            (h) => (h.opts.type ?? "after-translation") === replaceOptions.type,
        );

        for (const handler of activeHandlers) {
            text = applyHandler(text, handler.fn, handler.opts.validation);
        }

        return text;
    }

    /**
     * Pre-step for handlers with `i18nInterpolation: true`.
     *
     * Scans the text for `[key]` tokens that match the handler's validation and for which
     * `fn` returns a non-`undefined` value, then converts the **first** occurrence of each
     * such key to `{{[key]}}`. Subsequent occurrences are left as `[key]` so that the normal
     * {@link applyHandler} pass can replace them with the handler's return value.
     */
    function applyI18nPreStep(
        text: string,
        fn: ReplaceHandler,
        validation: RegExp | "characterId" | "all" | ZodType<string>,
    ): string {
        const globalRegex = new RegExp(options.replaceRegex.source, "g");
        const allMatches = [...text.matchAll(globalRegex)];
        const seenKeys = new Set<string>();
        const uniqueKeys: string[] = [];
        for (const m of allMatches) {
            if (!seenKeys.has(m[1])) {
                seenKeys.add(m[1]);
                uniqueKeys.push(m[1]);
            }
        }

        for (const key of uniqueKeys) {
            if (validation === "characterId") {
                if (!RegisteredCharacters.has(key)) continue;
            } else if (validation !== "all") {
                if (validation instanceof RegExp) {
                    if (!validation.test(key)) continue;
                } else if (validation instanceof ZodType) {
                    const result = validation.safeParse(key);
                    if (!result.success) continue;
                }
            }
            if (fn(key) !== undefined) {
                // Replace only the first occurrence with the i18n interpolation format.
                text = text.replace(`[${key}]`, `{{[${key}]}}`);
            }
        }

        return text;
    }

    /**
     * Applies a single handler to the text by scanning all `[key]` tokens, validating each
     * against the handler's validation option, and performing replacements.
     *
     * Validation rules:
     * - `"all"` – every key is passed to the handler.
     * - `"characterId"` – the key is passed only if it matches a registered character ID.
     * - `RegExp` – the key is passed only if the regex matches it.
     * - `ZodType<string>` – the key is passed only if `schema.safeParse(key)` succeeds.
     *
     * @param text The source text.
     * @param fn The handler function.
     * @param validation The validation rule to apply to each key.
     * @returns The text after the handler has been applied to all matching tokens.
     */
    function applyHandler(
        text: string,
        fn: ReplaceHandler,
        validation: RegExp | "characterId" | "all" | ZodType<string>,
    ): string {
        const globalRegex = new RegExp(options.replaceRegex.source, "g");
        // Collect all unique keys currently in the text, preserving encounter order.
        const allMatches = [...text.matchAll(globalRegex)];
        const seenKeys = new Set<string>();
        const uniqueKeys: string[] = [];
        for (const m of allMatches) {
            if (!seenKeys.has(m[1])) {
                seenKeys.add(m[1]);
                uniqueKeys.push(m[1]);
            }
        }

        for (const key of uniqueKeys) {
            if (validation === "characterId") {
                if (!RegisteredCharacters.has(key)) continue;
            } else if (validation !== "all") {
                if (validation instanceof RegExp) {
                    if (!validation.test(key)) continue;
                } else if (validation instanceof ZodType) {
                    const result = validation.safeParse(key);
                    if (!result.success) continue;
                }
            }
            const replacement = fn(key);
            if (replacement !== undefined) {
                text = text.replaceAll(`[${key}]`, replacement);
            }
        }

        return text;
    }
}
