import type PixiVNJsonConditionalResultToCombine from "@/schema/PixiVNJsonConditionalResultToCombine";
import type PixiVNJsonIfElse from "@/schema/PixiVNJsonIfElse";
import type PixiVNJsonStepSwitch from "@/schema/PixiVNJsonStepSwitch";

type PixiVNJsonConditionalStatements<Then> =
    | PixiVNJsonStepSwitch<Then>
    | PixiVNJsonIfElse<
          Then | PixiVNJsonConditionalStatements<Then> | PixiVNJsonConditionalResultToCombine<Then>
      >;
export default PixiVNJsonConditionalStatements;
