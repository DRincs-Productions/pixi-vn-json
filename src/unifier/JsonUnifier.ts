import {
    ContainerChild,
    ContainerMemory,
    ImageSpriteMemory,
    StorageElementType,
    VideoSpriteMemory,
} from "@drincs/pixi-vn";
import {
    PixiVNJsonArithmeticOperations,
    PixiVNJsonCanvasAnimate,
    PixiVNJsonCanvasEffect,
    PixiVNJsonCanvasTicker,
    PixiVNJsonConditionalStatements,
    PixiVNJsonConditions,
    PixiVNJsonIfElse,
    PixiVNJsonInput,
    PixiVNJsonLabelStep,
    PixiVNJsonOperation,
    PixiVNJsonOperationString,
    PixiVNJsonSound,
    PixiVNJsonValueGet,
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
    private static _tickerOperation: (operation: PixiVNJsonCanvasTicker) => void = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get tickerOperation() {
        return this._tickerOperation;
    }
    private static _effectOperation: (operation: PixiVNJsonCanvasEffect) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get effectOperation() {
        return this._effectOperation;
    }
    private static _animateOperation: (operation: PixiVNJsonCanvasAnimate) => Promise<void> = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get animateOperation() {
        return this._animateOperation;
    }
    private static _getLogichValue: <T = StorageElementType>(
        value:
            | T
            | PixiVNJsonValueGet
            | PixiVNJsonArithmeticOperations
            | PixiVNJsonConditions
            | PixiVNJsonConditionalStatements<
                  T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions
              >
    ) => T | undefined = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get getLogichValue() {
        return this._getLogichValue;
    }
    private static _getConditionalStep: (originalStep: PixiVNJsonLabelStep) => PixiVNJsonLabelStep = () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get getConditionalStep() {
        return this._getConditionalStep;
    }
}
