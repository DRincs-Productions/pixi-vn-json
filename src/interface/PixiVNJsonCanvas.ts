import { CanvasImageMemory, CanvasVideoMemory } from "@drincs/pixi-vn"
import PixiVNJsonCanvasEffect from "./PixiVNJsonCanvasEffect"
import PixiVNJsonCanvasTicker from "./PixiVNJsonCanvasTicker"
import PixiVNJsonMediaTransiotions from "./PixiVNJsonMediaTransiotions"

type PixiVNJsonCanvasShow = {
    type: "image" | "video",
    operationType: "show",
    alias: string,
    url: string,
    props?: Partial<CanvasImageMemory>
    transition?: PixiVNJsonMediaTransiotions
}
type PixiVNJsonImageEdit = {
    type: "image",
    operationType: "edit",
    alias: string,
    props?: Partial<CanvasImageMemory>
}
type PixiVNJsonVideoEdit = {
    type: "video",
    operationType: "edit",
    alias: string,
    props?: Partial<CanvasVideoMemory>
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

type PixiVNJsonCanvas = (PixiVNJsonCanvasShow | PixiVNJsonImageEdit | PixiVNJsonVideoEdit | PixiVNJsonCanvasRemove | PixiVNJsonVideoPauseResume | PixiVNJsonAssetsLoad | PixiVNJsonCanvasTicker | PixiVNJsonCanvasEffect)
export default PixiVNJsonCanvas
