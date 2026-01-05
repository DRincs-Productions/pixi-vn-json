import {
    ContainerChild,
    ContainerMemory,
    ImageSpriteMemory,
    StorageElementType,
    VideoSpriteMemory,
} from "@drincs/pixi-vn";
import { PixiVNJsonOnlyStorageSet } from "src/interface/PixiVNJsonValue";
import {
    PixiVNJsonArithmeticOperations,
    PixiVNJsonCanvasAnimate,
    PixiVNJsonCanvasEffect,
    PixiVNJsonConditionalStatements,
    PixiVNJsonConditions,
    PixiVNJsonIfElse,
    PixiVNJsonLabelStep,
    PixiVNJsonNarration,
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
    PixiVNJsonCanvasTextShow,
    PixiVNJsonImageContainerEdit,
    PixiVNJsonImageEdit,
    PixiVNJsonTextEdit,
    PixiVNJsonUnknownEdit,
    PixiVNJsonVideoEdit,
    PixiVNJsonVideoPauseResume,
} from "../interface/PixiVNJsonCanvas";
import { logger } from "../utils/log-utility";

export default class JsonUnifier {
    static init(options: {
        loadAssets?: (
            origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
        ) => Promise<void> | void;
        soundOperation?: (operation: PixiVNJsonSound) => void;
        imageOperation?: (
            operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove
        ) => Promise<void>;
        videoOperation?: (
            operation:
                | PixiVNJsonCanvasImageVideoShow
                | PixiVNJsonCanvasRemove
                | PixiVNJsonVideoEdit
                | PixiVNJsonVideoPauseResume
        ) => Promise<void>;
        imageContainerOperation?: (
            operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasImageContainerShow | PixiVNJsonImageContainerEdit
        ) => Promise<void>;
        textOperation?: (
            operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasTextShow | PixiVNJsonTextEdit
        ) => Promise<void>;
        canvasElementOperation?: (
            operation:
                | PixiVNJsonCanvasRemove
                | PixiVNJsonUnknownEdit<ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>>
        ) => Promise<void>;
        setStorageValue?: (value: PixiVNJsonValueSet) => void;
        setInitialStorageValue: (value: PixiVNJsonOnlyStorageSet) => void;
        narrationOperation?: (operation: PixiVNJsonNarration) => void;
        effectOperation?: (operation: PixiVNJsonCanvasEffect) => Promise<void>;
        animateOperation?: (operation: PixiVNJsonCanvasAnimate) => void;
        getLogichValue?: <T = StorageElementType>(
            value:
                | T
                | PixiVNJsonValueGet
                | PixiVNJsonArithmeticOperations
                | PixiVNJsonConditions
                | PixiVNJsonConditionalStatements<
                      T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions
                  >
        ) => T | undefined;
        getConditionalStep?: (originalStep: PixiVNJsonLabelStep) => PixiVNJsonLabelStep;
    }) {
        if (options.loadAssets) JsonUnifier._loadAssets = options.loadAssets;
        if (options.soundOperation) JsonUnifier._soundOperation = options.soundOperation;
        if (options.imageOperation) JsonUnifier._imageOperation = options.imageOperation;
        if (options.videoOperation) JsonUnifier._videoOperation = options.videoOperation;
        if (options.imageContainerOperation) JsonUnifier._imageContainerOperation = options.imageContainerOperation;
        if (options.textOperation) JsonUnifier._textOperation = options.textOperation;
        if (options.canvasElementOperation) JsonUnifier._canvasElementOperation = options.canvasElementOperation;
        if (options.setStorageValue) JsonUnifier._setStorageValue = options.setStorageValue;
        if (options.setInitialStorageValue) JsonUnifier._setInitialStorageValue = options.setInitialStorageValue;
        if (options.narrationOperation) JsonUnifier._narrationOperation = options.narrationOperation;
        if (options.effectOperation) JsonUnifier._effectOperation = options.effectOperation;
        if (options.animateOperation) JsonUnifier._animateOperation = options.animateOperation;
        if (options.getLogichValue) JsonUnifier._getLogichValue = options.getLogichValue;
        if (options.getConditionalStep) JsonUnifier._getConditionalStep = options.getConditionalStep;
    }
    private static _loadAssets: (
        origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
    ) => Promise<void> | void = () => {};
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
    static get textOperation() {
        return JsonUnifier._textOperation;
    }
    private static _textOperation: (
        operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasTextShow | PixiVNJsonTextEdit
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
    private static _setInitialStorageValue: (value: PixiVNJsonOnlyStorageSet) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get setInitialStorageValue() {
        return JsonUnifier._setInitialStorageValue;
    }
    private static _narrationOperation: (operation: PixiVNJsonNarration) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
        throw new Error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue."
        );
    };
    static get narrationOperation() {
        return JsonUnifier._narrationOperation;
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
