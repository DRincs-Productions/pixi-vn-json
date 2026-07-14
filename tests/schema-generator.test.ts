import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
// @ts-expect-error - plain .mjs, no type declarations
import { generateJsonSchema } from "../scripts/schema-generator.mjs";

const fixtureDir = join(dirname(fileURLToPath(import.meta.url)), "fixtures");
const fixtureFile = join(fixtureDir, "schema-generator-sample.ts");

describe("generateJsonSchema", () => {
    it("defaults to maxDepth 1: root properties resolve, a nested object property collapses to an opaque object", () => {
        const { schemas, definitions } = generateJsonSchema({
            rootFiles: [fixtureFile],
            rootTypeNames: ["SampleTransitionProps"],
        });

        const ref = schemas.SampleTransitionProps.$ref.replace("#/definitions/", "");
        const resolved = definitions[ref];

        expect(resolved.properties.duration).toEqual({ type: "number" });
        expect(resolved.properties.direction).toEqual({ enum: ["left", "right"] });
        // The nested `position: SamplePosition` collapses to an opaque object — not expanded into
        // its own `x`/`y` properties — exactly the "branching = 1" example from the feature request.
        expect(resolved.properties.position).toEqual({ type: "object" });
        expect(resolved.additionalProperties).toBe(false);
    });

    it("maxDepth 2 expands one further nested-object level", () => {
        const { schemas, definitions } = generateJsonSchema({
            rootFiles: [fixtureFile],
            rootTypeNames: ["SampleTransitionProps"],
            maxDepth: 2,
        });

        const ref = schemas.SampleTransitionProps.$ref.replace("#/definitions/", "");
        const resolved = definitions[ref];

        expect(resolved.properties.position.$ref).toBeDefined();
        const position = definitions[resolved.properties.position.$ref.replace("#/definitions/", "")];
        expect(position).toEqual({
            type: "object",
            properties: { x: { type: "number" }, y: { type: "number" } },
            required: ["x", "y"],
            additionalProperties: false,
        });
    });

    it("a type under interfaceDir is treated as local and expands with no depth cap, regardless of maxDepth", () => {
        const { schemas, definitions } = generateJsonSchema({
            rootFiles: [fixtureFile],
            interfaceDir: fixtureDir,
            rootTypeNames: ["SampleWrapper"],
            maxDepth: 1,
        });

        const wrapper = definitions[schemas.SampleWrapper.$ref.replace("#/definitions/", "")];
        const props = definitions[wrapper.properties.props.$ref.replace("#/definitions/", "")];
        // `position` is itself a local declaration too, so it fully expands into x/y instead of
        // collapsing to an opaque object, unlike the "external" case above at the same maxDepth.
        const position = definitions[props.properties.position.$ref.replace("#/definitions/", "")];
        expect(position.properties).toEqual({ x: { type: "number" }, y: { type: "number" } });
    });

    it("throws a clear error for a name that is neither local nor a root-file top-level declaration", () => {
        expect(() =>
            generateJsonSchema({ rootFiles: [fixtureFile], rootTypeNames: ["DoesNotExist"] }),
        ).toThrow(/DoesNotExist/);
    });

    it("typeNameOverrides short-circuits resolution on the local (AST) path", () => {
        // Under interfaceDir, SampleTransitionProps and SamplePosition are both "local", so
        // `position` would otherwise expand into its own x/y properties with no depth cap (as the
        // "interfaceDir" test above confirms) — the override should pre-empt that entirely.
        const { schemas, definitions } = generateJsonSchema({
            rootFiles: [fixtureFile],
            interfaceDir: fixtureDir,
            rootTypeNames: ["SampleTransitionProps"],
            typeNameOverrides: { SamplePosition: { type: "string" } },
        });

        const resolved = definitions[schemas.SampleTransitionProps.$ref.replace("#/definitions/", "")];
        expect(resolved.properties.position).toEqual({ type: "string" });
    });

    it("includeAllLocalDeclarations adds a definitions entry for every local type, even unreferenced ones", () => {
        const { definitions } = generateJsonSchema({
            rootFiles: [fixtureFile],
            interfaceDir: fixtureDir,
            rootTypeNames: ["SamplePosition"],
            includeAllLocalDeclarations: true,
        });

        // SampleWrapper/SampleTransitionProps are never referenced from the SamplePosition root,
        // but should still get a definitions entry because they're declared under interfaceDir.
        expect(definitions.SampleWrapper).toBeDefined();
        expect(definitions.SampleTransitionProps).toBeDefined();
    });
});
