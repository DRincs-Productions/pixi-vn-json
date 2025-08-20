import { PixiVNJsonIfElse, PixiVNJsonOperation, PixiVNJsonOperationString, PixiVNJsonSound } from "../interface";
import {
    PixiVNJsonCanvasImageVideoShow,
    PixiVNJsonCanvasRemove,
    PixiVNJsonImageEdit,
} from "../interface/PixiVNJsonCanvas";
import { logger } from "../utils/log-utility";

export default class JsonUnifier {
    static init(options: {}) {}
    private static _loadAssets: (
        origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
    ) => Promise<void> = async () => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get loadAssets() {
        return this._loadAssets;
    }
    private static _soundOperation: (operation: PixiVNJsonSound) => void = (operation) => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get soundOperation() {
        return this._soundOperation;
    }
    private static _imageOperation: (
        operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove
    ) => Promise<void> = async (operation) => {
        logger.error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
        throw new Error("Method not implemented, you should initialize the JsonUnifier: JsonUnifier.init()");
    };
    static get imageOperation() {
        return this._imageOperation;
    }
}
