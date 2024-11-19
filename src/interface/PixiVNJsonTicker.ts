import { FadeAlphaTickerProps, MoveTickerProps, RotateTickerProps, ZoomTickerProps } from "@drincs/pixi-vn"
import { UPDATE_PRIORITY } from "pixi.js"

type PixiVNJsonTickerFade = {
    type: "fade"
    alias: string | string[]
    duration?: number
    props: FadeAlphaTickerProps
    priority?: UPDATE_PRIORITY
}
type PixiVNJsonTickerMove = {
    type: "move"
    alias: string | string[]
    duration?: number
    props: MoveTickerProps
    priority?: UPDATE_PRIORITY
}
type PixiVNJsonTickerRotate = {
    type: "rotate"
    alias: string | string[]
    duration?: number
    props: RotateTickerProps
    priority?: UPDATE_PRIORITY
}
type PixiVNJsonTickerZoom = {
    type: "zoom"
    alias: string | string[]
    duration?: number
    props: ZoomTickerProps
    priority?: UPDATE_PRIORITY
}

type PixiVNJsonTicker = (PixiVNJsonTickerFade | PixiVNJsonTickerMove | PixiVNJsonTickerRotate | PixiVNJsonTickerZoom)
export default PixiVNJsonTicker