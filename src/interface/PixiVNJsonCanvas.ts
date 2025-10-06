import {
    ContainerMemory,
    ContainerOptions,
    ImageContainerMemory,
    ImageContainerOptions,
    ImageSprite,
    ImageSpriteMemory,
    ImageSpriteOptions,
    TextMemory,
    TextOptions,
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
export type PixiVNJsonCanvasImageContainerShow = {
    type: "imagecontainer";
    operationType: "show";
    alias: string;
    urls: string[];
    props?: ImageContainerOptions<ImageSprite>;
    transition?: PixiVNJsonMediaTransiotions;
};
export type PixiVNJsonCanvasTextShow = {
    type: "text";
    operationType: "show";
    alias: string;
    text: string;
    props?: TextOptions;
    transition?: PixiVNJsonMediaTransiotions;
};
export type PixiVNJsonImageEdit = {
    type: "image";
    operationType: "edit";
    alias: string;
    props?: Partial<ImageSpriteMemory>;
};
export type PixiVNJsonVideoEdit = {
    type: "video";
    operationType: "edit";
    alias: string;
    props?: Partial<VideoSpriteMemory>;
};
export type PixiVNJsonImageContainerEdit = {
    type: "imagecontainer";
    operationType: "edit";
    alias: string;
    props?: Partial<ImageContainerMemory>;
};
export type PixiVNJsonTextEdit = {
    type: "text";
    operationType: "edit";
    alias: string;
    props?: Partial<TextMemory>;
};
export type PixiVNJsonUnknownEdit<T extends ContainerOptions> = {
    type: "canvaselement";
    operationType: "edit";
    alias: string;
    props?: Partial<T>;
};
export type PixiVNJsonCanvasRemove = {
    type: "image" | "video" | "imagecontainer" | "canvaselement" | "text";
    operationType: "remove";
    alias: string;
    transition?: PixiVNJsonMediaTransiotions;
};
export type PixiVNJsonVideoPauseResume = {
    type: "video";
    operationType: "pause" | "resume";
    alias: string;
};
type PixiVNJsonAssetsLoad = {
    type: "assets" | "bundle";
    operationType: "load" | "lazyload";
    aliases: string[];
};

export type PixiVNJsonCanvasShow =
    | PixiVNJsonCanvasImageContainerShow
    | PixiVNJsonCanvasImageVideoShow
    | PixiVNJsonCanvasTextShow;
export type PixiVNJsonCanvasEdit =
    | PixiVNJsonImageEdit
    | PixiVNJsonVideoEdit
    | PixiVNJsonImageContainerEdit
    | PixiVNJsonTextEdit
    | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory | TextMemory>;

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
