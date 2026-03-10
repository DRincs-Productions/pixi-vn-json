import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import { PixiVNJsonOperationString } from "../interface";

export function operationStringToString(operation: PixiVNJsonOperationString): string {
    let stringOperation = "";
    operation.values.forEach((value) => {
        if (typeof value === "string") {
            stringOperation += value;
        } else {
            let res = JsonUnifier.getLogichValue<string>(value);
            stringOperation += `${res}`;
        }
    });
    return stringOperation;
}
