import type PixiVNJsonCanvas from "./PixiVNJsonCanvas";
import type PixiVNJsonConditionalStatements from "./PixiVNJsonConditionalStatements";
import type PixiVNJsonIfElse from "./PixiVNJsonIfElse";
import type PixiVNJsonNarration from "./PixiVNJsonNarration";
import type PixiVNJsonSound from "./PixiVNJsonSound";
import type { PixiVNJsonValueGet, PixiVNJsonValueSet } from "./PixiVNJsonValue";

export type PixiVNJsonOperationString = {
    type: "operationtoconvert";
    values: (
        | string
        | PixiVNJsonValueGet
        | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet>
    )[];
};

export type PixiVNJsonOperation =
    | PixiVNJsonValueSet
    | PixiVNJsonCanvas
    | PixiVNJsonSound
    | PixiVNJsonNarration;

type PixiVNJsonConditionalOperation =
    | PixiVNJsonOperation
    | PixiVNJsonIfElse<PixiVNJsonOperation>
    | PixiVNJsonOperationString;

export default PixiVNJsonConditionalOperation;
