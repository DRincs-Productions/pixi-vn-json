import { stepHistory, storage } from "@drincs/pixi-vn";
import { importPixiVNJson } from "@drincs/pixi-vn-json/importer";
import { narration } from "@drincs/pixi-vn/narration";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("Request input", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    let json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "input",
                            operationType: "request",
                        },
                    ],
                    goNextStep: true,
                },
                {
                    operations: [
                        {
                            type: "input",
                            operationType: "request",
                            valueType: "number",
                            defaultValue: 0,
                        },
                    ],
                    goNextStep: true,
                },
                {
                    operations: [
                        {
                            operationType: "clean",
                            type: "dialogue",
                        },
                    ],
                },
                {
                    operations: [
                        {
                            type: "input",
                            operationType: "request",
                            valueType: "array of string",
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "Hello",
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
    expect(narration.dialogue).toEqual(undefined);
    expect(narration.inputValue).toEqual(undefined);
    await narration.continue({});
    expect(narration.dialogue).toEqual(undefined);
    expect(narration.inputValue).toEqual(0);
});
