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
    static init(options: {
        loadAssets: (
            origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
        ) => Promise<void>;
        soundOperation: (operation: PixiVNJsonSound) => void;
        imageOperation: (
            operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove
        ) => Promise<void>;
        videoOperation: (
            operation:
                | PixiVNJsonCanvasImageVideoShow
                | PixiVNJsonCanvasRemove
                | PixiVNJsonVideoEdit
                | PixiVNJsonVideoPauseResume
        ) => Promise<void>;
        imageContainerOperation: (
            operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasImageContainerShow | PixiVNJsonImageContainerEdit
        ) => Promise<void>;
        canvasElementOperation: (
            operation:
                | PixiVNJsonCanvasRemove
                | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>>
        ) => Promise<void>;
        setStorageValue: (value: PixiVNJsonValueSet) => void;
        inputOperation: (operation: PixiVNJsonInput) => void;
        tickerOperation: (operation: PixiVNJsonCanvasTicker) => void;
        effectOperation: (operation: PixiVNJsonCanvasEffect) => Promise<void>;
        animateOperation: (operation: PixiVNJsonCanvasAnimate) => void;
        getLogichValue: <T = StorageElementType>(
            value:
                | T
                | PixiVNJsonValueGet
                | PixiVNJsonArithmeticOperations
                | PixiVNJsonConditions
                | PixiVNJsonConditionalStatements<
                      T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions
                  >
        ) => T | undefined;
        getConditionalStep: (originalStep: PixiVNJsonLabelStep) => PixiVNJsonLabelStep;
    }) {
        this._loadAssets = options.loadAssets;
        this._soundOperation = options.soundOperation;
        this._imageOperation = options.imageOperation;
        this._videoOperation = options.videoOperation;
        this._imageContainerOperation = options.imageContainerOperation;
        this._canvasElementOperation = options.canvasElementOperation;
        this._setStorageValue = options.setStorageValue;
        this._inputOperation = options.inputOperation;
        this._tickerOperation = options.tickerOperation;
        this._effectOperation = options.effectOperation;
        this._animateOperation = options.animateOperation;
        this._getLogichValue = options.getLogichValue;
        this._getConditionalStep = options.getConditionalStep;
    }
    private static _loadAssets: (
        origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get loadAssets() {
        return this._loadAssets;
    }
    private static _soundOperation: (operation: PixiVNJsonSound) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get soundOperation() {
        return this._soundOperation;
    }
    private static _imageOperation: (
        operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
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
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get videoOperation() {
        return this._videoOperation;
    }
    private static _imageContainerOperation: (
        operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasImageContainerShow | PixiVNJsonImageContainerEdit
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get imageContainerOperation() {
        return this._imageContainerOperation;
    }
    private static _canvasElementOperation: (
        operation:
            | PixiVNJsonCanvasRemove
            | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>>
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get canvasElementOperation() {
        return this._canvasElementOperation;
    }
    private static _setStorageValue: (value: PixiVNJsonValueSet) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get setStorageValue() {
        return this._setStorageValue;
    }
    private static _inputOperation: (operation: PixiVNJsonInput) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get inputOperation() {
        return this._inputOperation;
    }
    private static _tickerOperation: (operation: PixiVNJsonCanvasTicker) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get tickerOperation() {
        return this._tickerOperation;
    }
    private static _effectOperation: (operation: PixiVNJsonCanvasEffect) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get effectOperation() {
        return this._effectOperation;
    }
    private static _animateOperation: (operation: PixiVNJsonCanvasAnimate) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
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
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get getLogichValue() {
        return this._getLogichValue;
    }
    private static _getConditionalStep: (originalStep: PixiVNJsonLabelStep) => PixiVNJsonLabelStep = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get getConditionalStep() {
        return this._getConditionalStep;
    }
}
