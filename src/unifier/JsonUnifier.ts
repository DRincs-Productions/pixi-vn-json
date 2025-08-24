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
        JsonUnifier._loadAssets = options.loadAssets;
        JsonUnifier._soundOperation = options.soundOperation;
        JsonUnifier._imageOperation = options.imageOperation;
        JsonUnifier._videoOperation = options.videoOperation;
        JsonUnifier._imageContainerOperation = options.imageContainerOperation;
        JsonUnifier._canvasElementOperation = options.canvasElementOperation;
        JsonUnifier._setStorageValue = options.setStorageValue;
        JsonUnifier._inputOperation = options.inputOperation;
        JsonUnifier._tickerOperation = options.tickerOperation;
        JsonUnifier._effectOperation = options.effectOperation;
        JsonUnifier._animateOperation = options.animateOperation;
        JsonUnifier._getLogichValue = options.getLogichValue;
        JsonUnifier._getConditionalStep = options.getConditionalStep;
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
        return JsonUnifier._loadAssets;
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
        return JsonUnifier._soundOperation;
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
        return JsonUnifier._imageOperation;
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
        return JsonUnifier._videoOperation;
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
        return JsonUnifier._imageContainerOperation;
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
        return JsonUnifier._canvasElementOperation;
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
        return JsonUnifier._setStorageValue;
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
        return JsonUnifier._inputOperation;
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
        return JsonUnifier._tickerOperation;
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
        return JsonUnifier._effectOperation;
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
        return JsonUnifier._animateOperation;
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
        return JsonUnifier._getLogichValue;
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
        return JsonUnifier._getConditionalStep;
    }
}
