import type { VariableGetterHandler } from "@/handlers/interfaces/VariableGetterHandler";
import type { StepLabelPropsType, StorageElementType } from "@drincs/pixi-vn";
import {
    getValueFromConditionalStatements,
    getLogichValue as storageGetLogichValue,
} from "@drincs/pixi-vn-json/actions";

export namespace VariableGetter {
    const _handlers: Set<VariableGetterHandler> = new Set();

    /**
     * Registers a new middleware handler into the resolution chain.
     * Handlers are invoked in the order they were added.
     *
     * @param handler - The middleware handler to register.
     */
    export function add(handler: VariableGetterHandler) {
        _handlers.add(handler);
    }

    /**
     * Removes all registered middleware handlers, restoring the default resolution behaviour.
     */
    export function clear() {
        _handlers.clear();
    }

    /**
     * Resolves a JSON logic value, running it through all registered middleware handlers
     * before falling back to the built-in storage/arithmetic/condition evaluator.
     *
     * @param value - The value or logic expression to resolve.
     * @param props - The current step label props passed to each handler.
     * @returns The resolved value, or `undefined`.
     */
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
