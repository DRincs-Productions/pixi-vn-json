export * from "@drincs/pixi-vn-json/core";
export * from "@drincs/pixi-vn-json/importer";
export * from "@drincs/pixi-vn-json/translator";
export { PIXIVNJSON_PARAM_ID, PixiVNJsonComparationOperators } from "./constants";
export * from "./interface";
import type { StorageElementType, StepLabelPropsType } from "@drincs/pixi-vn";
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

type GetLogichValueHandler = <T = StorageElementType>(
    value: T,
    next: (value: T) => T | undefined,
) => T | undefined;

const _getLogichValueHandlers: GetLogichValueHandler[] = [];

export const getLogichValueHandlers = {
    add(handler: GetLogichValueHandler): void {
        _getLogichValueHandlers.push(handler);
    },
    remove(handler: GetLogichValueHandler): void {
        const index = _getLogichValueHandlers.indexOf(handler);
        if (index !== -1) _getLogichValueHandlers.splice(index, 1);
    },
};

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
        getLogichValue: <T = StorageElementType>(value: any, props: StepLabelPropsType = {}): T | undefined => {
            const baseNext = (v: any): T | undefined => (getLogichValue(v, props) ?? undefined) as T | undefined;
            const processedValue = getValueFromConditionalStatements(value, props);
            if (_getLogichValueHandlers.length === 0) {
                return baseNext(processedValue);
            }
            let chain = baseNext;
            for (let i = _getLogichValueHandlers.length - 1; i >= 0; i--) {
                const handler = _getLogichValueHandlers[i];
                const nextChain = chain;
                chain = (v: any) => (handler(v, nextChain) ?? undefined) as T | undefined;
            }
            return chain(processedValue);
        },
        getConditionalStep: getConditionalStep,
    });
}
