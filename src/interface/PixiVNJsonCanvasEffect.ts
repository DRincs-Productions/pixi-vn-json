import { ShakeEffectProps, UPDATE_PRIORITY } from "@drincs/pixi-vn";

type PixiVNJsonEffectShake = {
    type: "shake";
    alias: string;
    props: ShakeEffectProps;
    priority?: UPDATE_PRIORITY;
};

type PixiVNJsonCanvasEffect = PixiVNJsonEffectShake;
export default PixiVNJsonCanvasEffect;
