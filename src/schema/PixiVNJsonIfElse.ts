import type PixiVNJsonConditions from "@/schema/PixiVNJsonConditions";
import type { PixiVNJsonValueGet } from "@/schema/PixiVNJsonValue";
import type { StorageElementType } from "@drincs/pixi-vn";

/**
 * If-Else condition for PixiVNJson
 */
interface PixiVNJsonIfElse<Then> {
    type: "ifelse";
    /**
     * The list of conditions to be checked.
     *
     * if is a {@link StorageElementType} or a {@link PixiVNJsonValueGet}:
     * - if is a array or object, the condition is true if not empty
     * - if is a string, the condition is true if not empty
     * - if is a number, the condition is true if not zero
     * - if is a boolean, the condition is true if true
     * - if is null or undefined, the condition is false
     */
    condition: PixiVNJsonConditions;
    /**
     * The value to be returned if the condition is true.
     */
    then: Then | PixiVNJsonIfElse<Then>;
    /**
     * The value to be returned if the condition is false.
     */
    else?: Then | PixiVNJsonIfElse<Then>;
}

export default PixiVNJsonIfElse;
