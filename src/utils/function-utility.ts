import { JsonUnifier } from "@/core";
import { logger } from "@/utils/log-utility";
import type { StepLabelPropsType } from "@drincs/pixi-vn";
import type { PixiVNJsonFunction } from "@drincs/pixi-vn-json/schema";

/**
 * Executes a JSON function operation by looking up the function name in `props` and
 * calling it with the resolved argument values.
 *
 * If the function name is not found in `props`, a warning is logged and `undefined` is returned.
 *
 * @param v - The function operation descriptor, including the function name and arguments.
 * @param props - The current step label props that should contain the callable function.
 * @returns The return value of the called function, or `undefined` if not found.
 */
export function functionOperation(v: PixiVNJsonFunction, props: StepLabelPropsType): any {
    if (
        props &&
        typeof props === "object" &&
        typeof v.functionName === "string" &&
        v.functionName in props
    ) {
        const func = (props as any)[v.functionName];
        if (typeof func === "function") {
            const args = (v as PixiVNJsonFunction).args.map((arg) =>
                JsonUnifier.getLogichValue(arg, props),
            );
            return func(...args);
        } else {
            logger.warn(`getLogichValue function ${v.functionName} not found in props`);
        }
    }
}
