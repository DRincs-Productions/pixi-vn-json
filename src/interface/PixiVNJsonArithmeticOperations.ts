import { StorageElementType } from "@drincs/pixi-vn"
import PixiVNJsonConditionalStatements from "./PixiVNJsonConditionalStatements"
import { PixiVNJsonValueGet } from "./PixiVNJsonValue"

export interface PixiVNJsonArithmeticOperationsArithmetic {
    type: "arithmetic",
    /**
     * Left value of the arithmetic operation
     */
    leftValue: StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditionalStatements<StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations>,
    /**
     * Right value of the arithmetic operation
     */
    rightValue: StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditionalStatements<StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations>,
    /**
     * Operator of the arithmetic operation
     */
    operator: "*" | "/" | "+" | "-" | "%" | "POW" | "RANDOM"
}

export interface PixiVNJsonArithmeticOperationsArithmeticSingle {
    type: "arithmeticsingle",
    /**
     * Left value of the arithmetic operation
     */
    leftValue: StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditionalStatements<StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations>,
    /**
     * Operator of the arithmetic operation
     */
    operator: "INT" | "FLOOR" | "FLOAT"
}

/**
 * Arithmetic operations for the PixiVNJson
 */
type PixiVNJsonArithmeticOperations = PixiVNJsonArithmeticOperationsArithmeticSingle | PixiVNJsonArithmeticOperationsArithmetic
export default PixiVNJsonArithmeticOperations
