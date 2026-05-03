import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test } from "vitest";
import { PixiVNJson } from "../src";

test("label_end - closes current label and returns to caller", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    labelToOpen: {
                        label: "sub",
                        type: "call",
                    },
                },
                {
                    dialogue: "back in start",
                },
            ],
            sub: [
                {
                    dialogue: "in sub",
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
    // Step 0: opens "sub" label → first step of sub runs
    expect(narration.dialogue).toEqual({ text: "in sub" });
    // Continue: label_end closes sub, returns to start step 1
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: "back in start" });
});

test("dialogue with character - renders with character field", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: {
                        character: "alice",
                        text: "Hello!",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ character: "alice", text: "Hello!" });
});

test("dialogue array text - renders all parts", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("name", "Bob");
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: [
                        "Hello, ",
                        {
                            type: "value",
                            storageOperationType: "get",
                            storageType: "storage",
                            key: "name",
                        },
                        "!",
                    ],
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: ["Hello, ", "Bob", "!"] });
});

test("goNextStep - skips to next step automatically", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    goNextStep: true,
                },
                {
                    dialogue: "auto-advanced",
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(narration.dialogue).toEqual({ text: "auto-advanced" });
});

test("multiple labels in same JSON - each accessible independently", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            labelA: [{ dialogue: "Label A" }],
            labelB: [{ dialogue: "Label B" }],
        },
    };
    await importPixiVNJson(json);
    await narration.call("labelA", {});
    expect(narration.dialogue).toEqual({ text: "Label A" });
    narration.clear();
    await narration.call("labelB", {});
    expect(narration.dialogue).toEqual({ text: "Label B" });
});

test("call type labelToOpen - pushes onto label stack", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            main: [
                {
                    labelToOpen: {
                        label: "chapter1",
                        type: "call",
                    },
                },
                {
                    dialogue: "After chapter 1",
                },
            ],
            chapter1: [
                {
                    dialogue: "Chapter 1 content",
                },
                {
                    end: "label_end",
                    goNextStep: true,
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("main", {});
    expect(narration.dialogue).toEqual({ text: "Chapter 1 content" });
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: "After chapter 1" });
});

test("conditional goNextStep - skips step based on condition", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    storage.set("skip", true);
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    dialogue: "Step 0",
                    goNextStep: {
                        type: "ifelse",
                        condition: {
                            type: "value",
                            storageOperationType: "get",
                            storageType: "storage",
                            key: "skip",
                        },
                        then: true,
                        else: false,
                    },
                },
                {
                    dialogue: "Step 1 (auto-skipped to)",
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    // goNextStep resolves to true → advances immediately to step 1
    expect(narration.dialogue).toEqual({ text: "Step 1 (auto-skipped to)" });
});

test("label tracking - getTimesLabelOpened after calls", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            tracked: [
                {
                    dialogue: {
                        type: "value",
                        storageOperationType: "get",
                        storageType: "label",
                        label: "tracked",
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("tracked", {});
    // After first call, label has been opened once
    const times = narration.getTimesLabelOpened("tracked");
    expect(times).toBeGreaterThanOrEqual(1);
});

test("choices - basic choices menu", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    choices: [
                        { text: "Option A", label: "optA", type: "call", props: {} },
                        { text: "Option B", label: "optB", type: "call", props: {} },
                    ],
                },
            ],
            optA: [{ dialogue: "You chose A" }, { end: "label_end", goNextStep: true }],
            optB: [{ dialogue: "You chose B" }, { end: "label_end", goNextStep: true }],
        },
    };
    await importPixiVNJson(json);
    await narration.call("start", {});
    const choices = narration.choices!;
    expect(choices).toHaveLength(2);
    expect(choices[0].text).toBe("Option A");
    expect(choices[1].text).toBe("Option B");

    await narration.selectChoice(choices[0], {});
    await narration.continue({});
    expect(narration.dialogue).toEqual({ text: "You chose A" });
});

test("stepswitch loop - cycles through elements on repeated visits", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            cycling: [
                {
                    dialogue: {
                        type: "stepswitch",
                        choiceType: "loop",
                        nestedId: "loop1",
                        elements: [
                            "First visit",
                            "Second visit",
                            "Third visit",
                        ],
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("cycling", {});
    expect(narration.dialogue).toEqual({ text: "First visit" });
    narration.clear();
    await narration.call("cycling", {});
    expect(narration.dialogue).toEqual({ text: "Second visit" });
    narration.clear();
    await narration.call("cycling", {});
    expect(narration.dialogue).toEqual({ text: "Third visit" });
    // wraps back around
    narration.clear();
    await narration.call("cycling", {});
    expect(narration.dialogue).toEqual({ text: "First visit" });
});

test("stepswitch sequential - stops at last item when end is lastItem", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    const json: PixiVNJson = {
        labels: {
            seq: [
                {
                    dialogue: {
                        type: "stepswitch",
                        choiceType: "sequential",
                        nestedId: "seq1",
                        end: "lastItem",
                        elements: ["Once", "Twice", "Always"],
                    },
                },
            ],
        },
    };
    await importPixiVNJson(json);
    await narration.call("seq", {});
    expect(narration.dialogue).toEqual({ text: "Once" });
    narration.clear();
    await narration.call("seq", {});
    expect(narration.dialogue).toEqual({ text: "Twice" });
    narration.clear();
    await narration.call("seq", {});
    expect(narration.dialogue).toEqual({ text: "Always" });
    // Beyond end: stays at last item
    narration.clear();
    await narration.call("seq", {});
    expect(narration.dialogue).toEqual({ text: "Always" });
});
