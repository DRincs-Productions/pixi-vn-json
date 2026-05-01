import type PixiVNJsonArithmeticOperations from "@/interface/PixiVNJsonArithmeticOperations";
import type PixiVNJsonUnionCondition from "@/interface/PixiVNJsonUnionCondition";
import type { PixiVNJsonValueGet } from "@/interface/PixiVNJsonValue";
import type { StorageElementType } from "@drincs/pixi-vn";

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

type PixiVNJsonValueCondition = StorageElementType | PixiVNJsonValueGet;

/**
 * Conditions for PixiVNJson
 */
type PixiVNJsonConditions =
    | PixiVNJsonComparation
    | PixiVNJsonValueCondition
    | PixiVNJsonUnionCondition
    | PixiVNJsonArithmeticOperations;

export default PixiVNJsonConditions;
