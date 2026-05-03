import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("flagStorage - set and get flag", async () => {
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
                            storageType: "flagStorage",
                            key: "visited",
                            value: true,
                        },
                    ],
                    goNextStep: true,
                },
                {
                    conditionalStep: {
                        type: "ifelse",
                        condition: {
                            type: "value",
                            storageOperationType: "get",
                            storageType: "flagStorage",
                            key: "visited",
                        },
                        then: { dialogue: "flag set" },
                        else: { dialogue: "flag not set" },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "flag set" });
});

test("storage - set and get storage value", async () => {
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
                            key: "myKey",
                            value: "myValue",
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "myKey",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "myValue" });
});

test("storage - set value using arithmetic", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("counter", 5);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "value",
                            storageOperationType: "set",
                            storageType: "storage",
                            key: "counter",
                            value: {
                                type: "arithmetic",
                                operator: "+",
                                leftValue: {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "counter",
                                },
                                rightValue: 1,
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
                        key: "counter",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "6" });
});

test("tempstorage - set and get temp variable", async () => {
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
                            storageType: "tempstorage",
                            key: "tmpVal",
                            value: "temporary",
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "tempstorage",
                        key: "tmpVal",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "temporary" });
});

test("initialOperations - sets storage before label runs", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        initialOperations: [
            {
                type: "value",
                storageOperationType: "set",
                storageType: "storage",
                key: "initial",
                value: 99,
            },
        ],
        labels: {
            start: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "storage",
                        key: "initial",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    expect(storage.get("initial")).toEqual(99);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "99" });
});

test("storage - logic type retrieves computed value", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("n", 5);
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
                            operator: "*",
                            leftValue: {
                                type: "value",
                                storageOperationType: "get",
                                storageType: "storage",
                                key: "n",
                            },
                            rightValue: 2,
                        },
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "10" });
});

test("storage - conditional set using ifelse", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("isHero", true);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "value",
                            storageOperationType: "set",
                            storageType: "storage",
                            key: "title",
                            value: {
                                type: "ifelse",
                                condition: {
                                    type: "value",
                                    storageOperationType: "get",
                                    storageType: "storage",
                                    key: "isHero",
                                },
                                then: "Hero",
                                else: "Villain",
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
                        key: "title",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "Hero" });
});
