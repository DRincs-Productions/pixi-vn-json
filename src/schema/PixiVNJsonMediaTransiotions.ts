import type {
    MoveInOutProps,
    PushInOutProps,
    ShowWithDissolveTransitionProps,
    ShowWithFadeTransitionProps,
    ZoomInOutProps,
} from "@drincs/pixi-vn";
import type { UPDATE_PRIORITY } from "pixi.js";

/**
 * Cross-dissolve transition — blends the element in or out by gradually changing its opacity.
 */
type DissolveTransition = {
    type: "dissolve";
    /**
     * Configuration options for the dissolve transition.
     */
    props?: ShowWithDissolveTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Fade transition — fades the element in or out by animating its alpha value.
 */
type FadeTransition = {
    type: "fade";
    /**
     * Configuration options for the fade transition.
     */
    props?: ShowWithFadeTransitionProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Move-in / Move-out transition — slides the element into or out of the viewport.
 */
type MoveInOutTransition = {
    type: "movein" | "moveout";
    /**
     * Configuration options for the move transition (direction, duration, easing, etc.).
     */
    props?: MoveInOutProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Zoom-in / Zoom-out transition — scales the element into or out of view.
 */
type ZoomInOutTransition = {
    type: "zoomin" | "zoomout";
    /**
     * Configuration options for the zoom transition (scale, duration, easing, etc.).
     */
    props?: ZoomInOutProps;
    /**
     * Pixi.js update priority for the transition ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Push-in / Push-out transition — pushes the element onto or off the viewport, displacing the current content.
 */
type PushInOutTransition = {
    type: "pushin" | "pushout";
    /**
     * Configuration options for the push transition (direction, duration, easing, etc.).
     */
    props?: PushInOutProps;
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
