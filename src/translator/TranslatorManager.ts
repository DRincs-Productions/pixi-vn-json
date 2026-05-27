import { TextReplaces } from "@/translator/TextReplaces";
import { operationStringToString } from "@/utils/operationtoconvert";
import type { StepLabelPropsType } from "@drincs/pixi-vn";
import type {
    PixiVNJsonChoice,
    PixiVNJsonChoices,
    PixiVNJsonConditionalResultToCombine,
    PixiVNJsonConditionalStatements,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonLabelStep,
    PixiVNJsonOperation,
} from "@drincs/pixi-vn-json/schema";

/**
 * Manages the translation pipeline for all text displayed by pixi-vn-json.
 *
 * The pipeline applies three optional hooks in order:
 * 1. `beforeToTranslate` – pre-processes the key before translation.
 * 2. `translate` – the main translation function (identity by default).
 * 3. `afterToTranslate` – post-processes the translated string.
 *
 * Use {@link TranslatorManager.t} to translate a key or array of keys.
 */
namespace TranslatorManager {
    let _translate: (key: string) => string = (key: string) => key;

    /**
     * @deprecated
     * Optional hook that runs **before** the built-in {@link TextReplaces} before-translation
     * replace pass. Useful for key normalization (e.g. trimming, lowercasing).
     *
     * Prefer {@link TextReplaces.add} with `type: "before-translation"` instead.
     */
    export let beforeToTranslate: ((key: string) => string) | undefined;

    /**
     * @deprecated
     * Optional hook that runs **after** the built-in {@link TextReplaces} after-translation
     * replace pass. Useful for post-processing translated strings.
     *
     * Prefer {@link TextReplaces.add} with `type: "after-translation"` instead.
     */
    export let afterToTranslate: ((key: string) => string) | undefined;

    /**
     * Translates a single key or an array of keys using the registered pipeline.
     * Returns the same type (`string` or `string[]`) as the input.
     *
     * @param key - The string key or array of string keys to translate.
     * @returns The translated string(s).
     */
    export function t<T = string | string[]>(key: T): T {
        if (Array.isArray(key)) {
            return key.map((k?: string) => translate(`${k}`)) as T;
        }
        return translate(`${key}`) as T;
    }

    /**
     * Runs the composed translation pipeline:
     * 1. optional `beforeToTranslate` hook (deprecated)
     * 2. {@link TextReplaces.replace} – before-translation phase
     * 3. main `translate` function
     * 4. optional `afterToTranslate` hook (deprecated)
     * 5. {@link TextReplaces.replace} – after-translation phase
     */
    export function translate(key: string): string {
        let text = key;
        if (beforeToTranslate) {
            text = beforeToTranslate(text);
        }
        text = TextReplaces.replace(text, { type: "before-translation" });
        text = _translate(text);
        if (afterToTranslate) {
            text = afterToTranslate(text);
        }
        text = TextReplaces.replace(text, { type: "after-translation" });
        return text;
    }

    /**
     * Sets the main translation function.
     * Defaults to an identity function (returns the key unchanged).
     *
     * @example
     * ```ts
     * setTranslate((key) => i18n.t(key));
     * ```
     */
    export function setTranslate(value: (key: string) => string) {
        _translate = value;
    }

    function addKey(
        json: any,
        key: string[] | string,
        options: {
            defaultValue: "empty_string" | "copy_key";
        },
    ) {
        const { defaultValue = "empty_string" } = options;
        if (typeof key === "string") {
            key = [key];
        }
        if (Array.isArray(key)) {
            key.forEach((k) => {
                console.log(`Adding key to translation JSON: ${k}`);
                // The i18n key è il testo dopo i before-translation handler, SENZA la pre-elaborazione i18n.
                let actualKey = k;
                if (beforeToTranslate) {
                    actualKey = beforeToTranslate(actualKey);
                }
                // Salta la pre-elaborazione i18n: chiama direttamente i replace handler
                actualKey = TextReplaces.replace(actualKey, {
                    type: "before-translation",
                });

                if (defaultValue === "empty_string") {
                    if (json[actualKey] === undefined) {
                        json[actualKey] = "";
                    }
                } else if (defaultValue === "copy_key") {
                    let value = k;
                    if (beforeToTranslate) {
                        value = beforeToTranslate(value);
                    }
                    console.log(`Setting default value for key "${actualKey}" to "${value}"`);
                    // Per la value, applica la pre-elaborazione i18n a tutti gli handler, poi i replace handler
                    let processedValue = TextReplaces.runI18nPreStep(value, { applyToAll: true });
                    console.log(`Value after i18n pre-step: "${processedValue}"`);
                    processedValue = TextReplaces.replace(processedValue, {
                        type: "before-translation",
                    });
                    json[actualKey] = processedValue;
                }
            });
        }
    }

