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
        Pick<MediaInterface, "speed" | "muted" | "loop" | "paused"> & {
            /**
             * Volume is a value between 0 and 1, where 0 is silent and 1 is the original volume of the sound. Values above 1 will increase the volume of the sound, while values below 0 will decrease it. For example, a value of 0.5 will make the sound half as loud, while a value of 2 will make it twice as loud.
             */
            volume: number;
        }
    >;
};

type PixiVNJsonSound =
    | PixiVNJsonSoundPlay
    | PixiVNJsonSoundRemove
    | PixiVNJsonSoundPauseResume
    | PixiVNJsonSoundEdit;
export default PixiVNJsonSound;
