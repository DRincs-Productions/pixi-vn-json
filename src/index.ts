export {
    PIXIVNJSON_PARAM_ID,
    PIXIVNJSON_SCHEMA_URL,
    PixiVNJsonComparationOperators,
} from "@/constants";
export * from "@drincs/pixi-vn-json/core";
export * from "@drincs/pixi-vn-json/interpreter";
export * from "@drincs/pixi-vn-json/schema";
export * from "@drincs/pixi-vn-json/translator";
export { VariableGetter };
import { VariableGetter } from "@/handlers/VariableGetter";
import {
    animateOperation,
    canvasElementOperation,
    effectOperation,
    getConditionalStep,
    imageContainerOperation,
    imageOperation,
    loadAssets,
    narrationOperation,
    setInitialStorageValue,
    setStorageValue,
    soundOperation,
    textOperation,
    videoOperation,
} from "@drincs/pixi-vn-json/actions";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";

export function init() {
    JsonUnifier.init({
        animateOperation: animateOperation,
        canvasElementOperation: canvasElementOperation,
        effectOperation: effectOperation,
        imageContainerOperation: imageContainerOperation,
        imageOperation: imageOperation,
        textOperation: textOperation,
        narrationOperation: narrationOperation,
        loadAssets: loadAssets,
        soundOperation: soundOperation,
        videoOperation: videoOperation,
        setStorageValue: setStorageValue,
        setInitialStorageValue: setInitialStorageValue,
        getLogichValue: VariableGetter.getLogichValue,
        getConditionalStep: getConditionalStep,
    });
}
