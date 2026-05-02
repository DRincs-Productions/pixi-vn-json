export * from "@drincs/pixi-vn-json/core";
export * from "@drincs/pixi-vn-json/interpreter";
export * from "@drincs/pixi-vn-json/schema";
export * from "@drincs/pixi-vn-json/translator";
export {
    PIXIVNJSON_PARAM_ID,
    PIXIVNJSON_SCHEMA_URL,
} from "./constants";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import {
    applyGetLogichValueHandlers,
    getLogichValueHandlers,
} from "./handlers/getLogichValueHandlers";
import { loadAssets } from "./utils/assets";
import {
    animateOperation,
    canvasElementOperation,
    effectOperation,
    imageContainerOperation,
    imageOperation,
    textOperation,
    videoOperation,
} from "./utils/canvas";
import { narrationOperation } from "./utils/narration";
import { soundOperation } from "./utils/sound";
import { getConditionalStep, setInitialStorageValue, setStorageValue } from "./utils/storage";

export { getLogichValueHandlers };

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
        getLogichValue: applyGetLogichValueHandlers,
        getConditionalStep: getConditionalStep,
    });
}
