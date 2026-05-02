import type { StorageElementType, StepLabelPropsType } from "@drincs/pixi-vn";
import { getLogichValue, getValueFromConditionalStatements } from "../utils/storage";

export type GetLogichValueHandler = <T = StorageElementType>(
    value: T,
    next: (value: T) => T | undefined,
) => T | undefined;

const _handlers: GetLogichValueHandler[] = [];

export const getLogichValueHandlers = {
    add(handler: GetLogichValueHandler): void {
        _handlers.push(handler);
    },
    remove(handler: GetLogichValueHandler): void {
        const index = _handlers.indexOf(handler);
        if (index !== -1) _handlers.splice(index, 1);
    },
};

export function applyGetLogichValueHandlers<T = StorageElementType>(
    value: any,
    props: StepLabelPropsType = {},
): T | undefined {
    const baseNext = (v: any): T | undefined => (getLogichValue(v, props) ?? undefined) as T | undefined;
    const processedValue = getValueFromConditionalStatements(value, props);
    if (_handlers.length === 0) {
        return baseNext(processedValue);
    }
    let chain = baseNext;
    for (let i = _handlers.length - 1; i >= 0; i--) {
        const handler = _handlers[i];
        const nextChain = chain;
        chain = (v: any) => (handler(v, nextChain) ?? undefined) as T | undefined;
    }
    return chain(processedValue);
}
