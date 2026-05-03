import type PixiVNJsonCanvasAnimate from "@/schema/PixiVNJsonCanvasAnimate";
import type PixiVNJsonCanvasEffect from "@/schema/PixiVNJsonCanvasEffect";
import type PixiVNJsonMediaTransiotions from "@/schema/PixiVNJsonMediaTransiotions";
import type {
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

/**
 * Shows an image or video asset on the canvas.
 */
export type PixiVNJsonCanvasImageVideoShow = {
    type: "image" | "video";
    operationType: "show";
    /**
     * Unique identifier (alias) used to reference this element on the canvas.
     */
    alias: string;
    /**
     * The url of the image or video.
     * If the url is not provided, the url will be set to the alias.
     */
    url?: string;
    /**
     * Display options (position, scale, alpha, etc.) for the image or video sprite.
     */
    props?: ImageSpriteOptions;
    /**
     * Optional transition effect applied when the element appears on screen.
     */
    transition?: PixiVNJsonMediaTransiotions;
};
/**
 * Shows an image container (a group of layered images) on the canvas.
 */
export type PixiVNJsonCanvasImageContainerShow = {
    type: "imagecontainer";
    operationType: "show";
    /**
     * Unique identifier (alias) used to reference this element on the canvas.
     */
    alias: string;
    /**
     * The ordered list of image URLs that compose the container layers.
     */
    urls: string[];
    /**
     * Display options for the image container.
     */
    props?: ImageContainerOptions<ImageSprite>;
    /**
     * Optional transition effect applied when the element appears on screen.
     */
    transition?: PixiVNJsonMediaTransiotions;
};
/**
 * Shows a text element on the canvas.
 */
export type PixiVNJsonCanvasTextShow = {
    type: "text";
    operationType: "show";
    /**
     * Unique identifier (alias) used to reference this element on the canvas.
     */
    alias: string;
    /**
     * The string content to display.
     */
    text: string;
    /**
     * Display options (font, style, position, etc.) for the text element.
     */
    props?: TextOptions;
    /**
     * Optional transition effect applied when the element appears on screen.
     */
    transition?: PixiVNJsonMediaTransiotions;
};
/**
 * Edits the properties of an existing image sprite on the canvas.
 */
export type PixiVNJsonImageEdit = {
    type: "image";
    operationType: "edit";
    /**
     * Alias of the canvas element to edit.
     */
    alias: string;
    /**
     * Partial memory/state properties to update on the image sprite.
     */
    props?: Partial<ImageSpriteMemory>;
};
/**
 * Edits the properties of an existing video sprite on the canvas.
 */
export type PixiVNJsonVideoEdit = {
    type: "video";
    operationType: "edit";
    /**
     * Alias of the canvas element to edit.
     */
    alias: string;
    /**
     * Partial memory/state properties to update on the video sprite.
     */
    props?: Partial<VideoSpriteMemory>;
};
/**
 * Edits the properties of an existing image container on the canvas.
 */
export type PixiVNJsonImageContainerEdit = {
    type: "imagecontainer";
    operationType: "edit";
    /**
     * Alias of the canvas element to edit.
     */
    alias: string;
    /**
     * Partial memory/state properties to update on the image container.
     */
    props?: Partial<ImageContainerMemory>;
};
/**
 * Edits the properties of an existing text element on the canvas.
 */
export type PixiVNJsonTextEdit = {
    type: "text";
    operationType: "edit";
    /**
     * Alias of the canvas element to edit.
     */
    alias: string;
    /**
     * Partial memory/state properties to update on the text element.
     */
    props?: Partial<TextMemory>;
};
/**
 * Edits the properties of an unknown/generic canvas element.
 * Use this when the specific element type is not one of the built-in kinds.
 */
export type PixiVNJsonUnknownEdit<T extends ContainerOptions<any>> = {
    type: "canvaselement";
    operationType: "edit";
    /**
     * Alias of the canvas element to edit.
     */
    alias: string;
    /**
     * Partial options/properties to update on the canvas element.
     */
    props?: Partial<T>;
};
/**
 * Removes a canvas element from the stage, optionally with a transition.
 */
export type PixiVNJsonCanvasRemove = {
    type: "image" | "video" | "imagecontainer" | "canvaselement" | "text";
    operationType: "remove";
    /**
     * Alias of the canvas element to remove.
     */
    alias: string;
    /**
     * Optional transition effect applied while the element disappears.
     */
    transition?: PixiVNJsonMediaTransiotions;
};
/**
 * Pauses or resumes playback of a video sprite on the canvas.
 */
export type PixiVNJsonVideoPauseResume = {
    type: "video";
    operationType: "pause" | "resume";
    /**
     * Alias of the video element to pause or resume.
     */
    alias: string;
};
/**
 * Loads or lazy-loads asset bundles or individual assets into memory.
 */
type PixiVNJsonAssetsLoad = {
    type: "assets" | "bundle";
    operationType: "load" | "lazyload";
    /**
     * List of asset aliases (or bundle names) to load.
     */
    aliases: string[];
};

export type PixiVNJsonCanvasShow =
    | PixiVNJsonCanvasImageContainerShow
    | PixiVNJsonCanvasImageVideoShow
    | PixiVNJsonCanvasTextShow;
/**
 * Union of all canvas-element edit operations.
 */
export type PixiVNJsonCanvasEdit =
    | PixiVNJsonImageEdit
    | PixiVNJsonVideoEdit
    | PixiVNJsonImageContainerEdit
    | PixiVNJsonTextEdit
    | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory | TextMemory>;

/**
 * Union of all canvas operations — show, edit, remove, animate, apply effects, and asset loading.
 */
type PixiVNJsonCanvas =
    | PixiVNJsonCanvasShow
    | PixiVNJsonCanvasEdit
    | PixiVNJsonCanvasRemove
    | PixiVNJsonVideoPauseResume
    | PixiVNJsonAssetsLoad
    | PixiVNJsonCanvasAnimate
    | PixiVNJsonCanvasEffect;
export default PixiVNJsonCanvas;
