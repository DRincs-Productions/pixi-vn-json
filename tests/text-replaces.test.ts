import { TextReplaces } from "@/translator";
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

    const result = TextReplaces.runI18nPreStep("Hello [name]!");
    expect(result).toBe("Hello {{[name]}}!");
    const result2 = TextReplaces.replace(result, { type: "before-translation" });
    expect(result2).toBe("Hello {{[name]}}!");
    const result3 = TextReplaces.replace(result2, { type: "after-translation" });
    expect(result3).toBe("Hello {{Mario}}!");

    TextReplaces.remove(handler);
});

test("TextReplaces i18nInterpolation: first occurrence becomes {{value}}, rest replaced normally", () => {
    const handler = (key: string) => (key === "player" ? "Luigi" : undefined);
    TextReplaces.add(handler, {
        name: "i18n-multi-handler",
        validation: /^player$/,
        i18nInterpolation: true,
    });

    const result = TextReplaces.runI18nPreStep("[player] met [player] and [player] again");
    expect(result).toBe("{{[player]}} met {{[player]}} and {{[player]}} again");
    const result2 = TextReplaces.replace(result, { type: "before-translation" });
    expect(result2).toBe("{{[player]}} met {{[player]}} and {{[player]}} again");
    const result3 = TextReplaces.replace(result2, {
        type: "after-translation",
    });
    expect(result3).toBe("{{Luigi}} met {{Luigi}} and {{Luigi}} again");

    TextReplaces.remove(handler);
});

test("TextReplaces i18nInterpolation: skips key when handler returns undefined", () => {
    const handler = (key: string) => (key === "known" ? "value" : undefined);
    TextReplaces.add(handler, {
        name: "i18n-skip-handler",
        validation: "all",
        i18nInterpolation: true,
    });

    const result = TextReplaces.runI18nPreStep("[known] and [unknown]");
    expect(result).toBe("{{[known]}} and [unknown]");
    const result2 = TextReplaces.replace(result, { type: "before-translation" });
    expect(result2).toBe("{{[known]}} and [unknown]");
    const result3 = TextReplaces.replace(result2, { type: "after-translation" });
    expect(result3).toBe("{{value}} and [unknown]");

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

    const result = TextReplaces.runI18nPreStep("[item] [item] [item]");
    expect(result).toBe("{{[item]}} {{[item]}} {{[item]}}");
    const result2 = TextReplaces.replace(result, { type: "before-translation" });
    expect(result2).toBe("{{[item]}} {{[item]}} {{[item]}}");
    const result3 = TextReplaces.replace(result2, { type: "after-translation" });
    expect(result3).toBe("{{sword}} {{sword}} {{sword}}");
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

test("TextReplaces i18nInterpolation: two after-translation handlers with same key produce single {{value}}", () => {
    const handler1 = (key: string) => (key === "player" ? "Luigi" : undefined);
    const handler2 = (key: string) => (key === "player" ? "Luigi" : undefined);
    TextReplaces.add(handler1, {
        name: "i18n-dup-after-1",
        validation: /^player$/,
        i18nInterpolation: true,
    });
    TextReplaces.add(handler2, {
        name: "i18n-dup-after-2",
        validation: /^player$/,
        i18nInterpolation: true,
    });

    const result = TextReplaces.runI18nPreStep("[player] met [player]");
    expect(result).toBe("{{[player]}} met {{[player]}}");
    const result2 = TextReplaces.replace(result, { type: "before-translation" });
    expect(result2).toBe("{{[player]}} met {{[player]}}");
    const result3 = TextReplaces.replace(result2, { type: "after-translation" });
    expect(result3).toBe("{{Luigi}} met {{Luigi}}");

    TextReplaces.remove(handler1);
    TextReplaces.remove(handler2);
});

test("TextReplaces i18nInterpolation: applyI18nPreStepToAll with two before-translation handlers same key produces single {{value}}", () => {
    const handler1 = (key: string) => (key === "hero" ? "Mario" : undefined);
    const handler2 = (key: string) => (key === "hero" ? "Mario" : undefined);
    TextReplaces.add(handler1, {
        name: "i18n-prestep-dup-1",
        validation: /^hero$/,
        type: "before-translation",
    });
    TextReplaces.add(handler2, {
        name: "i18n-prestep-dup-2",
        validation: /^hero$/,
        type: "before-translation",
    });

    const result = TextReplaces.replace("[hero] saves [hero]", {
        type: "before-translation",
    });
    expect(result).toBe("Mario saves Mario");

    TextReplaces.remove(handler1);
    TextReplaces.remove(handler2);
});

test("TextReplaces: before-translation + after-translation handlers on same text work independently", () => {
    const beforeHandler = (key: string) => (key === "greeting" ? "Hello" : undefined);
    const afterHandler = (key: string) => (key === "name" ? "World" : undefined);
    TextReplaces.add(beforeHandler, {
        name: "before-greeting",
        validation: /^greeting$/,
        type: "before-translation",
    });
    TextReplaces.add(afterHandler, {
        name: "after-name",
        validation: /^name$/,
        type: "after-translation",
    });

    // before-translation: replaces [greeting] → Hello, leaves [name] untouched
    const beforeResult = TextReplaces.replace("[greeting] [name]!", { type: "before-translation" });
    expect(beforeResult).toBe("Hello [name]!");

    // after-translation: replaces [name] → World, leaves [greeting] untouched
    const afterResult = TextReplaces.replace("[greeting] [name]!", { type: "after-translation" });
    expect(afterResult).toBe("[greeting] World!");

    TextReplaces.remove(beforeHandler);
    TextReplaces.remove(afterHandler);
});
