import { narration } from "@drincs/pixi-vn/narration";
import { expect, test } from "vitest";
import { importPixiVNJson, PixiVNJson } from "../src";

test("Params", async () => {
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
