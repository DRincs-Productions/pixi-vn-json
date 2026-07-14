#!/usr/bin/env node
/**
 * Generates a JSON Schema from the PixiVNJson TypeScript interface.
 * Schema is saved to schemas/<version>/schema.json
 *
 * Thin wrapper around `generateJsonSchema` (schema-generator.mjs) — see that file for the actual
 * AST-traversal/type-checker engine. `PixiVNJson` and everything under `src/schema` is treated as
 * "local" (expanded fully, no depth cap); external types (from `@drincs/pixi-vn`, `pixi.js`, ...)
 * are capped at `maxDepth: 3`, which reproduces this generator's historical depth exactly (its
 * root call used to start at depth 0 with a cap of 2 — three total object levels before
 * collapsing; `generateJsonSchema` starts the root call at depth 1, so the equivalent cap is 3).
 */

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { generateJsonSchema } from "./schema-generator.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf8"));
const version = pkg.version;

const interfaceDir = join(rootDir, "src", "schema");
const tsconfigPath = join(rootDir, "tsconfig.schema.json");

const { schemas, definitions } = generateJsonSchema({
    rootFiles: [],
    tsconfigPath,
    interfaceDir,
    rootTypeNames: ["PixiVNJson"],
    maxDepth: 3,
    includeAllLocalDeclarations: true,
    // `StorageElementType`/`StorageObjectType` come from `@drincs/pixi-vn`, so they're external
    // references with no local declaration to inspect — they'd otherwise fall through to the
    // generic "external type" resolution. That's a problem specifically when they appear inside a
    // union (e.g. `leftValue: StorageElementType | PixiVNJsonValueGet | ...`): `mergeUnion` filters
    // out any branch with zero keys, so an empty-schema branch would silently vanish and the field
    // would end up looking object-only instead of "primitive or object". Giving them real keys
    // here keeps them in the union, same as the historical special-case.
    typeNameOverrides: {
        StorageElementType: { type: ["string", "number", "boolean", "null", "array", "object"] },
        StorageObjectType: { type: "object" },
    },
});

const rootSchema = definitions[schemas.PixiVNJson.$ref.replace("#/definitions/", "")];

// ─── Output ───────────────────────────────────────────────────────────────────

const schema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    ...rootSchema,
    definitions,
};

const outDir = join(rootDir, "schemas", version);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "schema.json");
writeFileSync(outPath, JSON.stringify(schema, null, 2) + "\n");

console.log(`Schema generated: ${outPath}`);
console.log(`Definitions: ${Object.keys(definitions).length}`);
