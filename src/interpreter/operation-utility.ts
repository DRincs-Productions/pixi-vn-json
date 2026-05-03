import { functionOperation } from "@/utils/function-utility";
import { operationStringToString } from "@/utils/operationtoconvert";
import type { StepLabelPropsType } from "@drincs/pixi-vn";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import type {
    PixiVNJsonIfElse,
    PixiVNJsonOperation,
    PixiVNJsonOperationString,
} from "@drincs/pixi-vn-json/schema";

/**
 * Executes a single JSON operation (canvas, sound, storage, narration, etc.) during label
 * step execution.
 *
 * Conditional/if-else operations are first unwrapped via {@link JsonUnifier.getLogichValue}
 * before the appropriate handler is dispatched.
 *
 * @param origin - The operation or conditional expression to execute.
 * @param props - The current step label props.
 * @param operationStringConvert - Optional converter for `operationtoconvert` string operations.
 */
export async function runOperation(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
    props: StepLabelPropsType,
    operationStringConvert?: (value: string) => Promise<PixiVNJsonOperation | undefined>,
) {
    const operation = JsonUnifier.getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(
        origin,
        props,
    );
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
            JsonUnifier.setStorageValue(operation, props);
            break;
        case "operationtoconvert":
            if (operationStringConvert) {
                const stringOperation = operationStringToString(operation, props);
                const op = await operationStringConvert(stringOperation);
                if (op) {
                    await runOperation(op, props, operationStringConvert);
                }
            }
            break;
        case "input":
        case "dialogue":
            JsonUnifier.narrationOperation(operation);
            break;
        case "shake":
            await JsonUnifier.effectOperation(operation);
            break;
        case "animate":
        case "animate-sequence":
            JsonUnifier.animateOperation(operation);
            break;
        case "function":
            await functionOperation(operation, props);
            break;
    }
}

/**
 * Processes a single initial operation at import time.
 * Only `"value"` operations targeting `"storage"` or `"tempstorage"` are handled here
 * (i.e. they set default storage values via {@link JsonUnifier.setInitialStorageValue}).
 *
 * @param origin - The operation or conditional expression to process.
 */
export function runInitialOperation(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
) {
    const operation = JsonUnifier.getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(
        origin,
        {},
    );
    if (!operation) {
        return;
    }
    switch (operation.type) {
        case "value":
            if (
                operation.storageOperationType === "set" &&
                (operation.storageType === "storage" || operation.storageType === "tempstorage")
            ) {
                JsonUnifier.setInitialStorageValue(operation);
            }
            break;
    }
}
