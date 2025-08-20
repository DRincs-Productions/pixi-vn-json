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
            await JsonUnifier.imageOperation(operation);
            break;
        case "video":
            await JsonUnifier.videoOperation(operation);
            break;
        case "imagecontainer":
            await JsonUnifier.imageContainerOperation(operation);
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
