import type PixiVNJsonConditionalStatements from "@/schema/PixiVNJsonConditionalStatements";
import type { PixiVNJsonValueGet } from "@/schema/PixiVNJsonValue";
import type { StorageElementType } from "@drincs/pixi-vn";

/**
 * Binary arithmetic operation between two values (left OP right).
 */
export interface PixiVNJsonArithmeticOperationsArithmetic {
    type: "arithmetic";
    /**
     * Left value of the arithmetic operation
     */
    leftValue:
        | StorageElementType
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditionalStatements<
              StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations
          >;
    /**
     * Right value of the arithmetic operation
     */
    rightValue:
        | StorageElementType
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditionalStatements<
              StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations
          >;
    /**
     * Operator of the arithmetic operation:
     * - `"*"` multiplication
     * - `"/"` division
     * - `"+"` addition (concatenation for strings and arrays)
     * - `"-"` subtraction (removal of elements for arrays)
     * - `"%"` modulo
     * - `"POW"` exponentiation
     * - `"RANDOM"` random integer between leftValue and rightValue (inclusive)
     */
    operator: "*" | "/" | "+" | "-" | "%" | "POW" | "RANDOM";
}

/**
 * Unary arithmetic operation applied to a single value (e.g. INT, FLOOR, FLOAT).
 */
export interface PixiVNJsonArithmeticOperationsArithmeticSingle {
    type: "arithmeticsingle";
    /**
     * Left value of the arithmetic operation
     */
    leftValue:
        | StorageElementType
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditionalStatements<
              StorageElementType | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations
          >;
    /**
     * Operator of the arithmetic operation:
     * - `"INT"` truncates the value to an integer (removes the decimal part)
     * - `"FLOOR"` rounds down to the nearest integer
     * - `"FLOAT"` converts the value to a floating-point number
     */
    operator: "INT" | "FLOOR" | "FLOAT";
}

/**
 * Arithmetic operations for the PixiVNJson
 */
type PixiVNJsonArithmeticOperations =
    | PixiVNJsonArithmeticOperationsArithmeticSingle
    | PixiVNJsonArithmeticOperationsArithmetic;
export default PixiVNJsonArithmeticOperations;
