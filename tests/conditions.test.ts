import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("union - and condition (both true)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("a", true);
    storage.set("b", true);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "union",
                            unionType: "and",
                            conditions: [
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "a",
                                },
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "b",
                                },
                            ],
                        },
                        then: { dialogue: "both true" },
                        else: { dialogue: "not both" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "both true" });
});

test("union - and condition (one false)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("a", true);
    storage.set("b", false);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "union",
                            unionType: "and",
                            conditions: [
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "a",
                                },
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "b",
                                },
                            ],
                        },
                        then: { dialogue: "both true" },
                        else: { dialogue: "not both" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "not both" });
});

test("union - or condition (one true)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("a", false);
    storage.set("b", true);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "union",
                            unionType: "or",
                            conditions: [
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "a",
                                },
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "b",
                                },
                            ],
                        },
                        then: { dialogue: "at least one" },
                        else: { dialogue: "none" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "at least one" });
});

test("union - or condition (both false)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("a", false);
    storage.set("b", false);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "union",
                            unionType: "or",
                            conditions: [
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "a",
                                },
                                {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "b",
                                },
                            ],
                        },
                        then: { dialogue: "at least one" },
                        else: { dialogue: "none" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "none" });
});

test("union - not condition (negates true)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("active", true);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "union",
                            unionType: "not",
                            condition: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "active",
                            },
                        },
                        then: { dialogue: "inactive" },
                        else: { dialogue: "active" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "active" });
});

test("union - not condition (negates false)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("active", false);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "union",
                            unionType: "not",
                            condition: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "active",
                            },
                        },
                        then: { dialogue: "inactive" },
                        else: { dialogue: "active" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "inactive" });
});

test("compare - CONTAINS operator (match)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("sentence", "Hello world");
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "CONTAINS",
                            leftValue: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "sentence",
                            },
                            rightValue: "world",
                        },
                        then: { dialogue: "found" },
                        else: { dialogue: "not found" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "found" });
});

test("compare - CONTAINS operator (no match)", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("sentence", "Hello world");
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "compare",
                            operator: "CONTAINS",
                            leftValue: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "sentence",
                            },
                            rightValue: "moon",
                        },
                        then: { dialogue: "found" },
                        else: { dialogue: "not found" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "not found" });
});

test("compare - less than (<)", async () => {
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
                            operator: "<",
                            leftValue: 3,
                            rightValue: 10,
                        },
                        then: { dialogue: "less" },
                        else: { dialogue: "not less" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "less" });
});

test("compare - greater than (>)", async () => {
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
                            operator: ">",
                            leftValue: 10,
                            rightValue: 3,
                        },
                        then: { dialogue: "greater" },
                        else: { dialogue: "not greater" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "greater" });
});

test("compare - less than or equal (<=)", async () => {
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
                            operator: "<=",
                            leftValue: 5,
                            rightValue: 5,
                        },
                        then: { dialogue: "lte" },
                        else: { dialogue: "not lte" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "lte" });
});

test("compare - greater than or equal (>=)", async () => {
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
                            operator: ">=",
                            leftValue: 5,
                            rightValue: 5,
                        },
                        then: { dialogue: "gte" },
                        else: { dialogue: "not gte" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "gte" });
});
