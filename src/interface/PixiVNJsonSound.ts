import { SoundOptions, SoundPlayOptions } from "@drincs/pixi-vn"

type PixiVNJsonSoundAdd = {
    type: "sound",
    operationType: "add",
    alias: string,
    /**
     * The url of the image or video.
     * If the url is not provided, the url will be set to the alias. 
     */
    url?: string,
    props?: SoundOptions
}
type PixiVNJsonSoundPlay = {
    type: "sound",
    operationType: "play",
    alias: string,
    props?: SoundPlayOptions
}
type PixiVNJsonSoundRemove = {
    type: "sound",
    operationType: "remove",
    alias: string,
}
type PixiVNJsonSoundPauseResume = {
    type: "sound",
    operationType: "pause" | "resume",
    alias: string,
}
type PixiVNJsonSoundVolume = {
    type: "sound",
    operationType: "volume",
    alias: string,
    value: number,
}

type PixiVNJsonSound = (PixiVNJsonSoundAdd | PixiVNJsonSoundPlay | PixiVNJsonSoundRemove | PixiVNJsonSoundPauseResume | PixiVNJsonSoundVolume)
export default PixiVNJsonSound
