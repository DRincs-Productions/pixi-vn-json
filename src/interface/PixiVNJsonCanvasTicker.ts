import {
    FadeAlphaTickerProps,
    MoveTickerProps,
    RotateTickerProps,
    UPDATE_PRIORITY,
    ZoomTickerProps,
} from "@drincs/pixi-vn";

type PixiVNJsonTickerFade = {
    type: "fade";
    alias: string | string[];
    duration?: number;
    props: FadeAlphaTickerProps;
    priority?: UPDATE_PRIORITY;
};
type PixiVNJsonTickerMove = {
    type: "move";
    alias: string | string[];
    duration?: number;
    props: MoveTickerProps;
    priority?: UPDATE_PRIORITY;
};
type PixiVNJsonTickerRotate = {
    type: "rotate";
    alias: string | string[];
    duration?: number;
    props: RotateTickerProps;
    priority?: UPDATE_PRIORITY;
};
type PixiVNJsonTickerZoom = {
    type: "zoom";
    alias: string | string[];
    duration?: number;
    props: ZoomTickerProps;
    priority?: UPDATE_PRIORITY;
};

type PixiVNJsonCanvasTicker =
    | PixiVNJsonTickerFade
    | PixiVNJsonTickerMove
    | PixiVNJsonTickerRotate
    | PixiVNJsonTickerZoom;
export default PixiVNJsonCanvasTicker;
