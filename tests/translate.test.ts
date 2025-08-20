import { expect, test } from "vitest";
import { PixiVNJson } from "../src";
import TranslatorManager from "../src/internationalization/TranslateManager";

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
        TranslatorManager.generateJsonTranslation(value, res);
    });
    expect(res).toEqual(expected);
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
        TranslatorManager.generateJsonTranslation(value, res);
    });
    expect(res).toEqual(expected);
});
