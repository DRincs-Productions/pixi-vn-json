import {
    CanvasImageMemory,
    CanvasVideoMemory,
    ContainerMemory,
    ContainerOptions,
    ImageContainerMemory,
    ImageContainerOptions,
    ImageSprite,
    ImageSpriteOptions,
} from "@drincs/pixi-vn";
import PixiVNJsonCanvasEffect from "./PixiVNJsonCanvasEffect";
import PixiVNJsonCanvasTicker from "./PixiVNJsonCanvasTicker";
import PixiVNJsonMediaTransiotions from "./PixiVNJsonMediaTransiotions";

type PixiVNJsonCanvasImageVideoShow = {
    type: "image" | "video";
    operationType: "show";
    alias: string;
    /**
     * The url of the image or video.
     * If the url is not provided, the url will be set to the alias.
     */
    url?: string;
    props?: ImageSpriteOptions;
    transition?: PixiVNJsonMediaTransiotions;
};
type PixiVNJsonCanvasImageContainerShow = {
    type: "imagecontainer";
    operationType: "show";
    alias: string;
    urls: string[];
    props?: ImageContainerOptions<ImageSprite>;
    transition?: PixiVNJsonMediaTransiotions;
};
type PixiVNJsonImageEdit = {
    type: "image";
    operationType: "edit";
    alias: string;
    props?: Partial<CanvasImageMemory>;
};
type PixiVNJsonVideoEdit = {
    type: "video";
    operationType: "edit";
    alias: string;
    props?: Partial<CanvasVideoMemory>;
};
type PixiVNJsonImageContainerEdit = {
    type: "imagecontainer";
    operationType: "edit";
    alias: string;
    props?: Partial<ImageContainerMemory>;
};
type PixiVNJsonUnknownEdit<T extends ContainerOptions> = {
    type: "canvaselement";
    operationType: "edit";
    alias: string;
    props?: Partial<T>;
};
export type PixiVNJsonCanvasRemove = {
    type: "image" | "video" | "imagecontainer" | "canvaselement";
    operationType: "remove";
    alias: string;
    transition?: PixiVNJsonMediaTransiotions;
};
type PixiVNJsonVideoPauseResume = {
    type: "video";
    operationType: "pause" | "resume";
    alias: string;
};
type PixiVNJsonAssetsLoad = {
    type: "assets";
    operationType: "load";
    assets: string[];
};

export type PixiVNJsonCanvasShow = PixiVNJsonCanvasImageContainerShow | PixiVNJsonCanvasImageVideoShow;
export type PixiVNJsonCanvasEdit =
    | PixiVNJsonImageEdit
    | PixiVNJsonVideoEdit
    | PixiVNJsonImageContainerEdit
    | PixiVNJsonUnknownEdit<CanvasImageMemory | CanvasVideoMemory | ContainerMemory>;

type PixiVNJsonCanvas =
    | PixiVNJsonCanvasShow
    | PixiVNJsonCanvasEdit
    | PixiVNJsonCanvasRemove
    | PixiVNJsonVideoPauseResume
    | PixiVNJsonAssetsLoad
    | PixiVNJsonCanvasTicker
    | PixiVNJsonCanvasEffect;
export default PixiVNJsonCanvas;
