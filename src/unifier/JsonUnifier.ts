import { PixiVNJsonIfElse, PixiVNJsonOperation, PixiVNJsonOperationString, PixiVNJsonSound } from "../interface";
import {
    PixiVNJsonCanvasImageVideoShow,
    PixiVNJsonCanvasRemove,
    PixiVNJsonImageEdit,
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
}
