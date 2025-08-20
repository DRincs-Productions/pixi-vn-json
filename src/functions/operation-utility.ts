import { PixiVNJsonIfElse, PixiVNJsonOperation } from "../interface";
import { PixiVNJsonOperationString } from "../interface/PixiVNJsonOperations";
import JsonUnifier from "../unifier/JsonUnifier";
import { logger } from "../utils/log-utility";
import { getLogichValue, setStorageJson } from "./utility";

export async function runOperation(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
    operationStringConvert?: (value: string) => Promise<PixiVNJsonOperation | undefined>
) {
    let operation = getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(origin);
    if (!operation) {
        return;
    }
    switch (operation.type) {
        case "sound":
            JsonUnifier.soundOperation(operation);
            break;
        case "assets":
        case "bundle":
            await JsonUnifier.loadAssets(operation);
            break;
        case "image":
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
            break;
        case "video":
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
            break;
        case "imagecontainer":
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
            break;
        case "canvaselement":
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
            break;
        case "value":
            setStorageJson(operation);
            break;
        case "operationtoconvert":
            if (operationStringConvert) {
                let stringOperation = "";
                operation.values.forEach((value) => {
                    if (typeof value === "string") {
                        stringOperation += value;
                    } else {
                        let res = getLogichValue<string>(value);
                        stringOperation += `${res}`;
                    }
                });
                let op = await operationStringConvert(stringOperation);
                if (op) {
                    await runOperation(op, operationStringConvert);
                }
            }
            break;
        case "input":
            switch (operation.operationType) {
                case "request":
                    narration.requestInput({ type: operation.valueType }, operation.defaultValue);
                    break;
            }
            break;
        case "fade":
            let tickerFade = new FadeAlphaTicker(operation.props, operation.duration, operation.priority);
            canvas.addTicker(operation.alias, tickerFade);
            break;
        case "move":
            let tickerMove = new MoveTicker(operation.props, operation.duration, operation.priority);
            canvas.addTicker(operation.alias, tickerMove);
            break;
        case "rotate":
            let tickerRotate = new RotateTicker(operation.props, operation.duration, operation.priority);
            canvas.addTicker(operation.alias, tickerRotate);
            break;
        case "zoom":
            let tickerZoom = new ZoomTicker(operation.props, operation.duration, operation.priority);
            canvas.addTicker(operation.alias, tickerZoom);
            break;
        case "shake":
            await shakeEffect(operation.alias, operation.props, operation.priority);
            break;
    }
}
