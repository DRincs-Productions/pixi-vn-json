import { StorageElementType } from "@drincs/pixi-vn"
import PixiVNJsonArithmeticOperations from "./PixiVNJsonArithmeticOperations"
import PixiVNJsonConditionalStatements from "./PixiVNJsonConditionalStatements"
import PixiVNJsonConditions from "./PixiVNJsonConditions"

export type PixiVNJsonStorageGet = {
    type: "value"
    storageOperationType: "get",
    /**
     * Key of the storage
     */
    key: string,
    /**
     * Type of the storage, if it is a flagStorage or a storage.
     * If it is a flagStorage, the value will be get with the function {@link getFlag}
     */
    storageType: "storage" | "flagStorage" | "tempstorage",
}

export type PixiVNJsonParamGet = {
    type: "value"
    storageOperationType: "get",
    /**
     * Key of the storage
     */
    key: number,
    storageType: "params",
}

export type PixiVNJsonLabelGet = {
    type: "value"
    storageOperationType: "get",
    /**
     * Id of the label
     */
    label: string,
    /**
     * If it is a label, the value will be get with the function {@link narration.getTimesLabelOpened}
     */
    storageType: "label",
}
export type PixiVNJsonLogicGet = {
    type: "value"
    storageOperationType: "get",
    operation: PixiVNJsonArithmeticOperations | PixiVNJsonConditions,
    storageType: "logic",
}
export type PixiVNJsonValueGet = PixiVNJsonStorageGet | PixiVNJsonParamGet | PixiVNJsonLabelGet | PixiVNJsonLogicGet

type PixiVNJsonOnlyStorageSet = {
    type: "value"
    storageOperationType: "set",
    /**
     * Key of the storage
     */
    key: string,
    /**
     * Value to be set in the storage
     */
    value: StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditionalStatements<StorageElementType>,
    /**
     * Type of the storage, if it is a flagStorage or a storage.
     */
    storageType: "storage" | "tempstorage",
}

type PixiVNJsonOnlyParamSet = {
    type: "value"
    storageOperationType: "set",
    /**
     * Key of the storage
     */
    key: number,
    /**
     * Value to be set in the storage
     */
    value: StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditionalStatements<StorageElementType>,
    storageType: "params",
}

type PixiVNJsonFlagSet = {
    type: "value"
    storageOperationType: "set",
    /**
     * Key of the storage
     */
    key: string,
    /**
     * Value to be set in the storage
     */
    value: boolean,
    /**
     * Type of the storage, if it is a flagStorage or a storage.
     */
    storageType: "flagStorage",
}

export type PixiVNJsonValueSet = PixiVNJsonOnlyStorageSet | PixiVNJsonFlagSet | PixiVNJsonOnlyParamSet
