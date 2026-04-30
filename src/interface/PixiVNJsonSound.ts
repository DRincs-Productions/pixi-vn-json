import type { MediaInterface, SoundPlayOptionsWithChannel } from "@drincs/pixi-vn";

type PixiVNJsonSoundPlay = {
    type: "sound";
    operationType: "play";
    alias: string;
    url?: string;
    props?: SoundPlayOptionsWithChannel;
};
type PixiVNJsonSoundRemove = {
    type: "sound";
    operationType: "stop";
    alias: string;
};
type PixiVNJsonSoundPauseResume =
    | {
          type: "sound" | "channel";
          operationType: "pause" | "resume";
          alias: string;
      }
    | {
          type: "all";
          operationType: "pause" | "resume" | "stop";
      };
export type PixiVNJsonSoundEdit = {
    type: "sound";
    operationType: "edit";
    alias: string;
    props: Partial<
        Pick<MediaInterface, "speed" | "muted" | "loop" | "paused"> &
            Pick<SoundPlayOptionsWithChannel, "volume">
    >;
};

type PixiVNJsonSound =
    | PixiVNJsonSoundPlay
    | PixiVNJsonSoundRemove
    | PixiVNJsonSoundPauseResume
    | PixiVNJsonSoundEdit;
export default PixiVNJsonSound;
