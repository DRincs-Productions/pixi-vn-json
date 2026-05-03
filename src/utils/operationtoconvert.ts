import type { StepLabelPropsType } from "@drincs/pixi-vn";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import type { PixiVNJsonOperationString } from "@drincs/pixi-vn-json/schema";

/**
 * Converts a {@link PixiVNJsonOperationString} (an array of literal strings and dynamic value
 * expressions) into a single concatenated string by resolving each expression.
 *
 * @param operation - The operation-to-convert descriptor.
 * @param props - The current step label props used to resolve dynamic values.
 * @returns The fully concatenated string.
 */
export function operationStringToString(
    operation: PixiVNJsonOperationString,
    props: StepLabelPropsType = {},
): string {
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
