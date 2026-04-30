import type PixiVNJsonConditionalResultToCombine from "@/interface/PixiVNJsonConditionalResultToCombine";
import type PixiVNJsonIfElse from "@/interface/PixiVNJsonIfElse";
import type PixiVNJsonStepSwitch from "@/interface/PixiVNJsonStepSwitch";

type PixiVNJsonConditionalStatements<Then> =
    | PixiVNJsonStepSwitch<Then>
    | PixiVNJsonIfElse<
          Then | PixiVNJsonConditionalStatements<Then> | PixiVNJsonConditionalResultToCombine<Then>
      >;
export default PixiVNJsonConditionalStatements;
