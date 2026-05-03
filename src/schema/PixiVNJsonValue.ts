import type PixiVNJsonArithmeticOperations from "@/schema/PixiVNJsonArithmeticOperations";
import type PixiVNJsonConditionalStatements from "@/schema/PixiVNJsonConditionalStatements";
import type PixiVNJsonConditions from "@/schema/PixiVNJsonConditions";
import type { StorageElementType } from "@drincs/pixi-vn";

/**
 * Retrieves a value from the persistent storage, flag storage, or temporary storage.
 */
export type PixiVNJsonStorageGet = {
    type: "value";
    storageOperationType: "get";
    /**
     * Key of the storage
     */
    key: string;
    /**
     * Type of the storage, if it is a flagStorage or a storage.
     * If it is a flagStorage, the value will be get with the function {@link getFlag}
     */
    storageType: "storage" | "flagStorage" | "tempstorage";
};

export type PixiVNJsonParamGet = {
    type: "value";
    storageOperationType: "get";
    /**
     * Index of the parameter in the params array.
     */
    key: number;
    storageType: "params";
};

/**
 * Retrieves the number of times a label has been opened.
 */
export type PixiVNJsonLabelGet = {
    type: "value";
    storageOperationType: "get";
    /**
     * Id of the label
     */
    label: string;
    /**
     * If it is a label, the value will be get with the function {@link narration.getTimesLabelOpened}
     */
    storageType: "label";
};
/**
 * Retrieves the number of times a specific choice has been selected.
 */
export type PixiVNJsonChoiceGet = {
    type: "value";
    storageOperationType: "get";
    /**
     * index of the choice
     */
    index: number;
    /**
     * If it is a choice, the value will be get with the function {@link narration.getTimesChoiceOpened}
     */
    storageType: "choice";
};
/**
 * Retrieves a value from the logic/arithmetic layer (result of a computation or condition).
 */
export type PixiVNJsonLogicGet = {
    type: "value";
    storageOperationType: "get";
    /**
     * The arithmetic or conditional operation whose result is the retrieved value.
     */
    operation: PixiVNJsonArithmeticOperations | PixiVNJsonConditions;
    storageType: "logic";
};
/**
 * Union of all "get value" operations — reads from storage, params, labels, choices, or a logic expression.
 */
export type PixiVNJsonValueGet =
    | PixiVNJsonStorageGet
    | PixiVNJsonParamGet
    | PixiVNJsonLabelGet
    | PixiVNJsonChoiceGet
    | PixiVNJsonLogicGet
    | PixiVNJsonFunction;
/**
 * Invokes a named function and returns its result.
 * Functions are registered in the Pixi'VN runtime and can receive typed arguments.
 */
export type PixiVNJsonFunction = {
    type: "function";
    /**
     * The name of the registered function to call.
     */
    functionName: string;
    /**
     * Arguments to pass to the function. Each argument can be a condition, a raw value,
     * a value-get operation, or an arithmetic expression.
     */
    args: (
        | PixiVNJsonConditions
        | StorageElementType
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
    )[];
};

/**
 * Sets a value in either the persistent storage or the temporary (session) storage.
 */
export type PixiVNJsonOnlyStorageSet = {
    type: "value";
    storageOperationType: "set";
    /**
     * Key of the storage
     */
    key: string;
    /**
     * Value to be set in the storage
     */
    value:
        | StorageElementType
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditionalStatements<StorageElementType>;
    /**
     * Type of the storage, if it is a flagStorage or a storage.
     */
    storageType: "storage" | "tempstorage";
};

/**
 * Sets a positional parameter value in the params temporary storage.
 */
type PixiVNJsonOnlyParamSet = {
    type: "value";
    storageOperationType: "set";
    /**
     * Index of the parameter in the params array to set.
     */
    key: number;
    /**
     * Value to be set at the given param index.
     */
    value:
        | StorageElementType
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditionalStatements<StorageElementType>;
    storageType: "params";
};

/**
 * Sets a boolean flag in the flag storage.
 * Flag storage is a dedicated boolean key-value store queried with {@link getFlag}.
 */
type PixiVNJsonFlagSet = {
    type: "value";
    storageOperationType: "set";
    /**
     * Key of the storage
     */
    key: string;
    /**
     * Value to be set in the storage
     */
    value: boolean;
    /**
     * Type of the storage, if it is a flagStorage or a storage.
     */
    storageType: "flagStorage";
};

/**
 * Union of all "set value" operations — writes to storage, flag storage, or params.
 */
export type PixiVNJsonValueSet =
    | PixiVNJsonOnlyStorageSet
    | PixiVNJsonFlagSet
    | PixiVNJsonOnlyParamSet;
