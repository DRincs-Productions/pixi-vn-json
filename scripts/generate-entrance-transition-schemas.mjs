#!/usr/bin/env node
/**
 * Generates the JSON Schemas used by `entranceTransitionKeySchemas`
 * (src/actions/entrance-transitions.ts) from `@drincs/pixi-vn`'s own transition prop types —
 * `ShowWithDissolveTransitionProps`, `ShowWithFadeTransitionProps`, `MoveInOutProps`,
 * `ZoomInOutProps`, `PushInOutProps` — via this package's own generic
 * TypeScript-interface-to-JSON-Schema generator (`schema-generator.mjs`).
 *
 * These 5 types are read straight off `@drincs/pixi-vn`'s own `.d.ts` (they're not declared
 * anywhere in this package), so no `interfaceDir` is passed — every one of them is generated via
 * the depth-capped "external" path, at the default `maxDepth: 1` ("branching" = 1): each prop
 * type's own direct properties (duration, delay, ease, direction, ...) are typed correctly, but
 * any property that is itself an object (e.g. a `position: { x, y }` some future transition prop
 * might add) collapses to an opaque `{ type: "object" }` rather than being expanded.
 *
 * Run via `npm run generate-entrance-transition-schemas`; re-run whenever `@drincs/pixi-vn`'s
 * transition prop types change.
 */

import { writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateJsonSchema } from "./schema-generator.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const canvasDts = join(rootDir, "node_modules", "@drincs", "pixi-vn", "dist", "canvas.d.ts");

const ROOT_TYPE_NAMES = [
    "ShowWithDissolveTransitionProps",
    "ShowWithFadeTransitionProps",
    "MoveInOutProps",
    "ZoomInOutProps",
    "PushInOutProps",
];

const { schemas, definitions } = generateJsonSchema({
    rootFiles: [canvasDts],
    rootTypeNames: ROOT_TYPE_NAMES,
    compilerOptions: { types: [] },
});

/** Each entry must be self-contained (it's used standalone as one JSON Schema by any validator). */
function toStandaloneSchema(rootSchema) {
    if (rootSchema.$ref) {
        const key = rootSchema.$ref.replace("#/definitions/", "");
        const { [key]: own, ...rest } = definitions;
        const usedRefs = JSON.stringify(own).match(/#\/definitions\/[A-Za-z0-9_]+/g) ?? [];
        if (usedRefs.length === 0) return own;
        const neededDefinitions = Object.fromEntries(
            usedRefs
                .map((ref) => ref.replace("#/definitions/", ""))
                .filter((k) => k in rest)
                .map((k) => [k, rest[k]]),
        );
        return Object.keys(neededDefinitions).length > 0
            ? { ...own, definitions: neededDefinitions }
            : own;
    }
    return rootSchema;
}

const entranceTransitionKeySchemas = {
    dissolve: toStandaloneSchema(schemas.ShowWithDissolveTransitionProps),
    fade: toStandaloneSchema(schemas.ShowWithFadeTransitionProps),
    movein: toStandaloneSchema(schemas.MoveInOutProps),
    zoomin: toStandaloneSchema(schemas.ZoomInOutProps),
    pushin: toStandaloneSchema(schemas.PushInOutProps),
};

const outPath = join(rootDir, "src", "actions", "entrance-transition-schemas.generated.ts");
const banner = `/**
 * GENERATED FILE — do not edit by hand.
 * Produced by \`scripts/generate-entrance-transition-schemas.mjs\` from
 * \`@drincs/pixi-vn\`'s own transition prop types. Re-run that script (see its header comment) to
 * refresh this file after those types change.
 */

/**
 * JSON Schemas (usable as \`@drincs/pixi-vn-ink\`'s \`HashtagHandlerOptions.keySchemas\` values, or
 * with any other JSON Schema validator) for each entrance transition's own props, keyed by
 * transition name.
 */
export const entranceTransitionKeySchemas: Record<string, object> = `;

writeFileSync(outPath, `${banner}${JSON.stringify(entranceTransitionKeySchemas, null, 4)};\n`);

console.log(`Generated: ${outPath}`);
console.log(`Transitions: ${Object.keys(entranceTransitionKeySchemas).join(", ")}`);
