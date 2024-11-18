import { ICanvasImageMemory, ICanvasVideoMemory, SoundOptions, SoundPlayOptions } from "@drincs/pixi-vn"
import PixiVNJsonMediaTransiotions from "./PixiVNJsonMediaTransiotions"

type PixiVNJsonCanvasShow = {
    type: "image" | "video",
    operationType: "show",
    alias: string,
    url: string,
    props?: Partial<ICanvasImageMemory>
    transition?: PixiVNJsonMediaTransiotions
}
type PixiVNJsonImageEdit = {
    type: "image",
    operationType: "edit",
    alias: string,
    props?: Partial<ICanvasImageMemory>
}
type PixiVNJsonVideoEdit = {
    type: "video",
    operationType: "edit",
    alias: string,
    props?: Partial<ICanvasVideoMemory>
}
type PixiVNJsonCanvasRemove = {
    type: "image" | "video",
    operationType: "remove",
    alias: string,
    transition?: PixiVNJsonMediaTransiotions
}
type PixiVNJsonVideoPauseResume = {
    type: "video",
    operationType: "pause" | "resume",
    alias: string,
}
type PixiVNJsonAssetsLoad = {
    type: "assets",
    operationType: "load",
    assets: string[],
}

export type PixiVNJsonCanvas = (PixiVNJsonCanvasShow | PixiVNJsonImageEdit | PixiVNJsonVideoEdit | PixiVNJsonCanvasRemove | PixiVNJsonVideoPauseResume | PixiVNJsonAssetsLoad)

type PixiVNJsonSoundAdd = {
    type: "sound",
    operationType: "add",
    alias: string,
    url: string,
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

export type PixiVNJsonSound = (PixiVNJsonSoundAdd | PixiVNJsonSoundPlay | PixiVNJsonSoundRemove | PixiVNJsonSoundPauseResume | PixiVNJsonSoundVolume)
