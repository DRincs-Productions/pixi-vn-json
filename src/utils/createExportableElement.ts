import { logger } from "./log-utility";

export function createExportableElement<T>(element: T): T {
    try {
        if (typeof element === "undefined") {
            return element;
        }
        let elementString = JSON.stringify(element);
        return JSON.parse(elementString);
    } catch (e) {
        logger.error("Error creating exportable element", element, e);
        throw new Error("[Pixi’VN] Error creating exportable element");
    }
}
