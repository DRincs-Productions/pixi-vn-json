export * from "@drincs/pixi-vn-json/importer";
export * from "@drincs/pixi-vn-json/translator";
export * from "@drincs/pixi-vn-json/unifier";
export { PIXIVNJSON_PARAM_ID } from "./constants";
export * from "./interface";
import { JsonUnifier } from "@drincs/pixi-vn-json/unifier";
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
import { getConditionalStep, getLogichValue, setInitialStorageValue, setStorageValue } from "./utils/storage";

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
        getLogichValue: getLogichValue,
        getConditionalStep: getConditionalStep,
    });
}
