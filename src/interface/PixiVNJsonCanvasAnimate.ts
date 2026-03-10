import type { CanvasBaseInterface, ImageSprite } from "@drincs/pixi-vn";
import {
    AnimationOptions,
    KeyframesType,
    ObjectSegment,
    ObjectSegmentWithTransition,
    SequenceOptions,
} from "@drincs/pixi-vn/motion";
import { UPDATE_PRIORITY } from "pixi.js";

export type PixiVNJsonAnimateBase<T extends CanvasBaseInterface<any>> = {
    type: "animate";
    alias: string | string[];
    keyframes: KeyframesType<T>;
    options?: AnimationOptions;
    priority?: UPDATE_PRIORITY;
};
export type PixiVNJsonAnimateSequence<T extends CanvasBaseInterface<any>> = {
    type: "animate-sequence";
    alias: string;
    sequence: (ObjectSegment<T> | ObjectSegmentWithTransition<T>)[];
    options?: SequenceOptions;
    priority?: UPDATE_PRIORITY;
};

type PixiVNJsonCanvasAnimate<T extends CanvasBaseInterface<any> = ImageSprite> =
    | PixiVNJsonAnimateBase<T>
    | PixiVNJsonAnimateSequence<T>;

export default PixiVNJsonCanvasAnimate;
