import {
    PixiError,
    type ContainerChild,
    type ContainerMemory,
    type ImageSpriteMemory,
    type StepLabelPropsType,
    type StorageElementType,
    type VideoSpriteMemory,
} from "@drincs/pixi-vn";
import type {
    PixiVNJsonArithmeticOperations,
    PixiVNJsonCanvasAnimate,
    PixiVNJsonCanvasEffect,
    PixiVNJsonCanvasImageContainerShow,
    PixiVNJsonCanvasImageVideoShow,
    PixiVNJsonCanvasRemove,
    PixiVNJsonCanvasTextShow,
    PixiVNJsonConditionalStatements,
    PixiVNJsonConditions,
    PixiVNJsonIfElse,
    PixiVNJsonImageContainerEdit,
    PixiVNJsonImageEdit,
    PixiVNJsonLabelStep,
    PixiVNJsonNarration,
    PixiVNJsonOnlyStorageSet,
    PixiVNJsonOperation,
    PixiVNJsonOperationString,
    PixiVNJsonSound,
    PixiVNJsonTextEdit,
    PixiVNJsonUnknownEdit,
    PixiVNJsonValueGet,
    PixiVNJsonValueSet,
    PixiVNJsonVideoEdit,
    PixiVNJsonVideoPauseResume,
} from "@drincs/pixi-vn-json/schema";
import { logger } from "../utils/log-utility";

