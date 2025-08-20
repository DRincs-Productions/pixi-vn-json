import { ContainerChild, ContainerMemory, ImageSpriteMemory, VideoSpriteMemory } from "@drincs/pixi-vn";
import {
    PixiVNJsonIfElse,
    PixiVNJsonInput,
    PixiVNJsonOperation,
    PixiVNJsonOperationString,
    PixiVNJsonSound,
    PixiVNJsonValueSet,
} from "../interface";
import {
    PixiVNJsonCanvasImageContainerShow,
    PixiVNJsonCanvasImageVideoShow,
    PixiVNJsonCanvasRemove,
    PixiVNJsonImageContainerEdit,
    PixiVNJsonImageEdit,
    PixiVNJsonUnknownEdit,
    PixiVNJsonVideoEdit,
    PixiVNJsonVideoPauseResume,
} from "../interface/PixiVNJsonCanvas";
import { logger } from "../utils/log-utility";

export default class JsonUnifier {
    static init(options: {}) {}
    private static _loadAssets: (
        origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
    ) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get loadAssets() {
        return this._loadAssets;
    }
    private static _soundOperation: (operation: PixiVNJsonSound) => void = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get soundOperation() {
        return this._soundOperation;
    }
    private static _imageOperation: (
        operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove
    ) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get imageOperation() {
        return this._imageOperation;
    }
    private static _videoOperation: (
        operation:
            | PixiVNJsonCanvasImageVideoShow
            | PixiVNJsonCanvasRemove
            | PixiVNJsonVideoEdit
            | PixiVNJsonVideoPauseResume
    ) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get videoOperation() {
        return this._videoOperation;
    }
    private static _imageContainerOperation: (
        operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasImageContainerShow | PixiVNJsonImageContainerEdit
    ) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get imageContainerOperation() {
        return this._imageContainerOperation;
    }
    private static _canvasElementOperation: (
        operation:
            | PixiVNJsonCanvasRemove
            | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>>
    ) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get canvasElementOperation() {
        return this._canvasElementOperation;
    }
    private static _setStorageValue: (value: PixiVNJsonValueSet) => void = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get setStorageValue() {
        return this._setStorageValue;
    }
    private static _inputOperation: (operation: PixiVNJsonInput) => void = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get inputOperation() {
        return this._inputOperation;
    }
}
