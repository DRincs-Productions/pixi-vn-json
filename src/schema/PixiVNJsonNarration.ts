/**
 * Requests user input during the narrative.
 * When this operation is encountered, the engine pauses and waits for the player to provide a value.
 */
type PixiVNJsonInputRequest = {
    type: "input";
    operationType: "request";
    /**
     * The expected value type for the input (e.g. `"string"`, `"number"`, `"boolean"`).
     * Used by the engine to validate or cast the player's answer.
     */
    valueType?: string;
    /**
     * A default value that will be used if the player does not provide any input.
     */
    defaultValue?: any;
};

/**
 * Clears (resets) the current dialogue state.
 * This is typically used to wipe any displayed text before showing new content.
 */
type PixiVNJsonDialogue = {
    type: "dialogue";
    operationType: "clean";
};

/**
 * Narration operation — either a dialogue clear or a user-input request.
 */
type PixiVNJsonNarration = PixiVNJsonDialogue | PixiVNJsonInputRequest;
export default PixiVNJsonNarration;
