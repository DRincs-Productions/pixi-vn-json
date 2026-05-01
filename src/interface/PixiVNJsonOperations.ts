import type PixiVNJsonCanvas from "@/interface/PixiVNJsonCanvas";
import type PixiVNJsonConditionalStatements from "@/interface/PixiVNJsonConditionalStatements";
import type PixiVNJsonIfElse from "@/interface/PixiVNJsonIfElse";
import type PixiVNJsonNarration from "@/interface/PixiVNJsonNarration";
import type PixiVNJsonSound from "@/interface/PixiVNJsonSound";
import type {
    PixiVNJsonFunction,
    PixiVNJsonValueGet,
    PixiVNJsonValueSet,
} from "@/interface/PixiVNJsonValue";

export type PixiVNJsonOperationString = {
    type: "operationtoconvert";
    values: (
        | string
        | PixiVNJsonValueGet
        | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet>
    )[];
};

export type PixiVNJsonOperation = (
    | PixiVNJsonValueSet
    | PixiVNJsonCanvas
    | PixiVNJsonSound
    | PixiVNJsonNarration
    | PixiVNJsonFunction
) & {
    /**
     * This value is used by the system to know where this operation is from, for example, if is generated from a string operation.
     */
    $origin?: string;
};

type PixiVNJsonConditionalOperation =
    | PixiVNJsonOperation
    | PixiVNJsonIfElse<PixiVNJsonOperation>
    | PixiVNJsonOperationString;

export default PixiVNJsonConditionalOperation;
