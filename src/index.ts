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

export {
    PIXIVNJSON_PARAM_ID,
    PIXIVNJSON_SCHEMA_URL,
    PixiVNJsonComparationOperators,
} from "@/constants";
export * from "@/handlers";
export * from "@drincs/pixi-vn-json/core";
export * from "@drincs/pixi-vn-json/interpreter";
export * from "@drincs/pixi-vn-json/schema";
export * from "@drincs/pixi-vn-json/translator";

/**
 * Initialises the pixi-vn-json system by registering all default operation handlers
 * (canvas, sound, assets, storage, narration, etc.) into the {@link JsonUnifier}.
 *
 * Call this function once at application startup, before importing any JSON labels.
 */
export function init() {
    JsonUnifier.init({
        animateOperation,
        canvasElementOperation,
        effectOperation,
        imageContainerOperation,
        imageOperation,
        textOperation,
        narrationOperation,
        loadAssets,
        soundOperation,
        videoOperation,
        setStorageValue,
        setInitialStorageValue,
        getLogichValue: VariableGetter.getLogichValue,
        getConditionalStep,
    });
}
