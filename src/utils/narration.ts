import { narration } from "@drincs/pixi-vn";
import { PixiVNJsonInput } from "../interface";

export function inputOperation(operation: PixiVNJsonInput) {
    switch (operation.operationType) {
        case "request":
            narration.requestInput({ type: operation.valueType }, operation.defaultValue);
            break;
    }
}
