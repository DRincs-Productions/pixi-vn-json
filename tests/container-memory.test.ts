import { containerMemorySchema } from "@/actions/container-memory";
import { expect, test } from "vitest";

test("containerMemorySchema excludes 'elements'", () => {
    const schema = containerMemorySchema as {
        properties: Record<string, unknown>;
        required?: string[];
    };
    expect(schema.properties.elements).toBeUndefined();
    expect(schema.required ?? []).not.toContain("elements");
});

test("containerMemorySchema requires 'pixivnId' and types a few known properties", () => {
    const schema = containerMemorySchema as {
        properties: Record<string, { type?: string | string[] }>;
        required?: string[];
        additionalProperties?: boolean;
    };
    expect(schema.required).toContain("pixivnId");
    expect(schema.properties.alpha).toEqual({ type: "number" });
    expect(schema.properties.visible).toEqual({ type: "boolean" });
    expect(schema.additionalProperties).toBe(false);
});
