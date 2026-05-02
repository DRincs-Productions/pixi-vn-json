import type PixiVNJsonIfElse from "@/schema/PixiVNJsonIfElse";
import type PixiVNJsonLabels from "@/schema/PixiVNJsonLabels";
import type { PixiVNJsonValueSet } from "@/schema/PixiVNJsonValue";

/**
 * PixiVNJson It can be defined as a programming language to write a narrative written in json.
 */
export default interface PixiVNJson {
    /**
     * The URI of the JSON Schema that describes and validates this document.
     *
     * You can point to a specific version of the schema, for example:
     * - `"https://pixi-vn.web.app/schemas/1.13.0/schema.json"` — pin to a specific version
     * - `"https://pixi-vn.web.app/schemas/latest/schema.json"` — always use the latest version
     *
     * Most editors (VS Code, WebStorm, etc.) use this field to provide
     * auto-completion, hover documentation, and validation for the document.
     */
    $schema?: string;
    /**
     * The operations to be executed before the narrative starts.
     * For the set storage: They will be set only if there are no variables with the same key already.
     * For the det tempstorage: if there are variables with the same key already, they will be overwritten.
     */
    initialOperations?: (PixiVNJsonValueSet | PixiVNJsonIfElse<PixiVNJsonValueSet>)[];
    /**
     * The labels to be used in the narrative. They will be added to the system
     */
    labels?: PixiVNJsonLabels;
}
