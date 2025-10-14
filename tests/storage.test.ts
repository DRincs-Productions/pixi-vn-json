import { stepHistory, storage } from "@drincs/pixi-vn";
import { importPixiVNJson } from "@drincs/pixi-vn-json/importer";
import { narration } from "@drincs/pixi-vn/narration";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("Params", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    labelToOpen: {
                        label: "test",
                        type: "jump",
                        params: [1],
                    },
                    glueEnabled: undefined,
                },
            ],
            test: [
                {
                    dialogue: "Value received: ",
                    glueEnabled: true,
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageType: "params",
                        storageOperationType: "get",
                        key: 0,
                    },
                    glueEnabled: true,
                    goNextStep: true,
                },
                {
                    dialogue: ".",
                },
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            rightValue: 1,
                            leftValue: {
                                type: "value",
                                storageType: "params",
                                storageOperationType: "get",
                                key: 0,
                            },
                        },
                        then: {
                            dialogue: "True",
                        },
                        else: {
                            dialogue: "False",
                        },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: ["Value received: ", "1", "."] });
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: "True" });
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: "True" });
});

test("Params 2", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    let json: PixiVNJson = {
        labels: {
            "start_|_c-0": [
                {
                    labelToOpen: {
                        label: "Flashlight",
                        type: "jump",
                        params: [false],
                    },
                    glueEnabled: undefined,
                },
            ],
            "start_|_c-1": [
                {
                    labelToOpen: {
                        label: "Flashlight",
                        type: "jump",
                        params: [true],
                    },
                    glueEnabled: undefined,
                },
            ],
            start: [
                {
                    choices: [
                        {
                            text: "false",
                            label: "start_|_c-0",
                            props: {},
                            type: "call",
                            oneTime: true,
                        },
                        {
                            text: "true",
                            label: "start_|_c-1",
                            props: {},
                            type: "call",
                            oneTime: true,
                        },
                    ],
                },
            ],
            "Flashlight_|_c-0": [
                {
                    labelToOpen: {
                        label: "Direction",
                        type: "jump",
                        params: [
                            {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "Head",
                            },
                        ],
                    },
                    glueEnabled: undefined,
                },
            ],
            Flashlight: [
                {
                    dialogue: "Variable: ",
                    glueEnabled: true,
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageType: "params",
                        storageOperationType: "get",
                        key: 0,
                    },
                    glueEnabled: true,
                    goNextStep: true,
                },
                {
                    dialogue: " ",
                    glueEnabled: true,
                    goNextStep: true,
                },
                {
                    operations: [],
                    goNextStep: true,
                    glueEnabled: false,
                },
                {
                    choices: [
                        {
                            text: "Continue",
                            label: "Flashlight_|_c-0",
                            props: {},
                            type: "call",
                            oneTime: true,
                        },
                    ],
                },
            ],
            Direction: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            rightValue: true,
                            leftValue: {
                                type: "value",
                                storageType: "params",
                                storageOperationType: "get",
                                key: 0,
                            },
                        },
                        then: {
                            dialogue: "true",
                        },
                        else: {
                            dialogue: "false",
                        },
                    },
                },
                {
                    end: "game_end",
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    let choices = narration.choices!;
    expect(choices).toEqual([
        {
            label: "start_|_c-0",
            text: "false",
            props: {},
            type: "call",
            oneTime: true,
            choiceIndex: 0,
        },
        {
            label: "start_|_c-1",
            text: "true",
            props: {},
            type: "call",
            oneTime: true,
            choiceIndex: 1,
        },
    ]);
    await narration.selectChoice(choices[0], {});
    await narration.continue({});
    expect(narration.dialogue).toEqual({
        text: ["Variable: ", "false", " "],
    });
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: ["Variable: ", "false", " "] });
    choices = narration.choices!;
    expect(choices).toEqual([
        {
            choiceIndex: 0,
            label: "Flashlight_|_c-0",
            oneTime: true,
            props: {},
            text: "Continue",
            type: "call",
        },
    ]);
    await narration.selectChoice(choices[0], {});
    await narration.continue({});
    expect(narration.dialogue).toEqual({
        character: undefined,
        text: "false",
    });
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: "false" });
});
