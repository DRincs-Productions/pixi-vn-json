import type { CanvasBaseInterface, ImageSprite } from "@drincs/pixi-vn";
import type {
    AnimationOptions,
    KeyframesType,
    ObjectSegment,
    ObjectSegmentWithTransition,
    SequenceOptions,
} from "@drincs/pixi-vn/motion";
import type { UPDATE_PRIORITY } from "pixi.js";

/**
 * Animates one or more canvas elements simultaneously using keyframe-based animation.
 */
export type PixiVNJsonAnimateBase<T extends CanvasBaseInterface<any>> = {
    type: "animate";
    /**
     * Alias (or list of aliases) of the canvas elements to animate.
     */
    alias: string | string[];
    /**
     * The keyframes that define the animation values over time.
     */
    keyframes: KeyframesType<T>;
    /**
     * Additional options controlling the animation (duration, easing, repeat, etc.).
     */
    options?: AnimationOptions;
    /**
     * Pixi.js update priority for this animation ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};
/**
 * Animates a canvas element using a sequence of segments (timeline-based animation).
 */
export type PixiVNJsonAnimateSequence<T extends CanvasBaseInterface<any>> = {
    type: "animate-sequence";
    /**
     * Alias of the canvas element to animate.
     */
    alias: string;
    /**
     * Ordered list of animation segments, each optionally including a transition.
     */
    sequence: (ObjectSegment<T> | ObjectSegmentWithTransition<T>)[];
    /**
     * Additional options controlling the sequence playback.
     */
    options?: SequenceOptions;
    /**
     * Pixi.js update priority for this animation ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Union of all canvas animation operations — keyframe-based or sequence-based.
 */
type PixiVNJsonCanvasAnimate<T extends CanvasBaseInterface<any> = ImageSprite> =
    | PixiVNJsonAnimateBase<T>
    | PixiVNJsonAnimateSequence<T>;

export default PixiVNJsonCanvasAnimate;
