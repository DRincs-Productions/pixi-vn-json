import type {
    BlurInOutProps,
    FlashInOutProps,
    GlitchInOutProps,
    IrisInOutProps,
    MoveInOutProps,
    NoiseDissolveInOutProps,
    PinchInOutProps,
    PixelateInOutProps,
    PushInOutProps,
    RippleInOutProps,
    ShowWithDissolveTransitionProps,
    ShowWithFadeTransitionProps,
    SplitInOutProps,
    TvInOutProps,
    TwistInOutProps,
    WarpInOutProps,
    WipeInOutProps,
    ZoomInOutProps,
} from "@drincs/pixi-vn";
import type { UPDATE_PRIORITY } from "pixi.js";

/**
 * Configuration options for the dissolve transition.
 */
export interface DissolveTransitionProps extends ShowWithDissolveTransitionProps {}
/**
 * Cross-dissolve transition — blends the element in or out by gradually changing its opacity.
 */
export type DissolveTransition = {
    type: "dissolve";
    /**
     * Configuration options for the dissolve transition.
     */
    props?: DissolveTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the fade transition.
 */
export interface FadeTransitionProps extends ShowWithFadeTransitionProps {}
/**
 * Fade transition — fades the element in or out by animating its alpha value.
 */
export type FadeTransition = {
    type: "fade";
    /**
     * Configuration options for the fade transition.
     */
    props?: FadeTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the move transition (direction, duration, easing, etc.).
 */
export interface MoveInOutTransitionProps extends MoveInOutProps {}
/**
 * Move-in / Move-out transition — slides the element into or out of the viewport.
 */
export type MoveInOutTransition = {
    type: "movein" | "moveout";
    /**
     * Configuration options for the move transition (direction, duration, easing, etc.).
     */
    props?: MoveInOutTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the zoom transition (scale, duration, easing, etc.).
 */
export interface ZoomInOutTransitionProps extends ZoomInOutProps {}
/**
 * Zoom-in / Zoom-out transition — scales the element into or out of view.
 */
export type ZoomInOutTransition = {
    type: "zoomin" | "zoomout";
    /**
     * Configuration options for the zoom transition (scale, duration, easing, etc.).
     */
    props?: ZoomInOutTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the push transition (direction, duration, easing, etc.).
 */
export interface PushInOutTransitionProps extends PushInOutProps {}
/**
 * Push-in / Push-out transition — pushes the element onto or off the viewport, displacing the current content.
 */
export type PushInOutTransition = {
    type: "pushin" | "pushout";
    /**
     * Configuration options for the push transition (direction, duration, easing, etc.).
     */
    props?: PushInOutTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the wipe transition.
 */
export interface WipeTransitionProps extends WipeInOutProps {}
/**
 * Wipe — reveals or conceals the element with a moving mask edge.
 */
export type WipeInOutTransition = {
    type: "wipein" | "wipeout";
    /**
     * Configuration options for the wipe transition.
     */
    props?: WipeTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the iris transition.
 */
export interface IrisTransitionProps extends IrisInOutProps {}
/**
 * Iris — reveals or conceals the element with a growing/shrinking circular mask.
 */
export type IrisInOutTransition = {
    type: "irisin" | "irisout";
    /**
     * Configuration options for the iris transition.
     */
    props?: IrisTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the split transition.
 */
export interface SplitTransitionProps extends SplitInOutProps {}
/**
 * Split — reveals or conceals the element by splitting it into halves.
 */
export type SplitInOutTransition = {
    type: "splitin" | "splitout";
    /**
     * Configuration options for the split transition.
     */
    props?: SplitTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the blur transition.
 */
export interface BlurTransitionProps extends BlurInOutProps {}
/**
 * Blur — reveals or conceals the element through a blur.
 */
export type BlurInOutTransition = {
    type: "blurin" | "blurout";
    /**
     * Configuration options for the blur transition.
     */
    props?: BlurTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the pixelate transition.
 */
export interface PixelateTransitionProps extends PixelateInOutProps {}
/**
 * Pixelate — reveals or conceals the element through pixelation.
 */
export type PixelateInOutTransition = {
    type: "pixelatein" | "pixelateout";
    /**
     * Configuration options for the pixelate transition.
     */
    props?: PixelateTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the flash transition.
 */
export interface FlashTransitionProps extends FlashInOutProps {}
/**
 * Flash — reveals or conceals the element through a colored flash.
 */
export type FlashInOutTransition = {
    type: "flashin" | "flashout";
    /**
     * Configuration options for the flash transition.
     */
    props?: FlashTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the glitch transition.
 */
export interface GlitchTransitionProps extends GlitchInOutProps {}
/**
 * Glitch — reveals or conceals the element with a digital glitch.
 */
export type GlitchInOutTransition = {
    type: "glitchin" | "glitchout";
    /**
     * Configuration options for the glitch transition.
     */
    props?: GlitchTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the twist transition.
 */
export interface TwistTransitionProps extends TwistInOutProps {}
/**
 * Twist — reveals or conceals the element with a twisting distortion.
 */
export type TwistInOutTransition = {
    type: "twistin" | "twistout";
    /**
     * Configuration options for the twist transition.
     */
    props?: TwistTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the warp transition.
 */
export interface WarpTransitionProps extends WarpInOutProps {}
/**
 * Warp — reveals or conceals the element with a warping distortion.
 */
export type WarpInOutTransition = {
    type: "warpin" | "warpout";
    /**
     * Configuration options for the warp transition.
     */
    props?: WarpTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the ripple transition.
 */
export interface RippleTransitionProps extends RippleInOutProps {}
/**
 * Ripple — reveals or conceals the element with a ripple distortion.
 */
export type RippleInOutTransition = {
    type: "ripplein" | "rippleout";
    /**
     * Configuration options for the ripple transition.
     */
    props?: RippleTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the noisedissolve transition.
 */
export interface NoiseDissolveTransitionProps extends NoiseDissolveInOutProps {}
/**
 * Noise dissolve — reveals or conceals the element by dissolving it through noise.
 */
export type NoiseDissolveInOutTransition = {
    type: "noisedissolvein" | "noisedissolveout";
    /**
     * Configuration options for the noisedissolve transition.
     */
    props?: NoiseDissolveTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the tv transition.
 */
export interface TvTransitionProps extends TvInOutProps {}
/**
 * TV — reveals or conceals the element with a CRT-television effect.
 */
export type TvInOutTransition = {
    type: "tvin" | "tvout";
    /**
     * Configuration options for the tv transition.
     */
    props?: TvTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Configuration options for the pinch transition.
 */
export interface PinchTransitionProps extends PinchInOutProps {}
/**
 * Pinch — reveals or conceals the element with a pinching distortion.
 */
export type PinchInOutTransition = {
    type: "pinchin" | "pinchout";
    /**
     * Configuration options for the pinch transition.
     */
    props?: PinchTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Union of all supported canvas media transitions.
 */
type PixiVNJsonMediaTransiotions =
    | DissolveTransition
    | FadeTransition
    | MoveInOutTransition
    | ZoomInOutTransition
    | PushInOutTransition
    | WipeInOutTransition
    | IrisInOutTransition
    | SplitInOutTransition
    | BlurInOutTransition
    | PixelateInOutTransition
    | FlashInOutTransition
    | GlitchInOutTransition
    | TwistInOutTransition
    | WarpInOutTransition
    | RippleInOutTransition
    | NoiseDissolveInOutTransition
    | TvInOutTransition
    | PinchInOutTransition;
export default PixiVNJsonMediaTransiotions;
