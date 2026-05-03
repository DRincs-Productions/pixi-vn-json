import type PixiVNJsonConditionalResultToCombine from "@/schema/PixiVNJsonConditionalResultToCombine";
import type PixiVNJsonIfElse from "@/schema/PixiVNJsonIfElse";
import type PixiVNJsonStepSwitch from "@/schema/PixiVNJsonStepSwitch";

/**
 * A conditional statement that evaluates to a value of type `Then`.
 * It can be either:
 * - a {@link PixiVNJsonStepSwitch} — selects a result from a list based on a strategy (random, sequential, loop)
 * - a {@link PixiVNJsonIfElse} — evaluates a condition and returns the matching branch result,
 *   which may itself be another conditional or a {@link PixiVNJsonConditionalResultToCombine}
 */
type PixiVNJsonConditionalStatements<Then> =
    | PixiVNJsonStepSwitch<Then>
    | PixiVNJsonIfElse<
          Then | PixiVNJsonConditionalStatements<Then> | PixiVNJsonConditionalResultToCombine<Then>
      >;
export default PixiVNJsonConditionalStatements;
