import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function readGeneratedSchema() {
    const pkg = JSON.parse(readFileSync(join(rootDir, "package.json"), "utf-8"));
    const schemaPath = join(rootDir, "schemas", pkg.version, "schema.json");
    return JSON.parse(readFileSync(schemaPath, "utf-8"));
}

describe("generate-schema script", () => {
    it(
        "resolves external PixiJS option types instead of leaving them fully unconstrained",
        () => {
            // Regression coverage: `props?: ImageSpriteOptions` (from `@drincs/pixi-vn`) used to
            // fall back to `{}` (accept anything) because the generator only walked types
            // declared in this package's own `src/schema`, never into external packages. That
            // let a typo like `props: { x: "asd" }` through validation completely silently.
            execFileSync("node", ["scripts/generate-schema.mjs"], { cwd: rootDir, stdio: "pipe" });
            const schema = readGeneratedSchema();

            const imageShow = schema.definitions.PixiVNJsonCanvasImageVideoShow;
            expect(imageShow).toBeDefined();

            const propsSchema = imageShow.properties.props;
            const resolvedProps = propsSchema.$ref
                ? schema.definitions[propsSchema.$ref.replace("#/definitions/", "")]
                : propsSchema;

            expect(resolvedProps.properties.x).toEqual({ type: "number" });
            expect(resolvedProps.properties.y).toEqual({ type: "number" });
        },
        30_000,
    );

    it("rejects unknown keys on external PixiJS option types (e.g. a typo'd prop name)", () => {
        // Regression coverage: `buildExternalObjectSchema` enumerated the real property list of
        // types like `ImageContainerOptions` (so `xAlign`/`yAlign` etc. were individually typed),
        // but never set `additionalProperties: false` on the resulting object schema. A typo'd
        // key — e.g. `# show imagecontainer james [...] xAlin 0.5` instead of `xAlign` — was
        // therefore a perfectly valid "extra" property as far as JSON Schema/ajv were concerned,
        // so it silently did nothing at runtime with no warning anywhere in the pipeline.
        const schema = readGeneratedSchema();

        const containerShow = schema.definitions.PixiVNJsonCanvasImageContainerShow;
        expect(containerShow).toBeDefined();

        const propsSchema = containerShow.properties.props;
        const resolvedProps = propsSchema.$ref
            ? schema.definitions[propsSchema.$ref.replace("#/definitions/", "")]
            : propsSchema;

        expect(resolvedProps.properties.xAlign).toBeDefined();
        expect(resolvedProps.properties.xAlin).toBeUndefined();
        expect(resolvedProps.additionalProperties).toBe(false);
    });

    it("de-duplicates repeated external types via $ref instead of ballooning the schema", () => {
        // Regression guard: before de-duplicating identical named external types (the same
        // `SpriteOptions`-derived shape appears under image show/edit, inside
        // `ImageContainerOptions<T>`, ...) into a shared `$ref`, inlining a fresh copy at every
        // use site blew the schema up from ~450KB to over 22MB.
        const schema = readGeneratedSchema();
        const sizeInBytes = Buffer.byteLength(JSON.stringify(schema), "utf-8");
        expect(sizeInBytes).toBeLessThan(5 * 1024 * 1024);

        const externalDefinitionCount = Object.keys(schema.definitions).filter((key) =>
            key.startsWith("External_"),
        ).length;
        expect(externalDefinitionCount).toBeGreaterThan(0);
    });
});
