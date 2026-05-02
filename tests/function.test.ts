import { importPixiVNJson } from "@drincs/pixi-vn-json/importer";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test, vi } from "vitest";
import { PixiVNJson } from "../src";
import type { PixiVNJsonFunction } from "../src";

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