export default class JsonUnifier {
    /**
     * Registers the operation handlers that pixi-vn-json will delegate to at runtime.
     * Call this once at application startup (e.g. via {@link init}) before importing any labels.
     *
     * All parameters are optional except `setInitialStorageValue`, which is required because
     * it must be available for initial-operation processing during label import.
     */
    static init(options: {
        loadAssets?: (
            origin:
                | PixiVNJsonOperation
                | PixiVNJsonIfElse<PixiVNJsonOperation>
                | PixiVNJsonOperationString,
        ) => Promise<void> | void;
        soundOperation?: (operation: PixiVNJsonSound) => void;
        imageOperation?: (
            operation:
                | PixiVNJsonCanvasImageVideoShow
                | PixiVNJsonImageEdit
                | PixiVNJsonCanvasRemove,
        ) => Promise<void>;
        videoOperation?: (
            operation:
                | PixiVNJsonCanvasImageVideoShow
                | PixiVNJsonCanvasRemove
                | PixiVNJsonVideoEdit
                | PixiVNJsonVideoPauseResume,
        ) => Promise<void>;
        imageContainerOperation?: (
            operation:
                | PixiVNJsonCanvasRemove
                | PixiVNJsonCanvasImageContainerShow
                | PixiVNJsonImageContainerEdit,
        ) => Promise<void>;
        textOperation?: (
            operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasTextShow | PixiVNJsonTextEdit,
        ) => Promise<void>;
        canvasElementOperation?: (
            operation:
                | PixiVNJsonCanvasRemove
                | PixiVNJsonUnknownEdit<
                      ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>
                  >,
        ) => Promise<void>;
        setStorageValue?: (value: PixiVNJsonValueSet, props?: StepLabelPropsType) => void;
        setInitialStorageValue: (
            value: PixiVNJsonOnlyStorageSet,
            props?: StepLabelPropsType,
        ) => void;
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
                  >,
            props?: StepLabelPropsType,
        ) => T | undefined;
        getConditionalStep?: (
            originalStep: PixiVNJsonLabelStep,
            props?: StepLabelPropsType,
        ) => PixiVNJsonLabelStep;
    }) {
        if (options.loadAssets) JsonUnifier._loadAssets = options.loadAssets;
        if (options.soundOperation) JsonUnifier._soundOperation = options.soundOperation;
        if (options.imageOperation) JsonUnifier._imageOperation = options.imageOperation;
        if (options.videoOperation) JsonUnifier._videoOperation = options.videoOperation;
        if (options.imageContainerOperation)
            JsonUnifier._imageContainerOperation = options.imageContainerOperation;
        if (options.textOperation) JsonUnifier._textOperation = options.textOperation;
        if (options.canvasElementOperation)
            JsonUnifier._canvasElementOperation = options.canvasElementOperation;
        if (options.setStorageValue) JsonUnifier._setStorageValue = options.setStorageValue;
        if (options.setInitialStorageValue)
            JsonUnifier._setInitialStorageValue = options.setInitialStorageValue;
        if (options.narrationOperation)
            JsonUnifier._narrationOperation = options.narrationOperation;
        if (options.effectOperation) JsonUnifier._effectOperation = options.effectOperation;
        if (options.animateOperation) JsonUnifier._animateOperation = options.animateOperation;
        if (options.getLogichValue) JsonUnifier._getLogichValue = options.getLogichValue;
        if (options.getConditionalStep)
            JsonUnifier._getConditionalStep = options.getConditionalStep;
    }
    private static _loadAssets: (
        origin:
            | PixiVNJsonOperation
            | PixiVNJsonIfElse<PixiVNJsonOperation>
            | PixiVNJsonOperationString,
    ) => Promise<void> | void = () => {};
    /** Registered handler for loading/lazy-loading assets. */
    static get loadAssets() {
        return JsonUnifier._loadAssets;
    }
    private static _soundOperation: (operation: PixiVNJsonSound) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for sound play/stop/pause/resume/edit operations. */
    static get soundOperation() {
        return JsonUnifier._soundOperation;
    }
    private static _imageOperation: (
        operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove,
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for {@link ImageSprite} show/edit/remove operations. */
    static get imageOperation() {
        return JsonUnifier._imageOperation;
    }
    private static _videoOperation: (
        operation:
            | PixiVNJsonCanvasImageVideoShow
            | PixiVNJsonCanvasRemove
            | PixiVNJsonVideoEdit
            | PixiVNJsonVideoPauseResume,
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for {@link VideoSprite} show/edit/remove/pause/resume operations. */
    static get videoOperation() {
        return JsonUnifier._videoOperation;
    }
    private static _imageContainerOperation: (
        operation:
            | PixiVNJsonCanvasRemove
            | PixiVNJsonCanvasImageContainerShow
            | PixiVNJsonImageContainerEdit,
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    static get imageContainerOperation() {
        return JsonUnifier._imageContainerOperation;
    }
    private static _textOperation: (
        operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasTextShow | PixiVNJsonTextEdit,
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for {@link Text} show/edit/remove operations. */
    static get textOperation() {
        return JsonUnifier._textOperation;
    }
    private static _canvasElementOperation: (
        operation:
            | PixiVNJsonCanvasRemove
            | PixiVNJsonUnknownEdit<
                  ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>
              >,
    ) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for generic canvas-element edit/remove operations. */
    static get canvasElementOperation() {
        return JsonUnifier._canvasElementOperation;
    }
    private static _setStorageValue: (
        value: PixiVNJsonValueSet,
        props?: StepLabelPropsType,
    ) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for setting a storage value during label execution. */
    static get setStorageValue() {
        return JsonUnifier._setStorageValue;
    }
    private static _setInitialStorageValue: (
        value: PixiVNJsonOnlyStorageSet,
        props?: StepLabelPropsType,
    ) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for setting a default (initial) storage value at import time. */
    static get setInitialStorageValue() {
        return JsonUnifier._setInitialStorageValue;
    }
    private static _narrationOperation: (operation: PixiVNJsonNarration) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for narration operations (input requests, dialogue resets). */
    static get narrationOperation() {
        return JsonUnifier._narrationOperation;
    }
    private static _effectOperation: (operation: PixiVNJsonCanvasEffect) => Promise<void> = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for canvas visual effects (e.g. shake). */
    static get effectOperation() {
        return JsonUnifier._effectOperation;
    }
    private static _animateOperation: (operation: PixiVNJsonCanvasAnimate) => void = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler for keyframe animation operations. */
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
              >,
        props?: StepLabelPropsType,
    ) => T | undefined = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler that evaluates a JSON logic expression to a plain value. */
    static get getLogichValue() {
        return JsonUnifier._getLogichValue;
    }
    private static _getConditionalStep: (
        originalStep: PixiVNJsonLabelStep,
        props?: StepLabelPropsType,
    ) => PixiVNJsonLabelStep = () => {
        logger.error(
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
        throw new PixiError(
            "invalid_usage",
            "An error occurred! pixi-vn-json was not initialized. Please contact the Pixi'VN team to report the issue.",
        );
    };
    /** Registered handler that resolves a label step's `conditionalStep` field. */
    static get getConditionalStep() {
        return JsonUnifier._getConditionalStep;
    }
}
