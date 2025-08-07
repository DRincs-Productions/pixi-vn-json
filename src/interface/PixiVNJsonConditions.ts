import { StorageElementType } from "@drincs/pixi-vn";
import PixiVNJsonArithmeticOperations from "./PixiVNJsonArithmeticOperations";
import PixiVNJsonUnionCondition from "./PixiVNJsonUnionCondition";
import { PixiVNJsonValueGet } from "./PixiVNJsonValue";

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
    operator: "==" | "!=" | "<" | "<=" | ">" | ">=" | "CONTAINS";
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
