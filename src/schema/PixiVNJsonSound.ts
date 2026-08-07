import type { MediaInterface, SoundPlayOptionsWithChannel } from "@drincs/pixi-vn";

/**
 * Playback options such as volume, loop, channel, and start offset.
 */
export type PixiVNJsonSoundPlayProps = SoundPlayOptionsWithChannel;
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
    props?: PixiVNJsonSoundPlayProps;
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
 * Partial set of sound properties that can be applied when editing a currently playing sound.
 */
export type PixiVNJsonSoundEditProps = Partial<
    Pick<MediaInterface, "speed" | "muted" | "loop" | "paused"> & Pick<SoundPlayOptionsWithChannel, "volume">
>;
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
    props: PixiVNJsonSoundEditProps;
};

/**
 * Union of all sound operations — play, stop, pause/resume, and edit.
 */
export type PixiVNJsonSound =
    | PixiVNJsonSoundPlay
    | PixiVNJsonSoundRemove
    | PixiVNJsonSoundPauseResume
    | PixiVNJsonSoundEdit;
