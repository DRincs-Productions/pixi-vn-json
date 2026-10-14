import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@drincs/pixi-vn/canvas", () => {
    const fn = (name: string) => vi.fn(async () => [`ticker-${name}`]);
    return {
        transitions: {
            showWithDissolve: fn("dissolve"),
            showWithFade: fn("fade"),
            moveIn: fn("movein"),
            zoomIn: fn("zoomin"),
            pushIn: fn("pushin"),
            wipeIn: fn("wipein"),
            irisIn: fn("irisin"),
            splitIn: fn("splitin"),
            blurIn: fn("blurin"),
            pixelateIn: fn("pixelatein"),
            flashIn: fn("flashin"),
            glitchIn: fn("glitchin"),
            twistIn: fn("twistin"),
            warpIn: fn("warpin"),
            rippleIn: fn("ripplein"),
            noiseDissolveIn: fn("noisedissolvein"),
            tvIn: fn("tvin"),
            pinchIn: fn("pinchin"),
        },
    };
});

// `tests/setup.ts` (a global `setupFiles` entry) already imported the *real*
// `@drincs/pixi-vn/canvas` transitively before this file's `vi.mock` above could register — a
// fresh dynamic import after `vi.resetModules()` is needed to actually pick up the mock.
vi.resetModules();
const { transitions } = await import("@drincs/pixi-vn/canvas");
const { ENTRANCE_TRANSITION_TYPES, entranceTransitionKeySchemas, executeEntranceTransition } =
    await import("@/actions/entrance-transitions");

beforeEach(() => {
    for (const fn of Object.values(transitions)) vi.mocked(fn).mockClear();
});

test("entranceTransitionKeySchemas has one entry per entrance transition type", () => {
    expect(Object.keys(entranceTransitionKeySchemas).sort()).toEqual(
        [...ENTRANCE_TRANSITION_TYPES].sort(),
    );
});

test("entranceTransitionKeySchemas describes a real transition prop and rejects unknown properties", () => {
    // `duration` is a real ShowWithDissolveTransitionProps field.
    const schema = entranceTransitionKeySchemas.dissolve as {
        type: string;
        properties: Record<string, { type?: string }>;
        additionalProperties: boolean;
    };
    expect(schema.type).toBe("object");
    expect(schema.properties.duration).toEqual({ type: "number" });
    // "duratoin" (a typo of "duration") would be rejected by any JSON Schema validator, since
    // unknown properties aren't allowed.
    expect(schema.additionalProperties).toBe(false);
});

test("entranceTransitionKeySchemas types 'duration' as a number for every entrance transition type", () => {
    for (const type of ENTRANCE_TRANSITION_TYPES) {
        const schema = entranceTransitionKeySchemas[type] as {
            properties: Record<string, { type?: string }>;
        };
        expect(schema.properties.duration).toEqual({ type: "number" });
    }
});

test.each([
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
] as const)(
    "executeEntranceTransition('%s') dispatches to transitions.%s",
    async (type, fnName) => {
        const component = { id: "flowerTop-component" } as never;
        const props = { duration: 2 };

        const result = await executeEntranceTransition("flowerTop", component, type, props);

        expect(transitions[fnName]).toHaveBeenCalledWith("flowerTop", component, props);
        expect(result).toEqual([`ticker-${type}`]);
    },
);

test("executeEntranceTransition forwards undefined props (no props given) untouched", async () => {
    await executeEntranceTransition("flowerTop", undefined, "dissolve");
    expect(transitions.showWithDissolve).toHaveBeenCalledWith("flowerTop", undefined, undefined);
});
