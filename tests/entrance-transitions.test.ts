import { beforeEach, expect, test, vi } from "vitest";

vi.mock("@drincs/pixi-vn/canvas", () => ({
    showWithDissolve: vi.fn(async () => ["ticker-dissolve"]),
    showWithFade: vi.fn(async () => ["ticker-fade"]),
    moveIn: vi.fn(async () => ["ticker-movein"]),
    zoomIn: vi.fn(async () => ["ticker-zoomin"]),
    pushIn: vi.fn(async () => ["ticker-pushin"]),
}));

// `tests/setup.ts` (a global `setupFiles` entry) already imported the *real*
// `@drincs/pixi-vn/canvas` transitively (via `@/index` → `@drincs/pixi-vn-json/actions` →
// `@/actions/entrance-transitions`) before this file's `vi.mock` above could register — a fresh
// dynamic import after `vi.resetModules()` is needed to actually pick up the mock.
vi.resetModules();
const { showWithDissolve, showWithFade, moveIn, zoomIn, pushIn } =
    await import("@drincs/pixi-vn/canvas");
const { ENTRANCE_TRANSITION_TYPES, entranceTransitionKeySchemas, executeEntranceTransition } =
    await import("@/actions/entrance-transitions");

beforeEach(() => {
    vi.mocked(showWithDissolve).mockClear();
    vi.mocked(showWithFade).mockClear();
    vi.mocked(moveIn).mockClear();
    vi.mocked(zoomIn).mockClear();
    vi.mocked(pushIn).mockClear();
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
    ["dissolve", () => showWithDissolve],
    ["fade", () => showWithFade],
    ["movein", () => moveIn],
    ["zoomin", () => zoomIn],
    ["pushin", () => pushIn],
] as const)(
    "executeEntranceTransition('%s') dispatches to the matching @drincs/pixi-vn/canvas function",
    async (type, getFn) => {
        const component = { id: "flowerTop-component" } as never;
        const props = { duration: 2 };

        const result = await executeEntranceTransition("flowerTop", component, type, props);

        expect(getFn()).toHaveBeenCalledWith("flowerTop", component, props);
        expect(result).toEqual([`ticker-${type}`]);
    },
);

test("executeEntranceTransition forwards undefined props (no props given) untouched", async () => {
    await executeEntranceTransition("flowerTop", undefined, "dissolve");
    expect(showWithDissolve).toHaveBeenCalledWith("flowerTop", undefined, undefined);
});
