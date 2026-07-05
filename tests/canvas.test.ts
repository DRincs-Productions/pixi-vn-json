import { importPixiVNJson } from "@drincs/pixi-vn-json/interpreter";
import { canvas } from "@drincs/pixi-vn/canvas";
import { stepHistory } from "@drincs/pixi-vn/history";
import { narration } from "@drincs/pixi-vn/narration";
import { storage } from "@drincs/pixi-vn/storage";
import { expect, test, vi } from "vitest";
import { PixiVNJson } from "../src";

test("PixiVNJsonCanvasClear as operation - calls canvas.removeAll()", async () => {
    narration.clear();
    storage.clear();
    stepHistory.clear();
    // `canvas` requires a real PIXI application (unavailable under jsdom), so the
    // "remove everything" primitive itself is verified here; `removeAll`'s own
    // behavior is covered by @drincs/pixi-vn.
    const removeAllSpy = vi.spyOn(canvas, "removeAll").mockImplementation(() => {});

    const json: PixiVNJson = {
        labels: {
            start: [
                {
                    operations: [
                        {
                            type: "canvas",
                            operationType: "clear",
                        },
                    ],
                    goNextStep: true,
                },
                {
                    dialogue: "cleared",
                },
            ],
        },
    };

    await importPixiVNJson(json);
    await narration.call("start", {});
    expect(removeAllSpy).toHaveBeenCalledTimes(1);
    expect(narration.dialogue).toEqual({ text: "cleared" });

    removeAllSpy.mockRestore();
});
