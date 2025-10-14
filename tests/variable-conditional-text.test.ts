import { importPixiVNJson } from "@drincs/pixi-vn-json/importer";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test } from "vitest";
import { PixiVNJson } from "..";

test("Conditional Text 2", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    let json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "value",
                            storageOperationType: "get",
                            storageType: "storage",
                            key: "smth",
                        },
                        then: {
                            type: "resulttocombine",
                            combine: "cross",
                            secondConditionalItem: [
                                {
                                    operations: [
                                        {
                                            type: "operationtoconvert",
                                            values: ["show image"],
                                        },
                                    ],
                                    goNextStep: true,
                                },
                                {
                                    dialogue: "text 1",
                                },
                            ],
                        },
                        else: {
                            type: "resulttocombine",
                            combine: "cross",
                            secondConditionalItem: [
                                {
                                    operations: [
                                        {
                                            type: "operationtoconvert",
                                            values: ["show image"],
                                        },
                                    ],
                                    goNextStep: true,
                                },
                                {
                                    dialogue: "text 2",
                                    goNextStep: true,
                                },
                                {
                                    dialogue: "text 3",
                                },
                            ],
                        },
                    },
                },
                {
                    end: "label_end",
                    goNextStep: true,
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({
        text: [
            "",
            "text 2",
            `

text 3`,
        ],
    });
});
