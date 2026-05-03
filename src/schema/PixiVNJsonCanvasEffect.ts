import type { ShakeEffectProps } from "@drincs/pixi-vn";
import type { UPDATE_PRIORITY } from "pixi.js";

/**
 * Applies a shake effect to a canvas element.
 */
type PixiVNJsonEffectShake = {
    type: "shake";
    /**
     * Alias of the canvas element to apply the shake effect to.
     */
    alias: string;
    /**
     * Configuration properties for the shake effect (amplitude, duration, etc.).
     */
    props: ShakeEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Union of all canvas visual effects.
 */
type PixiVNJsonCanvasEffect = PixiVNJsonEffectShake;
export default PixiVNJsonCanvasEffect;
