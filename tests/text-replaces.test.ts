import { TextReplaces } from "@/handlers";
import { CharacterBaseModel, RegisteredCharacters } from "@drincs/pixi-vn";
import { expect, test } from "vitest";
import { z } from "zod";

test("TextReplaces applies RegExp validation", () => {
    const handler = (key: string) => (key === "name" ? "Mario" : undefined);
    TextReplaces.add(handler, {
        name: "regex-handler",
        validation: /^name$/,
    });

    const result = TextReplaces.replace("Hello [name] [surname]", { type: "after-translation" });
    expect(result).toBe("Hello Mario [surname]");

    TextReplaces.remove(handler);
});

test("TextReplaces applies Zod validation", () => {
    const handler = (key: string) => key.toUpperCase();
    TextReplaces.add(handler, {
        name: "zod-handler",
        validation: z.enum(["player", "npc"]),
    });

    const result = TextReplaces.replace("A [player] B [npc] C [enemy]", {
        type: "after-translation",
    });
    expect(result).toBe("A PLAYER B NPC C [enemy]");

    TextReplaces.remove(handler);
});

test("TextReplaces executes most recently added handler first", () => {
    const executionOrder: string[] = [];

    const handlerA = (key: string) => {
        if (key !== "token") return undefined;
        executionOrder.push("A");
        return "from-A";
    };
    const handlerB = (key: string) => {
        if (key !== "token") return undefined;
        executionOrder.push("B");
        return "from-B";
    };

    TextReplaces.add(handlerA, { name: "order-handler-A", validation: /^token$/ });
    TextReplaces.add(handlerB, { name: "order-handler-B", validation: /^token$/ });

    const result = TextReplaces.replace("[token]", { type: "after-translation" });

    // B was added last, so it runs first and its replacement wins
    expect(executionOrder[0]).toBe("B");
    expect(result).toBe("from-B");

    TextReplaces.remove(handlerA);
    TextReplaces.remove(handlerB);
});

test("TextReplaces i18nInterpolation: single occurrence becomes {{value}}", () => {
    const handler = (key: string) => (key === "name" ? "Mario" : undefined);
    TextReplaces.add(handler, {
        name: "i18n-single-handler",
        validation: /^name$/,
        i18nInterpolation: true,
    });

    // Pre-step: [name] → {{[name]}}
    // applyHandler: replaceAll [name] → "Mario" (also inside {{...}}) → {{Mario}}
    const result = TextReplaces.replace("Hello [name]!", { type: "after-translation" });
    expect(result).toBe("Hello {{Mario}}!");

    TextReplaces.remove(handler);
});

test("TextReplaces i18nInterpolation: first occurrence becomes {{value}}, rest replaced normally", () => {
    const handler = (key: string) => (key === "player" ? "Luigi" : undefined);
    TextReplaces.add(handler, {
        name: "i18n-multi-handler",
        validation: /^player$/,
        i18nInterpolation: true,
    });

    // Pre-step: {{[player]}} met [player] and [player] again
    // applyHandler replaceAll [player] → "Luigi": {{Luigi}} met Luigi and Luigi again
    const result = TextReplaces.replace("[player] met [player] and [player] again", {
        type: "after-translation",
    });
    expect(result).toBe("{{Luigi}} met Luigi and Luigi again");

    TextReplaces.remove(handler);
});

test("TextReplaces i18nInterpolation: skips key when handler returns undefined", () => {
    const handler = (key: string) => (key === "known" ? "value" : undefined);
    TextReplaces.add(handler, {
        name: "i18n-skip-handler",
        validation: "all",
        i18nInterpolation: true,
    });

    // Pre-step: [known] → {{[known]}} ; [unknown] skipped (fn returns undefined)
    // applyHandler: [known] → "value" inside {{...}} → {{value}} ; [unknown] untouched
    const result = TextReplaces.replace("[known] and [unknown]", { type: "after-translation" });
    expect(result).toBe("{{value}} and [unknown]");

    TextReplaces.remove(handler);
});

test("TextReplaces i18nInterpolation: fn is called once per unique key per step (pre-step + handler)", () => {
    const callCount: Record<string, number> = {};
    const handler = (key: string) => {
        callCount[key] = (callCount[key] ?? 0) + 1;
        return key === "item" ? "sword" : undefined;
    };
    TextReplaces.add(handler, {
        name: "i18n-once-handler",
        validation: /^item$/,
        i18nInterpolation: true,
    });

    // Pre-step: {{[item]}} [item] [item]
    // applyHandler replaceAll [item] → "sword": {{sword}} sword sword
    const result = TextReplaces.replace("[item] [item] [item]", { type: "after-translation" });
    expect(result).toBe("{{sword}} sword sword");
    // fn is called once per unique key in the pre-step + once in the normal handler = 2 total,
    // not once per occurrence (which would be 3).
    expect(callCount["item"]).toBe(2);

    TextReplaces.remove(handler);
});

test("TextReplaces i18nInterpolation false behaves like default", () => {
    const handler = (key: string) => (key === "name" ? "Mario" : undefined);
    TextReplaces.add(handler, {
        name: "no-i18n-handler",
        validation: /^name$/,
        i18nInterpolation: false,
    });

    // No pre-step (i18nInterpolation: false), plain replaceAll
    const result = TextReplaces.replace("Hello [name] [name]!", { type: "after-translation" });
    expect(result).toBe("Hello Mario Mario!");

    TextReplaces.remove(handler);
});

test("TextReplaces applies characterId validation", () => {
    const characterId = `test_character_${Date.now()}`;
    RegisteredCharacters.add(
        new CharacterBaseModel(characterId, {
            name: "Test Character",
        }),
    );

    const handler = (key: string) => `<${key}>`;
    TextReplaces.add(handler, {
        name: "character-id-handler",
        validation: "characterId",
    });

    const result = TextReplaces.replace(`Hi [${characterId}] [unknown]`, {
        type: "after-translation",
    });
    expect(result).toBe(`Hi <${characterId}> [unknown]`);

    TextReplaces.remove(handler);
});
