import { TextReplaces } from "@/handlers";
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
