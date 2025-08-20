import {
    canvas,
    ImageContainer,
    ImageSprite,
    moveIn,
    moveOut,
    pushIn,
    pushOut,
    removeWithDissolve,
    removeWithFade,
    showWithDissolve,
    showWithFade,
    VideoSprite,
    zoomIn,
    zoomOut,
} from "@drincs/pixi-vn";
import { PixiVNJsonCanvasRemove, PixiVNJsonCanvasShow, PixiVNJsonMediaTransiotions } from "../interface";

async function showCanvasElemet(
    element: ImageSprite | VideoSprite | ImageContainer,
    operation: PixiVNJsonCanvasShow,
    transition: PixiVNJsonMediaTransiotions
) {
    switch (transition.type) {
        case "fade":
            await showWithFade(operation.alias, element, transition.props, transition.priority);
            break;
        case "dissolve":
            await showWithDissolve(operation.alias, element, transition.props, transition.priority);
            break;
        case "movein":
        case "moveout":
            await moveIn(operation.alias, element, transition.props, transition.priority);
            break;
        case "zoomin":
        case "zoomout":
            await zoomIn(operation.alias, element, transition.props, transition.priority);
            break;
        case "pushin":
        case "pushout":
            await pushIn(operation.alias, element, transition.props, transition.priority);
            break;
    }
}

function removeCanvasElement(operation: PixiVNJsonCanvasRemove) {
    if (operation.transition) {
        switch (operation.transition.type) {
            case "fade":
                removeWithFade(operation.alias, operation.transition.props, operation.transition.priority);
                break;
            case "dissolve":
                removeWithDissolve(operation.alias, operation.transition.props, operation.transition.priority);
                break;
            case "movein":
            case "moveout":
                moveOut(operation.alias, operation.transition.props, operation.transition.priority);
                break;
            case "zoomin":
            case "zoomout":
                zoomOut(operation.alias, operation.transition.props, operation.transition.priority);
                break;
            case "pushin":
            case "pushout":
                pushOut(operation.alias, operation.transition.props, operation.transition.priority);
                break;
        }
    } else {
        canvas.remove(operation.alias);
    }
}
