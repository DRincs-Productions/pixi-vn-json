export * from "@drincs/pixi-vn-json/core";
export * from "@drincs/pixi-vn-json/importer";
export * from "@drincs/pixi-vn-json/translator";
export { PIXIVNJSON_PARAM_ID, PIXIVNJSON_SCHEMA_URL } from "./constants";
export * from "./interface";
import type { StorageElementType } from "@drincs/pixi-vn";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
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
import {
    getConditionalStep,
    getLogichValue,
    getValueFromConditionalStatements,
    setInitialStorageValue,
    setStorageValue,
} from "./utils/storage";

export function init({
    getLogichValue: getLogichValueParam = getLogichValue,
}: {
    getLogichValue?: <T = StorageElementType>(
        value: T,
        next: (value: T) => T | undefined,
    ) => T | undefined;
}) {
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
        getLogichValue: (value) => {
            if (getLogichValueParam) {
                return getLogichValueParam(
                    getValueFromConditionalStatements(value),
                    getLogichValue,
                ) as any;
            }
            return getLogichValue(value);
        },
        getConditionalStep: getConditionalStep,
    });
}
