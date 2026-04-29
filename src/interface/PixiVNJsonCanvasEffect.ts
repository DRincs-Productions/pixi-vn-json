import type { ShakeEffectProps } from "@drincs/pixi-vn";
import type { UPDATE_PRIORITY } from "pixi.js";

type PixiVNJsonEffectShake = {
    type: "shake";
    alias: string;
    props: ShakeEffectProps;
    priority?: UPDATE_PRIORITY;
};

type PixiVNJsonCanvasEffect = PixiVNJsonEffectShake;
export default PixiVNJsonCanvasEffect;
