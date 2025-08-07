import { SoundPlayOptions } from "@drincs/pixi-vn";

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
    type: "sound";
    operationType: "pause" | "resume";
    alias: string;
};
type PixiVNJsonSoundVolume = {
    type: "sound";
    operationType: "volume";
    alias: string;
    value: number;
};

type PixiVNJsonSound = PixiVNJsonSoundPlay | PixiVNJsonSoundRemove | PixiVNJsonSoundPauseResume | PixiVNJsonSoundVolume;
export default PixiVNJsonSound;
