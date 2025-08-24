import PixiVNJsonCanvas from "./PixiVNJsonCanvas";
import PixiVNJsonConditionalStatements from "./PixiVNJsonConditionalStatements";
import PixiVNJsonIfElse from "./PixiVNJsonIfElse";
import PixiVNJsonNarration from "./PixiVNJsonNarration";
import PixiVNJsonSound from "./PixiVNJsonSound";
import { PixiVNJsonValueGet, PixiVNJsonValueSet } from "./PixiVNJsonValue";

export type PixiVNJsonOperationString = {
    type: "operationtoconvert";
    values: (string | PixiVNJsonValueGet | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet>)[];
};

export type PixiVNJsonOperation = PixiVNJsonValueSet | PixiVNJsonCanvas | PixiVNJsonSound | PixiVNJsonNarration;

type PixiVNJsonConditionalOperation =
    | PixiVNJsonOperation
    | PixiVNJsonIfElse<PixiVNJsonOperation>
    | PixiVNJsonOperationString;

export default PixiVNJsonConditionalOperation;
