import { animatedSpriteOperation } from "@/actions/canvas";
import * as canvasApi from "@drincs/pixi-vn/canvas";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
    vi.restoreAllMocks();
});

test("asprite show delegates to showAnimatedSprite", async () => {
    const show = vi.spyOn(canvasApi, "showAnimatedSprite").mockResolvedValue({} as never);
    const source = "hero";
    const props = { animationSpeed: 0.5 };

    await animatedSpriteOperation({
        type: "asprite",
        operationType: "show",
        alias: "walk",
        source,
        props,
    });

    expect(show).toHaveBeenCalledWith("walk", source, props);
});

test("asprite show with a transition loads and starts the sprite", async () => {
    const load = vi.spyOn(canvasApi.AnimatedSprite.prototype, "load").mockResolvedValue();
    const showWithFade = vi
        .spyOn(canvasApi.transitions, "showWithFade")
        .mockResolvedValue(undefined as never);

    await animatedSpriteOperation({
        type: "asprite",
        operationType: "show",
        alias: "walk",
        transition: { type: "fade" },
    });

    expect(load).toHaveBeenCalledOnce();
    const [alias, sprite] = showWithFade.mock.calls[0] as unknown[];
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
    vi.spyOn(canvasApi.canvas, "find").mockReturnValue(sprite as never);

    await animatedSpriteOperation({
        type: "asprite",
        operationType: "edit",
        alias: "walk",
        props: { animationSpeed: 2 },
    });

    expect(sprite.setMemory).toHaveBeenCalledWith({ x: 10, animationSpeed: 2 });
});

test("asprite remove delegates to canvas.remove", async () => {
    const remove = vi.spyOn(canvasApi.canvas, "remove").mockImplementation(() => {});

    await animatedSpriteOperation({ type: "asprite", operationType: "remove", alias: "walk" });

    expect(remove).toHaveBeenCalledWith("walk");
});

test.each([
    ["pause", "stop"],
    ["resume", "play"],
] as const)("asprite %s calls sprite.%s", async (operationType, method) => {
    const sprite = { stop: vi.fn(), play: vi.fn() };
    vi.spyOn(canvasApi.canvas, "find").mockReturnValue(sprite as never);

    await animatedSpriteOperation({ type: "asprite", operationType, alias: "walk" });

    expect(sprite[method]).toHaveBeenCalledOnce();
});

test("asprite goto selects a zero-based frame and preserves the playing state", async () => {
    const sprite = { haveEmptyTexture: true, totalFrames: 3, setFrame: vi.fn() };
    vi.spyOn(canvasApi.canvas, "find").mockReturnValue(sprite as never);

    await animatedSpriteOperation({ type: "asprite", operationType: "goto", alias: "walk", frame: 2 });

    expect(sprite.setFrame.mock.calls[0]).toEqual([2]);
});

test("asprite goto rejects a frame outside a loaded animation", async () => {
    const sprite = { haveEmptyTexture: false, totalFrames: 3, setFrame: vi.fn() };
    vi.spyOn(canvasApi.canvas, "find").mockReturnValue(sprite as never);

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
