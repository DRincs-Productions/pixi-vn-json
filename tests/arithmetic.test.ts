import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("arithmetic - addition in dialogue", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("a", 3);
    storage.set("b", 4);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "logic",
                        operation: {
                            type: "arithmetic",
                            operator: "+",
                            leftValue: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "a",
                            },
                            rightValue: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "b",
                            },
                        },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "7" });
});

test("arithmetic - subtraction in condition", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("score", 10);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            leftValue: {
                                type: "arithmetic",
                                operator: "-",
                                leftValue: {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "score",
                                },
                                rightValue: 3,
                            },
                            rightValue: 7,
                        },
                        then: { dialogue: "correct" },
                        else: { dialogue: "wrong" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "correct" });
});

test("arithmetic - multiplication", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("x", 6);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            leftValue: {
                                type: "arithmetic",
                                operator: "*",
                                leftValue: {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "x",
                                },
                                rightValue: 7,
                            },
                            rightValue: 42,
                        },
                        then: { dialogue: "42" },
                        else: { dialogue: "wrong" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "42" });
});

test("arithmetic - division", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "value",
                            storageOperationType: "set",
                            storageType: "storage",
                            key: "result",
                            value: {
                                type: "arithmetic",
                                operator: "/",
                                leftValue: 20,
                                rightValue: 4,
                            },
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "result",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "5" });
});

test("arithmetic - modulo", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            leftValue: {
                                type: "arithmetic",
                                operator: "%",
                                leftValue: 17,
                                rightValue: 5,
                            },
                            rightValue: 2,
                        },
                        then: { dialogue: "yes" },
                        else: { dialogue: "no" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "yes" });
});

test("arithmetic - power (POW)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            leftValue: {
                                type: "arithmetic",
                                operator: "POW",
                                leftValue: 2,
                                rightValue: 10,
                            },
                            rightValue: 1024,
                        },
                        then: { dialogue: "1024" },
                        else: { dialogue: "wrong" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "1024" });
});

test("arithmeticsingle - INT converts value to JS number type", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    // INT converts via Number(): an integer input stays an integer
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "value",
                            storageOperationType: "set",
                            storageType: "storage",
                            key: "intResult",
                            value: {
                                type: "arithmeticsingle",
                                operator: "INT",
                                leftValue: 7,
                            },
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "intResult",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "7" });
});

test("arithmeticsingle - FLOOR", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "value",
                            storageOperationType: "set",
                            storageType: "storage",
                            key: "floorResult",
                            value: {
                                type: "arithmeticsingle",
                                operator: "FLOOR",
                                leftValue: 9.99,
                            },
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "floorResult",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "9" });
});

test("arithmetic - nested operations", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    // (2 + 3) * 4 = 20
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            leftValue: {
                                type: "arithmetic",
                                operator: "*",
                                leftValue: {
                                    type: "arithmetic",
                                    operator: "+",
                                    leftValue: 2,
                                    rightValue: 3,
                                },
                                rightValue: 4,
                            },
                            rightValue: 20,
                        },
                        then: { dialogue: "20" },
                        else: { dialogue: "wrong" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "20" });
});
