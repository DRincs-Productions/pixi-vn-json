import { JsonUnifier } from "@/core";
import type { PixiVNJsonFunction } from "@/interface";
import { logger } from "@/utils/log-utility";
import type { StepLabelPropsType } from "@drincs/pixi-vn";

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
