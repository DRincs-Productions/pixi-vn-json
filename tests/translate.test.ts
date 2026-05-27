import { TextReplaces } from "@/translator";
import { CharacterBaseModel, RegisteredCharacters } from "@drincs/pixi-vn";
import { translator } from "@drincs/pixi-vn-json/translator";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("Translate test 1", async () => {
    let input: PixiVNJson = {
        labels: {
            back_in_london: [
                {
                    dialogue: "We arrived into London at 9.45pm exactly.",
                },
                {
                    labelToOpen: {
                        label: "hurry_home",
                        type: "jump",
                    },
                },
            ],
            hurry_home: [
                {
                    dialogue: "We hurried home to Savile Row as fast as we could.",
                },
                {
                    end: "label_end",
                    goNextStep: true,
                },
            ],
        },
    };
    let expected = {
        "We arrived into London at 9.45pm exactly.": "We arrived into London at 9.45pm exactly.",
        "We hurried home to Savile Row as fast as we could.": "We hurried home to Savile Row as fast as we could.",
    };
    let res = {};
    Object.values(input.labels!).forEach((value) => {
        translator.generateJsonTranslation(value, res);
    });
    expect(res).toEqual(expected);
});

test("generateJsonTranslation applies i18n pre-step when handler is after-translation with i18nInterpolation", async () => {
    const characterId = `sly_${Date.now()}`;
    RegisteredCharacters.add(new CharacterBaseModel(characterId, { name: "Sly" }));

    const handler = (key: string) => RegisteredCharacters.get(key)?.name;
    TextReplaces.add(handler, {
        name: "character name",
        validation: "characterId",
        type: "after-translation",
        i18nInterpolation: true,
        description: "Replaces a character ID with the character's name in the game.",
    });

    const input: PixiVNJson = {
        labels: {
            test_label: [
                {
                    dialogue: `[${characterId}] thrusts her hand out to shake mine.`,
                },
            ],
        },
    };

    const expected = {
        [`[${characterId}] thrusts her hand out to shake mine.`]: `{{[${characterId}]}} thrusts her hand out to shake mine.`,
    };

    const res = {};
    for (const value of Object.values(input.labels!)) {
        await translator.generateJsonTranslation(value, res);
    }

    expect(res).toEqual(expected);

    TextReplaces.remove(handler);
});

test("generateJsonTranslation uses after-before-translation text as i18n key (before-translation handler)", async () => {
    const characterId = `sly_before_${Date.now()}`;
    RegisteredCharacters.add(new CharacterBaseModel(characterId, { name: "Sly" }));

    const handler = (key: string) => RegisteredCharacters.get(key)?.name;
    TextReplaces.add(handler, {
        name: "character name",
        validation: "characterId",
        type: "before-translation",
        description: "Replaces a character ID with the character's name before i18n lookup.",
    });

    const input: PixiVNJson = {
        labels: {
            test_label: [
                {
                    dialogue: `[${characterId}] thrusts her hand out to shake mine.`,
                },
            ],
        },
    };

    // KEY: text after before-translation ("Sly thrusts...") — the actual i18n lookup key.
    // VALUE: replacement wrapped in {{}} for i18n interpolation ("{{Sly}} thrusts..."),
    //        produced by the i18n pre-step ([sly]→{{[sly]}}) followed by before-translation
    //        ({{[sly]}}→{{Sly}}).
    const expected = {
        [`[${characterId}] thrusts her hand out to shake mine.`]: `Sly thrusts her hand out to shake mine.`,
    };

    const res = {};
    for (const value of Object.values(input.labels!)) {
        await translator.generateJsonTranslation(value, res);
    }

    expect(res).toEqual(expected);

    TextReplaces.remove(handler);
});

test("Translate test 2", async () => {
    let input: PixiVNJson = {
        labels: {
            back_in_london: [
                {
                    dialogue: {
                        text: "We arrived into London at 9.45pm exactly.",
                        character: "John",
                    },
                },
            ],
        },
    };
    let expected = {
        "We arrived into London at 9.45pm exactly.": "We arrived into London at 9.45pm exactly.",
    };
    let res = {};
    Object.values(input.labels!).forEach((value) => {
        translator.generateJsonTranslation(value, res);
    });
    expect(res).toEqual(expected);
});

