import { JsonUnifier } from "@drincs/pixi-vn-json/unifier";
import { PixiVNJsonIfElse, PixiVNJsonOperation } from "../interface";
import { PixiVNJsonOperationString } from "../interface/PixiVNJsonOperations";
import { operationStringToString } from "../utils/operationtoconvert";

export async function runOperation(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
    operationStringConvert?: (value: string) => Promise<PixiVNJsonOperation | undefined>
) {
    let operation = JsonUnifier.getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(origin);
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
        case "text":
            await JsonUnifier.textOperation(operation);
            break;
        case "canvaselement":
            await JsonUnifier.canvasElementOperation(operation);
            break;
        case "value":
            JsonUnifier.setStorageValue(operation);
            break;
        case "operationtoconvert":
            if (operationStringConvert) {
                let stringOperation = operationStringToString(operation);
                let op = await operationStringConvert(stringOperation);
                if (op) {
                    await runOperation(op, operationStringConvert);
                }
            }
            break;
        case "input":
        case "dialogue":
            JsonUnifier.narrationOperation(operation);
            break;
        case "fade":
        case "move":
        case "rotate":
        case "zoom":
            JsonUnifier.tickerOperation(operation);
            break;
        case "shake":
            await JsonUnifier.effectOperation(operation);
            break;
        case "animate":
        case "animate-sequence":
            JsonUnifier.animateOperation(operation);
            break;
    }
}
