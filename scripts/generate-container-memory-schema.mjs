#!/usr/bin/env node
/**
 * Generates the JSON Schema used by `containerMemorySchema` (src/actions/container-memory.ts)
 * from `@drincs/pixi-vn`'s own `ContainerMemory` type, via this package's own generic
 * TypeScript-interface-to-JSON-Schema generator (`schema-generator.mjs`) — the same generator used
 * by `generate-entrance-transition-schemas.mjs`.
 *
 * `ContainerMemory` is read straight off `@drincs/pixi-vn`'s own `.d.ts` (it's not declared
 * anywhere in this package), so no `interfaceDir` is passed — generated via the depth-capped
 * "external" path, at the default `maxDepth: 1` ("branching" = 1): every direct property is typed
 * correctly, but any property that is itself an object collapses to an opaque `{ type: "object" }`
 * rather than being expanded.
 *
 * `elements` (`CanvasBaseItemMemory[]`, the container's own children) is deliberately dropped from
 * the generated schema after generation: it's a self-referential list of arbitrary canvas-element
 * snapshots (potentially containers themselves), not a plain, flat property this schema is meant
 * to validate.
 *
 * Run via `npm run generate-container-memory-schema`; re-run whenever `@drincs/pixi-vn`'s
 * `ContainerMemory` type changes.
 */

import { readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { generateJsonSchema } from "./schema-generator.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const pixiVnDistDir = join(rootDir, "node_modules", "@drincs", "pixi-vn", "dist");

// `ContainerMemory` isn't declared in `canvas.d.ts` itself — that file only re-exports it from a
// shared chunk whose filename is content-hashed (e.g. `ContainerMemory-D2HtgX7w.d.ts`), so a
// `generateJsonSchema` lookup rooted at `canvas.d.ts` alone can't find its declaration (it only
// resolves types declared directly in one of `rootFiles`, not merely re-exported through it).
// Resolve the actual chunk by filename pattern instead of hardcoding the hash, since it changes
// whenever `@drincs/pixi-vn`'s own build reshuffles its chunks.
const containerMemoryChunk = readdirSync(pixiVnDistDir).find((name) =>
    /^ContainerMemory-.*\.d\.ts$/.test(name),
);
if (!containerMemoryChunk) {
    throw new Error(
        `Could not find the chunk declaring "ContainerMemory" under ${pixiVnDistDir} (expected a file matching ContainerMemory-*.d.ts).`,
    );
}
const containerMemoryDts = join(pixiVnDistDir, containerMemoryChunk);

const { schemas, definitions } = generateJsonSchema({
    rootFiles: [containerMemoryDts],
    rootTypeNames: ["ContainerMemory"],
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

/** Drops `elements` — see the module header comment for why. */
function withoutElements(schema) {
    const { elements: _elements, ...properties } = schema.properties ?? {};
    return {
        ...schema,
        properties,
        required: (schema.required ?? []).filter((key) => key !== "elements"),
    };
}

const containerMemorySchema = withoutElements(toStandaloneSchema(schemas.ContainerMemory));

const outPath = join(rootDir, "src", "actions", "container-memory-schema.generated.ts");
const banner = `/**
 * GENERATED FILE — do not edit by hand.
 * Produced by \`scripts/generate-container-memory-schema.mjs\` from \`@drincs/pixi-vn\`'s own
 * \`ContainerMemory\` type. Re-run that script (see its header comment) to refresh this file after
 * that type changes.
 */

/**
 * JSON Schema (usable as \`@drincs/pixi-vn-ink\`'s \`HashtagHandlerOptions.keySchemas\` values, or
 * with any other JSON Schema validator) for \`ContainerMemory\`, excluding its own \`elements\` (the
 * container's child canvas elements — a self-referential list, not a flat property).
 */
export const containerMemorySchema: object = `;

writeFileSync(outPath, `${banner}${JSON.stringify(containerMemorySchema, null, 4)};\n`);

console.log(`Generated: ${outPath}`);
console.log(
    `Properties: ${Object.keys(containerMemorySchema.properties ?? {}).length} (excluding "elements")`,
);