    function getConditionalsThenElse<T>(
        data: PixiVNJsonConditionalStatements<T> | PixiVNJsonConditionalResultToCombine<T> | T,
        res: T[] = [],
    ): T[] {
        if (typeof data === "object" && data && "type" in data) {
            if (data.type === "ifelse") {
                if (data.then) {
                    getConditionalsThenElse(data.then, res);
                }
                if (data.else) {
                    getConditionalsThenElse(data.else, res);
                }
            } else if (data.type === "stepswitch") {
                if (data.elements) {
                    if (Array.isArray(data.elements)) {
                        data.elements.forEach((element) => {
                            getConditionalsThenElse(element, res);
                        });
                    } else {
                        if (data.elements.type === "ifelse") {
                            const tempRes: T[][] = [];
                            getConditionalsThenElse(data.elements, tempRes);
                            tempRes.forEach((item) => {
                                res.push(...item);
                            });
                        } else if (data.elements.type === "stepswitch") {
                            const tempRes: T[][] = [];
                            getConditionalsThenElse(data.elements, tempRes);
                            tempRes.forEach((item) => {
                                res.push(...item);
                            });
                        } else {
                            getConditionalsThenElse(data.elements, res);
                        }
                    }
                }
            } else if (data.type === "resulttocombine") {
                if (data.firstItem) {
                    getConditionalsThenElse(data.firstItem, res);
                }
                if (data.secondConditionalItem) {
                    data.secondConditionalItem.forEach((item) => {
                        getConditionalsThenElse(item, res);
                    });
                }
            } else {
                res.push(data);
            }
        } else if (data) {
            res.push(data);
        }
        return res;
    }

    /**
     * Generates a JSON translation object from the provided labels.
     * @param labels The labels to translate.
     * @param json The JSON object to populate with translations.
     * @param options Options for translation, including default value handling.
     * @returns The populated JSON object with translations.
     */
    export async function generateJsonTranslation(
        labels: PixiVNJsonLabelStep[],
        json: object = {},
        options: {
            /**
             * Default value to use when a key is not found.
             * - "empty_string": Use an empty string as the default value.
             * - "copy_key": Use the key itself as the default value.
             * @default "copy_key"
             */
            defaultValue?: "empty_string" | "copy_key";
            operationStringConvert?: (
                value: string,
                step: PixiVNJsonLabelStep,
                props: StepLabelPropsType | {},
            ) => Promise<PixiVNJsonOperation | undefined>;
        } = {},
    ) {
        const { defaultValue = "copy_key", operationStringConvert } = options;
        const promises = labels.map(async (label) => {
            if (label.choices) {
                let multichoices: PixiVNJsonChoices[] = [];
                if (!Array.isArray(label.choices)) {
                    multichoices = getConditionalsThenElse(label.choices);
                } else {
                    multichoices = [label.choices];
                }
                multichoices.forEach((c) => {
                    c.forEach((choice) => {
                        if ("type" in choice) {
                            let res: PixiVNJsonChoice[] = [];
                            if (choice.type === "ifelse" || choice.type === "stepswitch") {
                                getConditionalsThenElse(choice, res);
                            } else {
                                res = [choice];
                            }
                            const texts = res.map((item) => getConditionalsThenElse(item.text));
                            texts.forEach((text) => {
                                if (Array.isArray(text)) {
                                    text.forEach((t) => {
                                        if (Array.isArray(t)) {
                                            t.forEach((tt) => {
                                                if (typeof tt === "string") {
                                                    addKey(json, tt, {
                                                        defaultValue,
                                                    });
                                                } else {
                                                    getConditionalsThenElse(tt).forEach((t) => {
                                                        if (Array.isArray(t)) {
                                                            t.forEach((tt) => {
                                                                if (typeof tt === "string") {
                                                                    addKey(json, tt, {
                                                                        defaultValue,
                                                                    });
                                                                }
                                                            });
                                                        } else if (typeof t === "string") {
                                                            addKey(json, t, {
                                                                defaultValue,
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else if (typeof t === "string") {
                                            addKey(json, t, { defaultValue });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }
            if (label.dialogue) {
                let dialogues: PixiVNJsonDialog<PixiVNJsonDialogText>[] = [];
                if (!Array.isArray(label.dialogue)) {
                    dialogues = getConditionalsThenElse(label.dialogue);
                } else {
                    dialogues = [label.dialogue];
                }
                dialogues.forEach((dialogue) => {
                    if (typeof dialogue === "string") {
                        addKey(json, dialogue, { defaultValue });
                    } else if ("text" in dialogue) {
                        let text = getConditionalsThenElse(dialogue.text);
                        if (typeof text === "string") {
                            text = [text];
                        }
                        text.forEach((text) => {
                            if (typeof text === "string") {
                                addKey(json, text, { defaultValue });
                            } else {
                                const t = getConditionalsThenElse(text);
                                t.forEach((tt) => {
                                    if (typeof tt === "string") {
                                        addKey(json, tt, { defaultValue });
                                    } else if (Array.isArray(tt)) {
                                        tt.forEach((ttt) => {
                                            if (typeof ttt === "string") {
                                                addKey(json, ttt, {
                                                    defaultValue,
                                                });
                                            } else {
                                                getConditionalsThenElse(ttt).forEach((t) => {
                                                    if (typeof t === "string") {
                                                        addKey(json, t, {
                                                            defaultValue,
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            if (label.operations) {
                for (let operation of label.operations) {
                    if (operation.type === "operationtoconvert" && operationStringConvert) {
                        const stringOperation = operationStringToString(operation);
                        const res = await operationStringConvert(stringOperation, label, {});
                        if (!res) {
                            return;
                        }
                        operation = res;
                    }
                    switch (operation.type) {
                        case "text":
                            switch (operation.operationType) {
                                case "show":
                                    addKey(json, operation.text, {
                                        defaultValue,
                                    });
                                    break;
                            }
                            break;
                    }
                }
            }
            if (label.conditionalStep) {
                const l = getConditionalsThenElse(label.conditionalStep);
                l.forEach((item) => {
                    if (Array.isArray(item)) {
                        generateJsonTranslation(item, json, options);
                    } else {
                        generateJsonTranslation([item], json, options);
                    }
                });
            }
        });
        await Promise.all(promises);
        return json;
    }
}

export default TranslatorManager;
