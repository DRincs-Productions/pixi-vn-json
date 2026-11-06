import { beforeEach, expect, test, vi } from "vitest";

const mocks = vi.hoisted(() => ({
    showAnimatedSprite: vi.fn(async () => ({})),
    find: vi.fn(),
    remove: vi.fn(),
    showWithFade: vi.fn(async () => undefined),
    load: vi.fn(async () => {}),
}));

vi.mock("@drincs/pixi-vn/canvas", async (importOriginal) => {
    const actual = await importOriginal<typeof import("@drincs/pixi-vn/canvas")>();
    class AnimatedSprite extends actual.AnimatedSprite {
        override async load() {
            await mocks.load();
        }
    }
    return {
        ...actual,
        AnimatedSprite,
        showAnimatedSprite: mocks.showAnimatedSprite,
        canvas: { ...actual.canvas, find: mocks.find, remove: mocks.remove },
        transitions: { ...actual.transitions, showWithFade: mocks.showWithFade },
    };
});

vi.resetModules();
const canvasApi = await import("@drincs/pixi-vn/canvas");
const { animatedSpriteOperation } = await import("@/actions/canvas");

beforeEach(() => {
    vi.clearAllMocks();
});

test("asprite show delegates to showAnimatedSprite", async () => {
    const source = "hero";
    const props = { animationSpeed: 0.5 };

    await animatedSpriteOperation({
        type: "asprite",
        operationType: "show",
        alias: "walk",
        source,
        props,
    });

    expect(mocks.showAnimatedSprite).toHaveBeenCalledWith("walk", source, props);
});

test("asprite show with a transition loads and starts the sprite", async () => {
    await animatedSpriteOperation({
        type: "asprite",
        operationType: "show",
        alias: "walk",
        transition: { type: "fade" },
    });

    expect(mocks.load).toHaveBeenCalledOnce();
    const [alias, sprite] = mocks.showWithFade.mock.calls[0] as unknown[];
    expect(alias).toBe("walk");
    expect(sprite).toBeInstanceOf(canvasApi.AnimatedSprite);
    expect((sprite as canvasApi.AnimatedSprite).playing).toBe(true);
    expect((sprite as canvasApi.AnimatedSprite).source).toEqual({ spritesheet: "walk" });
});

test("asprite edit merges properties into the sprite memory", async () => {
    const sprite = {
        memory: { x: 10, animationSpeed: 1 },
        setMemory: vi.fn().mockResolvedValue(undefined),
    };
    mocks.find.mockReturnValue(sprite);

    await animatedSpriteOperation({
        type: "asprite",
        operationType: "edit",
        alias: "walk",
        props: { animationSpeed: 2 },
    });

    expect(sprite.setMemory).toHaveBeenCalledWith({ x: 10, animationSpeed: 2 });
});

test("asprite remove delegates to canvas.remove", async () => {
    await animatedSpriteOperation({ type: "asprite", operationType: "remove", alias: "walk" });

    expect(mocks.remove).toHaveBeenCalledWith("walk");
});

test.each([
    ["pause", "stop"],
    ["resume", "play"],
] as const)("asprite %s calls sprite.%s", async (operationType, method) => {
    const sprite = { stop: vi.fn(), play: vi.fn() };
    mocks.find.mockReturnValue(sprite);

    await animatedSpriteOperation({ type: "asprite", operationType, alias: "walk" });

    expect(sprite[method]).toHaveBeenCalledOnce();
});

test("asprite goto selects a zero-based frame and preserves the playing state", async () => {
    const sprite = { haveEmptyTexture: true, totalFrames: 3, setFrame: vi.fn() };
    mocks.find.mockReturnValue(sprite);

    await animatedSpriteOperation({ type: "asprite", operationType: "goto", alias: "walk", frame: 2 });

    expect(sprite.setFrame.mock.calls[0]).toEqual([2]);
});

test("asprite goto rejects a frame outside a loaded animation", async () => {
    const sprite = { haveEmptyTexture: false, totalFrames: 3, setFrame: vi.fn() };
    mocks.find.mockReturnValue(sprite);

    await expect(
        animatedSpriteOperation({ type: "asprite", operationType: "goto", alias: "walk", frame: 3 }),
    ).rejects.toThrow(RangeError);
    expect(sprite.setFrame).not.toHaveBeenCalled();
});

test.each([-1, 1.5, Number.NaN])("asprite goto rejects invalid frame %s", async (frame) => {
    await expect(
        animatedSpriteOperation({ type: "asprite", operationType: "goto", alias: "walk", frame }),
    ).rejects.toThrow(RangeError);
});
