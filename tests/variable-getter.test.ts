import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test } from "vitest";
import { PixiVNJson, VariableGetter } from "../src";

test("VariableGetter - custom handler intercepts value", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    // handler intercepts any storage-get for the key "intercepted" and returns a fixed value
    VariableGetter.add((value, next) => {
        if (
            value &&
            typeof value === "object" &&
            "type" in value &&
            (value as any).type === "value" &&
            (value as any).storageOperationType === "get" &&
            (value as any).key === "intercepted"
        ) {
            return "CUSTOM" as any;
        }
        return next(value);
    });

    // "intercepted" key is never set in storage; handler provides the value
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "intercepted",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "CUSTOM" });

    VariableGetter.clear();
});

test("VariableGetter - custom handler passes through non-matching values", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    // handler only touches strings starting with "!"
    VariableGetter.add((value, next) => {
        if (typeof value === "string" && value.startsWith("!")) {
            return value.slice(1).toUpperCase() as any;
        }
        return next(value);
    });

    storage.set("msg", "hello");

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "msg",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    // "hello" is plain string and doesn't start with "!", so handler passes through
    expect(narration.dialogue).toEqual({ text: "hello" });

    VariableGetter.clear();
});

test("VariableGetter - no handlers, plain value passthrough", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    storage.set("name", "Alice");

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "name",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "Alice" });
});

test("VariableGetter - multiple handlers chain correctly", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    const callLog: string[] = [];

    // first handler
    VariableGetter.add((value, next) => {
        callLog.push("handler1");
        return next(value);
    });

    // second handler
    VariableGetter.add((value, next) => {
        callLog.push("handler2");
        return next(value);
    });

    storage.set("x", 42);

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "x",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "42" });
    // Both handlers were invoked
    expect(callLog).toContain("handler1");
    expect(callLog).toContain("handler2");

    VariableGetter.clear();
});

test("VariableGetter - handler registered via main index affects JsonUnifier.getLogichValue", () => {
    VariableGetter.clear();

    // handler added via the main-index export must be seen by JsonUnifier,
    // which is initialised with VariableGetter.getLogichValue from the actions sub-path.
    // If the two are different instances (bundle duplication bug) this call returns undefined.
    VariableGetter.add((value, next) => {
        if (
            value &&
            typeof value === "object" &&
            "key" in value &&
            (value as any).key === "direct_check"
        ) {
            return "FROM_HANDLER" as any;
        }
        return next(value);
    });

    const result = JsonUnifier.getLogichValue({
        type: "value",
        storageOperationType: "get",
        storageType: "storage",
        key: "direct_check",
    });

    expect(result).toBe("FROM_HANDLER");

    VariableGetter.clear();
});

test("VariableGetter - key-suffix interception pattern (nqtr quest state)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    const mockQuestCompleted: Record<string, boolean> = { aliceQuest: true };

    VariableGetter.add((value, next) => {
        if (
            value &&
            typeof value === "object" &&
            "key" in value &&
            typeof (value as any).key === "string"
        ) {
            const key = (value as any).key as string;
            if (key.endsWith("_completed")) {
                const id = key.slice(0, -"_completed".length);
                return (mockQuestCompleted[id] ?? false) as any;
            }
        }
        return next(value);
    });

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "value",
                            storageOperationType: "get",
                            storageType: "storage",
                            key: "aliceQuest_completed",
                        },
                        then: { dialogue: "quest done" },
                        else: { dialogue: "quest not done" },
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "quest done" });

    VariableGetter.clear();
});

test("VariableGetter - key-suffix interception for currentStageIndex", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    const stageIndexes: Record<string, number> = { mainQuest: 2 };

    VariableGetter.add((value, next) => {
        if (
            value &&
            typeof value === "object" &&
            "key" in value &&
            typeof (value as any).key === "string"
        ) {
            const key = (value as any).key as string;
            if (key.endsWith("_currentStageIndex")) {
                const id = key.slice(0, -"_currentStageIndex".length);
                if (id in stageIndexes) return stageIndexes[id] as any;
            }
        }
        return next(value);
    });

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "mainQuest_currentStageIndex",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "2" });

    VariableGetter.clear();
});

test("VariableGetter - clear restores default storage read", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    VariableGetter.clear();

    VariableGetter.add((value, next) => {
        if (
            value &&
            typeof value === "object" &&
            "key" in value &&
            (value as any).key === "the_key"
        ) {
            return "INTERCEPTED" as any;
        }
        return next(value);
    });

    storage.set("the_key", "REAL");

    const jsonIntercepted: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "the_key",
                    },
                },
            ],
        },
    };

    await importPixiVNJson(jsonIntercepted);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "INTERCEPTED" });

    // after clear, the handler is gone — real storage value is returned
    VariableGetter.clear();

    narration.clear();
    stepHistory.clear();
    await importPixiVNJson(jsonIntercepted);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "REAL" });
});
