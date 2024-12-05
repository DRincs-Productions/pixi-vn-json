import { CanvasImageMemory, CanvasVideoMemory, ContainerMemory, ImageSprite } from "@drincs/pixi-vn"
import PixiVNJsonCanvasEffect from "./PixiVNJsonCanvasEffect"
import PixiVNJsonCanvasTicker from "./PixiVNJsonCanvasTicker"
import PixiVNJsonMediaTransiotions from "./PixiVNJsonMediaTransiotions"

type PixiVNJsonCanvasImageVideoShow = {
    type: "image" | "video",
    operationType: "show",
    alias: string,
    /**
     * The url of the image or video.
     * If the url is not provided, the url will be set to the alias. 
     */
    url?: string,
    props?: Partial<CanvasImageMemory>
    transition?: PixiVNJsonMediaTransiotions
}
type PixiVNJsonCanvasImageContainerShow = {
    type: "imagecontainer",
    operationType: "show",
    alias: string,
    urls: string[],
    props?: Partial<ContainerMemory<ImageSprite>>
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
type PixiVNJsonImageContainerEdit = {
    type: "imagecontainer",
    operationType: "edit",
    alias: string,
    props?: Partial<ContainerMemory<ImageSprite>>
}
type PixiVNJsonCanvasRemove = {
    type: "image" | "video" | "imagecontainer",
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

export type PixiVNJsonCanvasShow = PixiVNJsonCanvasImageContainerShow | PixiVNJsonCanvasImageVideoShow

type PixiVNJsonCanvas = (PixiVNJsonCanvasShow | PixiVNJsonImageEdit | PixiVNJsonVideoEdit | PixiVNJsonCanvasRemove | PixiVNJsonImageContainerEdit | PixiVNJsonVideoPauseResume | PixiVNJsonAssetsLoad | PixiVNJsonCanvasTicker | PixiVNJsonCanvasEffect)
export default PixiVNJsonCanvas
