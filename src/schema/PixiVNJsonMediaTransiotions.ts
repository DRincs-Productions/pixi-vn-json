import type {
    MoveInOutProps,
    PushInOutProps,
    ShowWithDissolveTransitionProps,
    ShowWithFadeTransitionProps,
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
 * Union of all supported canvas media transitions.
 */
type PixiVNJsonMediaTransiotions =
    | DissolveTransition
    | FadeTransition
    | MoveInOutTransition
    | ZoomInOutTransition
    | PushInOutTransition;
export default PixiVNJsonMediaTransiotions;
