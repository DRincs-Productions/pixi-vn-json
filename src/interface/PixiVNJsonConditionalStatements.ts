import type PixiVNJsonConditionalResultToCombine from "./PixiVNJsonConditionalResultToCombine";
import type PixiVNJsonIfElse from "./PixiVNJsonIfElse";
import type PixiVNJsonStepSwitch from "./PixiVNJsonStepSwitch";

type PixiVNJsonConditionalStatements<Then> =
    | PixiVNJsonStepSwitch<Then>
    | PixiVNJsonIfElse<
          Then | PixiVNJsonConditionalStatements<Then> | PixiVNJsonConditionalResultToCombine<Then>
      >;
export default PixiVNJsonConditionalStatements;
