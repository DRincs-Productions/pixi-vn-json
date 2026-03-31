import type { IMediaInstance, SoundPlayOptions } from "@drincs/pixi-vn";

type PixiVNJsonSoundPlay = {
    type: "sound";
    operationType: "play";
    alias: string;
    props?: SoundPlayOptions;
};
type PixiVNJsonSoundRemove = {
    type: "sound";
    operationType: "stop";
    alias: string;
};
type PixiVNJsonSoundPauseResume = {
    type: "sound" | "channel" | "all";
    operationType: "pause" | "resume";
    alias: string;
};
export type PixiVNJsonSoundEdit = {
    type: "sound";
    operationType: "edit";
    alias: string;
    props: Partial<Pick<IMediaInstance, "speed" | "volume" | "muted" | "loop" | "paused">>;
};

type PixiVNJsonSound = PixiVNJsonSoundPlay | PixiVNJsonSoundRemove | PixiVNJsonSoundPauseResume | PixiVNJsonSoundEdit;
export default PixiVNJsonSound;
