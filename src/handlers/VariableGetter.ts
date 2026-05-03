import type { StepLabelPropsType, StorageElementType } from "@drincs/pixi-vn";
import { getLogichValue as storageGetLogichValue, getValueFromConditionalStatements } from "@drincs/pixi-vn-json/actions";

export type VariableGetterHandler = <T = StorageElementType>(
    value: T,
    next: (value: T) => T | undefined,
) => T | undefined;

export namespace VariableGetter {
    const _handlers: Set<VariableGetterHandler> = new Set();

    export function add(handler: VariableGetterHandler) {
        _handlers.add(handler);
    }

    export function clear() {
        _handlers.clear();
    }

    export function getLogichValue<T = StorageElementType>(
        value: any,
        props: StepLabelPropsType = {},
    ): T | undefined {
        const baseNext = (v: any): T | undefined =>
            (storageGetLogichValue(v, props) ?? undefined) as T | undefined;
        const processedValue = getValueFromConditionalStatements(value, props);
        if (_handlers.size === 0) {
            return baseNext(processedValue);
        }
        let chain = baseNext;
        for (const handler of _handlers) {
            const nextChain = chain;
            chain = (v: any) => (handler(v, nextChain) ?? undefined) as T | undefined;
        }
        return chain(processedValue);
    }
}
