import PixiVNJsonCanvas from "./PixiVNJsonCanvas";
import PixiVNJsonConditionalStatements from "./PixiVNJsonConditionalStatements";
import PixiVNJsonIfElse from "./PixiVNJsonIfElse";
import PixiVNJsonInput from "./PixiVNJsonInput";
import PixiVNJsonSound from "./PixiVNJsonSound";
import { PixiVNJsonValueGet, PixiVNJsonValueSet } from "./PixiVNJsonValue";

export type PixiVNJsonOperationString = {
    type: "operationtoconvert";
    values: (string | PixiVNJsonValueGet | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet>)[];
};

export type PixiVNJsonOperationBase = PixiVNJsonValueSet | PixiVNJsonCanvas | PixiVNJsonSound | PixiVNJsonInput;

type PixiVNJsonOperations = (
    | PixiVNJsonOperationBase
    | PixiVNJsonIfElse<PixiVNJsonOperationBase>
    | PixiVNJsonOperationString
)[];

export default PixiVNJsonOperations;
