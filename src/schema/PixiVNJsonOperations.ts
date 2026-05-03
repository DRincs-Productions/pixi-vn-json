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

/**
 * An operation string that holds a list of string/value fragments to be concatenated at runtime.
 * Used internally to represent string interpolation expressions before they are fully resolved.
 */
export type PixiVNJsonOperationString = {
    type: "operationtoconvert";
    /**
     * The ordered list of string fragments and/or value-get expressions to concatenate.
     */
    values: (
        | string
        | PixiVNJsonValueGet
        | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet>
    )[];
};

/**
 * A single resolved operation — a value set, canvas operation, sound operation,
 * narration operation, or function call — optionally annotated with an origin string.
 */
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

/**
 * A conditional operation — either a plain operation, an if-else that resolves to one,
 * or an operation-string (string interpolation expression).
 */
type PixiVNJsonConditionalOperation =
    | PixiVNJsonOperation
    | PixiVNJsonIfElse<PixiVNJsonOperation>
    | PixiVNJsonOperationString;

export default PixiVNJsonConditionalOperation;
