import { animateOperation, effectOperation, imageOperation } from "@/actions/canvas";
import { canvas, effects, ImageSprite, transitions } from "@drincs/pixi-vn/canvas";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
    vi.restoreAllMocks();
});

const REMOVE_TRANSITIONS = [
    ["dissolve", "removeWithDissolve"],
    ["fade", "removeWithFade"],
    ["movein", "moveOut"],
    ["moveout", "moveOut"],
    ["zoomin", "zoomOut"],
    ["zoomout", "zoomOut"],
    ["pushin", "pushOut"],
    ["pushout", "pushOut"],
    ["wipein", "wipeOut"],
    ["wipeout", "wipeOut"],
    ["irisin", "irisOut"],
    ["irisout", "irisOut"],
    ["splitin", "splitOut"],
    ["splitout", "splitOut"],
    ["blurin", "blurOut"],
    ["blurout", "blurOut"],
    ["pixelatein", "pixelateOut"],
    ["pixelateout", "pixelateOut"],
    ["flashin", "flashOut"],
    ["flashout", "flashOut"],
    ["glitchin", "glitchOut"],
    ["glitchout", "glitchOut"],
    ["twistin", "twistOut"],
    ["twistout", "twistOut"],
    ["warpin", "warpOut"],
    ["warpout", "warpOut"],
    ["ripplein", "rippleOut"],
    ["rippleout", "rippleOut"],
    ["noisedissolvein", "noiseDissolveOut"],
    ["noisedissolveout", "noiseDissolveOut"],
    ["tvin", "tvOut"],
    ["tvout", "tvOut"],
    ["pinchin", "pinchOut"],
    ["pinchout", "pinchOut"],
] as const;

test.each(REMOVE_TRANSITIONS)(
    "canvas remove with transition '%s' calls transitions.%s",
    async (type, fnName) => {
        const spy = vi.spyOn(transitions, fnName).mockReturnValue(["ticker"]);
        const props = { duration: 2 };
        await imageOperation({
            type: "image",
            operationType: "remove",
            alias: "bg",
            transition: { type, props, priority: 3 } as never,
        });
        expect(spy).toHaveBeenCalledWith("bg", props, 3);
    },
);

test("canvas remove without transition calls canvas.remove", async () => {
    const spy = vi.spyOn(canvas, "remove").mockImplementation(() => {});
    await imageOperation({ type: "image", operationType: "remove", alias: "bg" });
    expect(spy).toHaveBeenCalledWith("bg");
});

const SHOW_TRANSITIONS = [
    ["dissolve", "showWithDissolve"],
    ["fade", "showWithFade"],
    ["movein", "moveIn"],
    ["zoomin", "zoomIn"],
    ["pushin", "pushIn"],
    ["wipein", "wipeIn"],
    ["irisin", "irisIn"],
    ["splitin", "splitIn"],
    ["blurin", "blurIn"],
    ["pixelatein", "pixelateIn"],
    ["flashin", "flashIn"],
    ["glitchin", "glitchIn"],
    ["twistin", "twistIn"],
    ["warpin", "warpIn"],
    ["ripplein", "rippleIn"],
    ["noisedissolvein", "noiseDissolveIn"],
    ["tvin", "tvIn"],
    ["pinchin", "pinchIn"],
] as const;

test.each(SHOW_TRANSITIONS)(
    "canvas show with transition '%s' calls transitions.%s",
    async (type, fnName) => {
        const spy = vi.spyOn(transitions, fnName).mockResolvedValue(["ticker"]);
        const props = { duration: 2 };
        await imageOperation({
            type: "image",
            operationType: "show",
            alias: "bg",
            url: "bg.png",
            transition: { type, props, priority: 3 } as never,
        });
        expect(spy).toHaveBeenCalledTimes(1);
        const [alias, element, passedProps, priority] = spy.mock.calls[0] as unknown[];
        expect(alias).toBe("bg");
        expect(element).toBeInstanceOf(ImageSprite);
        expect(passedProps).toBe(props);
        expect(priority).toBe(3);
    },
);

const EFFECTS = [
    ["shake", "shakeEffect"],
    ["bounce", "bounceEffect"],
    ["pulse", "pulseEffect"],
    ["hop", "hopEffect"],
    ["wiggle", "wiggleEffect"],
    ["nod", "nodEffect"],
    ["sway", "swayEffect"],
    ["punch", "punchEffect"],
    ["glitch", "glitchEffect"],
    ["chromatic-aberration", "chromaticAberrationEffect"],
    ["shockwave", "shockwaveEffect"],
    ["radial-blur", "radialBlurEffect"],
    ["blur-pulse", "blurPulseEffect"],
    ["vignette-pulse", "vignettePulseEffect"],
    ["desaturate", "desaturateEffect"],
    ["glow-pulse", "glowPulseEffect"],
] as const;

test.each(EFFECTS)("canvas effect '%s' calls effects.%s", async (type, fnName) => {
    const spy = vi.spyOn(effects, fnName).mockResolvedValue(["ticker"]);
    const props = { duration: 1 };
    await effectOperation({ type, alias: "bg", props, priority: 2 } as never);
    expect(spy).toHaveBeenCalledWith("bg", props, 2);
});

test("canvas effect without props forwards undefined", async () => {
    const spy = vi.spyOn(effects, "bounceEffect").mockResolvedValue(["ticker"]);
    await effectOperation({ type: "bounce", alias: "bg" });
    expect(spy).toHaveBeenCalledWith("bg", undefined, undefined);
});

test("canvas animate calls canvas.animate with keyframes", () => {
    const spy = vi.spyOn(canvas, "animate").mockReturnValue("id");
    animateOperation({
        type: "animate",
        alias: ["a", "b"],
        keyframes: { x: 100 },
        options: { duration: 2 },
        priority: 1 as never,
    });
    expect(spy).toHaveBeenCalledWith(["a", "b"], { x: 100 }, { duration: 2 }, 1);
});

test("canvas animate-sequence calls canvas.animate with the sequence", () => {
    const spy = vi.spyOn(canvas, "animate").mockReturnValue("id");
    const sequence = [{ x: 100 }, { y: 50 }] as never;
    animateOperation({ type: "animate-sequence", alias: "a", sequence, options: { repeat: 1 } });
    expect(spy).toHaveBeenCalledWith("a", sequence, { repeat: 1 }, undefined);
});
