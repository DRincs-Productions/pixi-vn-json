import type PixiVNJsonArithmeticOperations from "@/schema/PixiVNJsonArithmeticOperations";
import type PixiVNJsonUnionCondition from "@/schema/PixiVNJsonUnionCondition";
import type { PixiVNJsonValueGet } from "@/schema/PixiVNJsonValue";
import type { StorageElementType } from "@drincs/pixi-vn";

/**
 * Supported comparison operators.
 * - `"=="` equal
 * - `"!="` not equal
 * - `"<"` less than
 * - `"<="` less than or equal
 * - `">"` greater than
 * - `">="` greater than or equal
 * - `"CONTAINS"` checks whether the left string/array contains the right value, if left and right are arrays, checks if all items in right are included in left
 */
export type PixiVNJsonComparationOperatorsType = "==" | "!=" | "<" | "<=" | ">" | ">=" | "CONTAINS";

/**
 * Comparation for PixiVNJson.
 * In this comparation, the values to be converted to string and compared.
 */
export type PixiVNJsonComparation = {
    type: "compare";
    /**
     * Left value of the comparation
     */
    leftValue: StorageElementType | PixiVNJsonValueGet | PixiVNJsonConditions;
    /**
     * Right value of the comparation
     */
    rightValue: StorageElementType | PixiVNJsonValueGet | PixiVNJsonConditions;
    /**
     * Operator of the comparation
     */
    operator: PixiVNJsonComparationOperatorsType;
};

/**
 * A plain value condition — truthy/falsy evaluation of a raw value or a value-get result.
 */
type PixiVNJsonValueCondition = StorageElementType | PixiVNJsonValueGet;

/**
 * Union of all condition types supported by PixiVNJson:
 * - {@link PixiVNJsonComparation} — binary comparison between two values
 * - {@link PixiVNJsonValueCondition} — truthy/falsy check on a plain value
 * - {@link PixiVNJsonUnionCondition} — logical AND, OR, or NOT of other conditions
 * - {@link PixiVNJsonArithmeticOperations} — arithmetic result used as a boolean (non-zero = true)
 */
type PixiVNJsonConditions =
    | PixiVNJsonComparation
    | PixiVNJsonValueCondition
    | PixiVNJsonUnionCondition
    | PixiVNJsonArithmeticOperations;

export default PixiVNJsonConditions;
