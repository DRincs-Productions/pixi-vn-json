import type PixiVNJsonCanvas from "@/schema/PixiVNJsonCanvas";
import type PixiVNJsonConditionalStatements from "@/schema/PixiVNJsonConditionalStatements";
import type PixiVNJsonIfElse from "@/schema/PixiVNJsonIfElse";
import type PixiVNJsonNarration from "@/schema/PixiVNJsonNarration";
import type PixiVNJsonSound from "@/schema/PixiVNJsonSound";
import type {
    PixiVNJsonFunction,
    PixiVNJsonValueGet,
    PixiVNJsonValueSet,
} from "@/schema/PixiVNJsonValue";

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