test("generateJsonTranslation: two before-translation handlers with same key produce single {{value}}", async () => {
    const characterId = `sly_before2_${Date.now()}`;
    RegisteredCharacters.add(new CharacterBaseModel(characterId, { name: "Sly" }));

    const fn1 = (key: string) => RegisteredCharacters.get(key)?.name;
    const fn2 = (key: string) => RegisteredCharacters.get(key)?.name;
    TextReplaces.add(fn1, {
        name: "character name",
        validation: "characterId",
        type: "before-translation",
    });
    TextReplaces.add(fn2, {
        name: "character name",
        validation: "characterId",
        type: "before-translation",
    });

    const input: PixiVNJson = {
        labels: {
            test_label: [{ dialogue: `[${characterId}] thrusts her hand out to shake mine.` }],
        },
    };

    // KEY: text after before-translation (characterId replaced by name).
    // VALUE: single {{Sly}}, not {{{{Sly}}}}, even with two handlers.
    const expected = {
        [`[${characterId}] thrusts her hand out to shake mine.`]: `Sly thrusts her hand out to shake mine.`,
    };

    const res = {};
    for (const value of Object.values(input.labels!)) {
        await translator.generateJsonTranslation(value, res);
    }
    expect(res).toEqual(expected);

    TextReplaces.remove(fn1);
    TextReplaces.remove(fn2);
});

test("generateJsonTranslation: two after-translation i18nInterpolation handlers with same key produce single {{value}}", async () => {
    const characterId = `sly_after2_${Date.now()}`;
    RegisteredCharacters.add(new CharacterBaseModel(characterId, { name: "Sly" }));

    const fn1 = (key: string) => RegisteredCharacters.get(key)?.name;
    const fn2 = (key: string) => RegisteredCharacters.get(key)?.name;
    TextReplaces.add(fn1, {
        name: "character name",
        validation: "characterId",
        type: "after-translation",
        i18nInterpolation: true,
    });
    TextReplaces.add(fn2, {
        name: "character name",
        validation: "characterId",
        type: "after-translation",
        i18nInterpolation: true,
    });

    const input: PixiVNJson = {
        labels: {
            test_label: [{ dialogue: `[${characterId}] thrusts her hand out to shake mine.` }],
        },
    };

    // KEY: original text (no before-translation).
    // VALUE: {{Sly}} — the second handler's pre-step else-branch resolves [charId] → Sly
    // inside the already-wrapped {{[charId]}}, giving {{Sly}} instead of {{{{Sly}}}}.
    const expected = {
        [`[${characterId}] thrusts her hand out to shake mine.`]: `{{Sly}} thrusts her hand out to shake mine.`,
    };

    const res = {};
    for (const value of Object.values(input.labels!)) {
        await translator.generateJsonTranslation(value, res);
    }
    expect(res).toEqual(expected);

    TextReplaces.remove(fn1);
    TextReplaces.remove(fn2);
});

test("generateJsonTranslation: one before-translation + one after-translation i18nInterpolation handler with same key", async () => {
    const characterId = `sly_mixed_${Date.now()}`;
    RegisteredCharacters.add(new CharacterBaseModel(characterId, { name: "Sly" }));

    const fnBefore = (key: string) => RegisteredCharacters.get(key)?.name;
    const fnAfter = (key: string) => RegisteredCharacters.get(key)?.name;
    TextReplaces.add(fnBefore, {
        name: "character name before",
        validation: "characterId",
        type: "before-translation",
    });
    TextReplaces.add(fnAfter, {
        name: "character name after",
        validation: "characterId",
        type: "after-translation",
        i18nInterpolation: true,
    });

    const input: PixiVNJson = {
        labels: {
            test_label: [{ dialogue: `[${characterId}] thrusts her hand out to shake mine.` }],
        },
    };

    // KEY: after before-translation (characterId → name), single occurrence.
    // VALUE: {{Sly}} — before-translation wraps and replaces; after-translation pre-step
    //        skips because {{[characterId]}} is already present from the before-translation
    //        pre-step.
    const expected = {
        [`[${characterId}] thrusts her hand out to shake mine.`]: `{{Sly}} thrusts her hand out to shake mine.`,
    };

    const res = {};
    for (const value of Object.values(input.labels!)) {
        await translator.generateJsonTranslation(value, res);
    }
    expect(res).toEqual(expected);

    TextReplaces.remove(fnBefore);
    TextReplaces.remove(fnAfter);
});
