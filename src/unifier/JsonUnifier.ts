import { PixiVNJsonIfElse, PixiVNJsonOperation, PixiVNJsonOperationString, PixiVNJsonSound } from "../interface";
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
}
