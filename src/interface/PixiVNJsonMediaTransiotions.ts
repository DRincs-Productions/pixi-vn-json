import {
    MoveInOutProps,
    PushInOutProps,
    ShowWithDissolveTransitionProps,
    ShowWithFadeTransitionProps,
    UPDATE_PRIORITY,
    ZoomInOutProps,
} from "@drincs/pixi-vn";

type DissolveTransition = {
    type: "dissolve";
    props?: ShowWithDissolveTransitionProps;
    priority?: UPDATE_PRIORITY;
};

type FadeTransition = {
    type: "fade";
    props?: ShowWithFadeTransitionProps;
    priority?: UPDATE_PRIORITY;
};

type MoveInOutTransition = {
    type: "movein" | "moveout";
    props?: MoveInOutProps;
    priority?: UPDATE_PRIORITY;
};

type ZoomInOutTransition = {
    type: "zoomin" | "zoomout";
    props?: ZoomInOutProps;
    priority?: UPDATE_PRIORITY;
};

type PushInOutTransition = {
    type: "pushin" | "pushout";
    props?: PushInOutProps;
    priority?: UPDATE_PRIORITY;
};

type PixiVNJsonMediaTransiotions =
    | DissolveTransition
    | FadeTransition
    | MoveInOutTransition
    | ZoomInOutTransition
    | PushInOutTransition;
export default PixiVNJsonMediaTransiotions;
