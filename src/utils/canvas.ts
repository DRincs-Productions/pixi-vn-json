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
    showImage,
    showWithDissolve,
    showWithFade,
    VideoSprite,
    zoomIn,
    zoomOut,
} from "@drincs/pixi-vn";
import { PixiVNJsonCanvasRemove, PixiVNJsonCanvasShow, PixiVNJsonMediaTransiotions } from "../interface";
import { PixiVNJsonCanvasImageVideoShow, PixiVNJsonImageEdit } from "../interface/PixiVNJsonCanvas";
import { logger } from "./log-utility";

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

export async function imageOperation(
    operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove
) {
    switch (operation.operationType) {
        case "show":
            if (operation.transition) {
                let imageToShow = new ImageSprite(operation.props, operation.url || operation.alias);
                await showCanvasElemet(imageToShow, operation, operation.transition);
            } else {
                await showImage(operation.alias, operation.url, operation.props);
            }
            break;
        case "edit":
            let image = canvas.find<ImageSprite>(operation.alias);
            if (image) {
                if (operation.props) {
                    await image.setMemory({
                        ...image.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`Image with alias ${operation.alias} not found.`);
            }
            break;
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}
