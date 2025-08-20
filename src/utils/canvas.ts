import {
    canvas,
    ContainerChild,
    ContainerMemory,
    ImageContainer,
    ImageSprite,
    ImageSpriteMemory,
    moveIn,
    moveOut,
    pushIn,
    pushOut,
    removeWithDissolve,
    removeWithFade,
    showImage,
    showImageContainer,
    showVideo,
    showWithDissolve,
    showWithFade,
    VideoSprite,
    VideoSpriteMemory,
    zoomIn,
    zoomOut,
} from "@drincs/pixi-vn";
import { PixiVNJsonCanvasRemove, PixiVNJsonCanvasShow, PixiVNJsonMediaTransiotions } from "../interface";
import {
    PixiVNJsonCanvasImageContainerShow,
    PixiVNJsonCanvasImageVideoShow,
    PixiVNJsonImageContainerEdit,
    PixiVNJsonImageEdit,
    PixiVNJsonUnknownEdit,
    PixiVNJsonVideoEdit,
    PixiVNJsonVideoPauseResume,
} from "../interface/PixiVNJsonCanvas";
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

export async function videoOperation(
    operation:
        | PixiVNJsonCanvasRemove
        | PixiVNJsonCanvasImageVideoShow
        | PixiVNJsonVideoEdit
        | PixiVNJsonVideoPauseResume
) {
    switch (operation.operationType) {
        case "show":
            if (operation.transition) {
                let videoToShow = new VideoSprite(operation.props, operation.url || operation.alias);
                await showCanvasElemet(videoToShow, operation, operation.transition);
            } else {
                await showVideo(operation.alias, operation.url, operation.props);
            }
            break;
        case "edit":
            let video = canvas.find<VideoSprite>(operation.alias);
            if (video) {
                if (operation.props) {
                    await video.setMemory({
                        ...video.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`Video with alias ${operation.alias} not found.`);
            }
            break;
        case "remove":
            removeCanvasElement(operation);
            break;
        case "pause":
            let videoPause = canvas.find<VideoSprite>(operation.alias);
            if (videoPause) {
                videoPause.paused = true;
            } else {
                logger.error(`Video with alias ${operation.alias} not found.`);
            }
            break;
        case "resume":
            let videoResume = canvas.find<VideoSprite>(operation.alias);
            if (videoResume) {
                videoResume.paused = false;
            } else {
                logger.error(`Video with alias ${operation.alias} not found.`);
            }
            break;
    }
}

export async function imageContainerOperation(
    operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasImageContainerShow | PixiVNJsonImageContainerEdit
) {
    switch (operation.operationType) {
        case "show":
            if (operation.transition) {
                let imageContainerToShow = new ImageContainer(operation.props, operation.urls);
                await showCanvasElemet(imageContainerToShow, operation, operation.transition);
            } else {
                await showImageContainer(operation.alias, operation.urls, operation.props);
            }
            break;
        case "edit":
            let image = canvas.find<ImageContainer>(operation.alias);
            if (image) {
                if (operation.props) {
                    await image.setMemory({
                        ...image.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`ImageContainer with alias ${operation.alias} not found.`);
            }
            break;
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}

export async function canvasElementOperation(
    operation:
        | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>>
        | PixiVNJsonCanvasRemove
) {
    switch (operation.operationType) {
        case "edit":
            try {
                let unknown = canvas.find(operation.alias);
                if (unknown) {
                    if (operation.props) {
                        unknown.memory = {
                            ...unknown.memory,
                            ...operation.props,
                        };
                    }
                } else {
                    logger.error(`Canvas Element with alias ${operation.alias} not found.`);
                }
            } catch (e) {
                logger.error(
                    `There was an error while trying to edit the canvas element with alias ${operation.alias}.`,
                    e
                );
            }
            break;
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}
