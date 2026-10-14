import { soundOperation } from "@/actions/sound";
import { sound } from "@drincs/pixi-vn/sound";
import { afterEach, expect, test, vi } from "vitest";

afterEach(() => {
    vi.restoreAllMocks();
});

test("sound edit applies playbackRate, mute, loop and paused to the media instance", () => {
    const media = { volume: { value: 0 }, playbackRate: 1, mute: false, loop: false, paused: false };
    vi.spyOn(sound, "find").mockReturnValue(media as never);
    soundOperation({
        type: "sound",
        operationType: "edit",
        alias: "bgm",
        props: { playbackRate: 2, mute: true, loop: true, paused: true, volume: 0.5 },
    });
    expect(media).toMatchObject({
        playbackRate: 2,
        mute: true,
        loop: true,
        paused: true,
        volume: { value: 0.5 },
    });
});

test("sound edit does nothing when the sound is not playing", () => {
    vi.spyOn(sound, "find").mockReturnValue(undefined);
    expect(() =>
        soundOperation({ type: "sound", operationType: "edit", alias: "x", props: { mute: true } }),
    ).not.toThrow();
});
