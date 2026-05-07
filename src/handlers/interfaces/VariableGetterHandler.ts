import type { StorageElementType } from "@drincs/pixi-vn";

/**
 * A middleware handler that can intercept and transform a logic value before it is
 * returned by {@link VariableGetter.getLogichValue}.
 *
 * Handlers are called in registration order, each receiving the current value and a
 * `next` function to invoke the rest of the chain (including the built-in resolver).
 * Return `undefined` to fall through to `next`.
 */
export type VariableGetterHandler = <T = StorageElementType>(
    value: T,
    next: (value: T) => T | undefined,
) => T | undefined;
