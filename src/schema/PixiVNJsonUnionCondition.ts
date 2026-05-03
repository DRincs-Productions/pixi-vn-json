import type PixiVNJsonConditions from "@/schema/PixiVNJsonConditions";

/**
 * Combines multiple conditions with a logical AND or OR.
 */
type PixiVNJsonUnionConditionAndOr = {
    type: "union";
    /**
     * The list of conditions to combine.
     */
    conditions: PixiVNJsonConditions[];
    /**
     * - `"and"` — all conditions must be true
     * - `"or"` — at least one condition must be true
     */
    unionType: "and" | "or";
};
/**
 * Negates a single condition with a logical NOT.
 */
type PixiVNJsonUnionConditionNot = {
    type: "union";
    /**
     * The condition to negate.
     */
    condition: PixiVNJsonConditions;
    unionType: "not";
};
/**
 * Union of AND/OR and NOT logical operators over conditions.
 */
type PixiVNJsonUnionCondition = PixiVNJsonUnionConditionAndOr | PixiVNJsonUnionConditionNot;
export default PixiVNJsonUnionCondition;
