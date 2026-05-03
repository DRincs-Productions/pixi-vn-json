import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
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
