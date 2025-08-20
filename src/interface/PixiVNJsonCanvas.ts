import type {
    ContainerMemory,
    ContainerOptions,
    ImageContainerMemory,
    ImageContainerOptions,
    ImageSprite,
    ImageSpriteMemory,
    ImageSpriteOptions,
    VideoSpriteMemory,
} from "@drincs/pixi-vn";
import PixiVNJsonCanvasAnimate from "./PixiVNJsonCanvasAnimate";
import PixiVNJsonCanvasEffect from "./PixiVNJsonCanvasEffect";
import PixiVNJsonCanvasTicker from "./PixiVNJsonCanvasTicker";
import PixiVNJsonMediaTransiotions from "./PixiVNJsonMediaTransiotions";

export type PixiVNJsonCanvasImageVideoShow = {
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
export type PixiVNJsonImageEdit = {
    type: "image";
    operationType: "edit";
    alias: string;
    props?: Partial<ImageSpriteMemory>;
};
type PixiVNJsonVideoEdit = {
    type: "video";
    operationType: "edit";
    alias: string;
    props?: Partial<VideoSpriteMemory>;
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
    type: "assets" | "bundle";
    operationType: "load" | "lazyload";
    aliases: string[];
};

export type PixiVNJsonCanvasShow = PixiVNJsonCanvasImageContainerShow | PixiVNJsonCanvasImageVideoShow;
export type PixiVNJsonCanvasEdit =
    | PixiVNJsonImageEdit
    | PixiVNJsonVideoEdit
    | PixiVNJsonImageContainerEdit
    | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory>;

type PixiVNJsonCanvas =
    | PixiVNJsonCanvasShow
    | PixiVNJsonCanvasEdit
    | PixiVNJsonCanvasRemove
    | PixiVNJsonVideoPauseResume
    | PixiVNJsonAssetsLoad
    | PixiVNJsonCanvasTicker
    | PixiVNJsonCanvasAnimate
    | PixiVNJsonCanvasEffect;
export default PixiVNJsonCanvas;
