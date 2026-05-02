import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test, vi } from "vitest";
import type { PixiVNJsonFunction } from "../src";
import { PixiVNJson } from "../src";

test("PixiVNJsonFunction as operation - basic call without args", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    const mockFn = vi.fn();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "myFunc",
                            args: [],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "Hello",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", { myFunc: mockFn });
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith();
    expect(narration.dialogue).toEqual({ text: "Hello" });
});

test("PixiVNJsonFunction as operation - call with static args", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    const received: unknown[] = [];
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "collectArgs",
                            args: [42, "hello", true],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "Done",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {
        collectArgs: (...args: unknown[]) => {
            received.push(...args);
        },
    });
    expect(received).toEqual([42, "hello", true]);
    expect(narration.dialogue).toEqual({ text: "Done" });
});

test("PixiVNJsonFunction as operation - call with storage-based args", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    storage.set("score", 100);

    const capturedArgs: unknown[] = [];
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "useScore",
                            args: [
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "score",
                                },
                            ],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "Done",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {
        useScore: (...args: unknown[]) => {
            capturedArgs.push(...args);
        },
    });
    expect(capturedArgs).toEqual([100]);
    expect(narration.dialogue).toEqual({ text: "Done" });
});

test("PixiVNJsonFunction as async operation", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    let resolved = false;
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "asyncWork",
                            args: [],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "After async",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {
        asyncWork: async () => {
            await Promise.resolve();
            resolved = true;
        },
    });
    expect(resolved).toBe(true);
    expect(narration.dialogue).toEqual({ text: "After async" });
});

test("PixiVNJsonFunction in condition leftValue - result used in ifelse", async () => {
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
                                type: "function",
                                functionName: "getNumber",
                                args: [],
                            } as PixiVNJsonFunction,
                            rightValue: 7,
                        },
                        then: {
                            dialogue: "correct",
                        },
                        else: {
                            dialogue: "wrong",
                        },
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", { getNumber: () => 7 });
    expect(narration.dialogue).toEqual({ text: "correct" });
});

test("PixiVNJsonFunction in condition rightValue - result used in ifelse", async () => {
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
                            operator: "!=",
                            leftValue: 5,
                            rightValue: {
                                type: "function",
                                functionName: "getNumber",
                                args: [],
                            } as PixiVNJsonFunction,
                        },
                        then: {
                            dialogue: "different",
                        },
                        else: {
                            dialogue: "same",
                        },
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", { getNumber: () => 99 });
    expect(narration.dialogue).toEqual({ text: "different" });
});

test("PixiVNJsonFunction as operation - function not in props does nothing", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "missingFunc",
                            args: [],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "Still runs",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    // No "missingFunc" in props - should not throw, just silently skip
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "Still runs" });
});

test("PixiVNJsonFunction as operation - multiple function calls in sequence", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    const callOrder: string[] = [];
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "firstFunc",
                            args: [],
                        },
                        {
                            type: "function",
                            functionName: "secondFunc",
                            args: [],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "Finished",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {
        firstFunc: () => callOrder.push("first"),
        secondFunc: () => callOrder.push("second"),
    });
    expect(callOrder).toEqual(["first", "second"]);
    expect(narration.dialogue).toEqual({ text: "Finished" });
});

test("PixiVNJsonFunction in complex arithmetic condition with storage args and call flow", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    const testCallArgs: unknown[][] = [];
    const randomEventCallArgs: unknown[][] = [];

    const props = {
        // test(0) returns 0
        test: (...args: unknown[]) => {
            testCallArgs.push([...args]);
            return 0;
        },
        // random_event_value(max, offset) returns max (i.e. first arg)
        random_event_value: (...args: unknown[]) => {
            randomEventCallArgs.push([...args]);
            return args[0] as number;
        },
    };

    const json: PixiVNJson = {
        initialOperations: [
            {
                type: "value",
                storageOperationType: "set",
                storageType: "storage",
                key: "max",
                value: 3,
            },
        ],
        labels: {
            main: [
                {
                    dialogue: "You walk through the forest.",
                },
                {
                    labelToOpen: {
                        label: "random_event",
                        type: "call",
                        params: undefined,
                    },
                    glueEnabled: undefined,
                },
                {
                    dialogue: "You continue your journey.",
                },
                {
                    end: "game_end",
                },
            ],
            random_event: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "==",
                            rightValue: 1,
                            leftValue: {
                                type: "arithmetic",
                                operator: "+",
                                rightValue: 3,
                                leftValue: {
                                    type: "arithmetic",
                                    operator: "+",
                                    rightValue: {
                                        type: "function",
                                        functionName: "test",
                                        args: [0],
                                    },
                                    leftValue: {
                                        type: "arithmetic",
                                        operator: "+",
                                        rightValue: 1,
                                        leftValue: {
                                            type: "arithmetic",
                                            operator: "+",
                                            rightValue: {
                                                type: "function",
                                                functionName: "random_event_value",
                                                args: [
                                                    {
                                                        type: "value",
                                                        storageOperationType: "get",
                                                        storageType: "storage",
                                                        key: "max",
                                                    },
                                                    {
                                                        type: "arithmetic",
                                                        operator: "+",
                                                        rightValue: 0,
                                                        leftValue: 0,
                                                    },
                                                ],
                                            },
                                            leftValue: 2,
                                        },
                                    },
                                },
                            },
                        },
                        then: {
                            dialogue: "You encounter an animal.",
                        },
                        else: {
                            conditionalStep: {
                                type: "ifelse",
                                condition: 2,
                                then: {
                                    dialogue: "You find a coin.",
                                },
                                else: {
                                    dialogue: "Nothing happens.",
                                },
                            },
                        },
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);

    // initialOperations sets storage "max" = 3
    expect(storage.get("max")).toEqual(3);

    // main step 0: dialogue "You walk through the forest."
    await narration.call("main", props);
    expect(narration.dialogue).toEqual({ text: "You walk through the forest." });

    // main step 1: call random_event
    // condition: ((2 + random_event_value(3, 0)) + 1 + test(0)) + 3
    //          = ((2 + 3) + 1 + 0) + 3 = 9 ≠ 1  →  false
    // else: condition 2 (truthy) → "You find a coin."
    await narration.continue(props);
    expect(narration.dialogue).toEqual({ text: "You find a coin." });

    // verify random_event_value was called with resolved args: max=3, 0+0=0
    expect(randomEventCallArgs.length).toBeGreaterThan(0);
    expect(randomEventCallArgs[0]).toEqual([3, 0]);

    // verify test was called with the static arg: 0
    expect(testCallArgs.length).toBeGreaterThan(0);
    expect(testCallArgs[0]).toEqual([0]);

    // random_event ends (call), return to main step 2
    await narration.continue(props);
    expect(narration.dialogue).toEqual({ text: "You continue your journey." });
});

test("PixiVNJsonFunction as operation - function modifies storage", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "function",
                            functionName: "setPoints",
                            args: [50],
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "points",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {
        setPoints: (value: number) => storage.set("points", value),
    });
    expect(narration.dialogue).toEqual({ text: "50" });
});
