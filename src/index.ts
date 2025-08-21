export * from "@drincs/pixi-vn-json/importer";
export * from "@drincs/pixi-vn-json/unifier";
export { PIXIVNJSON_PARAM_ID } from "./constants";
export * from "./interface";
export * from "./internationalization";
import { JsonUnifier } from "@drincs/pixi-vn-json/unifier";
import { loadAssets } from "./utils/assets";
import {
    animateOperation,
    canvasElementOperation,
    effectOperation,
    imageContainerOperation,
    imageOperation,
    tickerOperation,
    videoOperation,
} from "./utils/canvas";
import { inputOperation } from "./utils/narration";
import { soundOperation } from "./utils/sound";
import { getConditionalStep, getLogichValue, setStorageValue } from "./utils/storage";

JsonUnifier.init({
    animateOperation: animateOperation,
    canvasElementOperation: canvasElementOperation,
    effectOperation: effectOperation,
    imageContainerOperation: imageContainerOperation,
    imageOperation: imageOperation,
    inputOperation: inputOperation,
    loadAssets: loadAssets,
    soundOperation: soundOperation,
    tickerOperation: tickerOperation,
    videoOperation: videoOperation,
    setStorageValue: setStorageValue,
    getLogichValue: getLogichValue,
    getConditionalStep: getConditionalStep,
});
