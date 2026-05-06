import type { MediaInterface, SoundPlayOptionsWithChannel } from "@drincs/pixi-vn";

/**
 * Starts playback of a sound asset.
 */
export type PixiVNJsonSoundPlay = {
    type: "sound";
    operationType: "play";
    /**
     * Unique identifier (alias) used to reference this sound.
     */
    alias: string;
    /**
     * URL of the sound file. If omitted, the alias is used as the URL.
     */
    url?: string;
    /**
     * Playback options such as volume, loop, channel, and start offset.
     */
    props?: SoundPlayOptionsWithChannel;
};
/**
 * Stops a playing sound and removes it from the audio context.
 */
export type PixiVNJsonSoundRemove = {
    type: "sound";
    operationType: "stop";
    /**
     * Alias of the sound to stop.
     */
    alias: string;
};
/**
 * Pauses or resumes a sound, a channel, or all audio.
 */
export type PixiVNJsonSoundPauseResume =
    | {
          type: "sound" | "channel";
          operationType: "pause" | "resume";
          /**
           * Alias of the sound or channel to pause/resume.
           */
          alias: string;
      }
    | {
          type: "all";
          operationType: "pause" | "resume" | "stop";
      };
/**
 * Edits the properties of a currently playing sound (volume, speed, muted, loop, etc.).
 */
export type PixiVNJsonSoundEdit = {
    type: "sound";
    operationType: "edit";
    /**
     * Alias of the sound to edit.
     */
    alias: string;
    /**
     * Partial set of properties to apply to the sound.
     */
    props: Partial<
        Pick<MediaInterface, "speed" | "muted" | "loop" | "paused"> &
            Pick<SoundPlayOptionsWithChannel, "volume">
    >;
};

/**
 * Union of all sound operations — play, stop, pause/resume, and edit.
 */
export type PixiVNJsonSound =
    | PixiVNJsonSoundPlay
    | PixiVNJsonSoundRemove
    | PixiVNJsonSoundPauseResume
    | PixiVNJsonSoundEdit;
