import PixiVNJsonConditionalStatements from "@/schema/PixiVNJsonConditionalStatements";
import type { PixiVNJsonStepSwitchElementType } from "@/schema/PixiVNJsonStepSwitch";

/**
 * This element is used in case a {@link PixiVNJsonConditionalStatements} gives a result that must be combined with another calculated through other {@link PixiVNJsonConditionalStatements}.
 * in case this possibility is not managed, it will be taken into consideration {@link PixiVNJsonConditionalResultToCombine.firstItem}
 */
type PixiVNJsonConditionalResultToCombine<T> = {
    type: "resulttocombine";
    /**
     * Defines how the two results are combined:
     * - `"cross"` — cartesian product / pairwise combination of both results
     * - `"union"` — concatenation / merge of both results into a single collection
     */
    combine: "cross" | "union";
    /**
     * The first (primary) result item, used as a fallback if the second conditional produces no result.
     */
    firstItem?: T;
    /**
     * The second conditional item(s) whose result will be combined with {@link firstItem}.
     */
    secondConditionalItem?: PixiVNJsonStepSwitchElementType<T>[];
};
export default PixiVNJsonConditionalResultToCombine;
