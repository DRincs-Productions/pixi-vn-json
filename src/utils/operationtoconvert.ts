import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import type { StepLabelPropsType } from "@drincs/pixi-vn";
import type { PixiVNJsonOperationString } from "../interface";

export function operationStringToString(operation: PixiVNJsonOperationString, props: StepLabelPropsType = {}): string {
    let stringOperation = "";
    operation.values.forEach((value) => {
        if (typeof value === "string") {
            stringOperation += value;
        } else {
            const res = JsonUnifier.getLogichValue<string>(value, props);
            stringOperation += `${res}`;
        }
    });
    return stringOperation;
}
