import { ShakeEffectProps } from "@drincs/pixi-vn"
import { UPDATE_PRIORITY } from "pixi.js"

type PixiVNJsonEffectShake = {
    type: "shake"
    alias: string
    props: ShakeEffectProps
    priority?: UPDATE_PRIORITY
}

type PixiVNJsonEffect = (PixiVNJsonEffectShake)
export default PixiVNJsonEffect
