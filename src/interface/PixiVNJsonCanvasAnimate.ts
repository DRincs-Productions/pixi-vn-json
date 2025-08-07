import {
    AnimationOptions,
    CanvasBaseInterface,
    ImageSprite,
    KeyframesType,
    ObjectSegment,
    ObjectSegmentWithTransition,
    SequenceOptions,
    UPDATE_PRIORITY,
} from "@drincs/pixi-vn";

export type PixiVNJsonAnimateBase<T extends CanvasBaseInterface<any>> = {
    type: "animate";
    alias: string | string[];
    keyframes: KeyframesType<T>;
    options?: AnimationOptions;
    priority?: UPDATE_PRIORITY;
};
export type PixiVNJsonAnimateSequence<T extends CanvasBaseInterface<any>> = {
    type: "animate-sequence";
    alias: string | string[];
    sequence: (ObjectSegment<T> | ObjectSegmentWithTransition<T>)[];
    options?: SequenceOptions;
    priority?: UPDATE_PRIORITY;
};

type PixiVNJsonAnimate<T extends CanvasBaseInterface<any> = ImageSprite> =
    | PixiVNJsonAnimateBase<T>
    | PixiVNJsonAnimateSequence<T>;

export default PixiVNJsonAnimate;
