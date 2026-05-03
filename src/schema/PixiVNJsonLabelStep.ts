import type PixiVNJsonConditionalStatements from "@/schema/PixiVNJsonConditionalStatements";
import type PixiVNJsonConditionalOperation from "@/schema/PixiVNJsonOperations";
import type { PixiVNJsonValueGet } from "@/schema/PixiVNJsonValue";
import type {
    LabelRunModeType,
    narration,
    StepLabelPropsType,
    StorageObjectType,
} from "@drincs/pixi-vn";

/**
 * A player-presentable choice in a menu.
 */
export type PixiVNJsonChoice = {
    /**
     * The text to be displayed.
     */
    text: PixiVNJsonDialogText;
    /**
     * The label id to be opened.
     */
    label: string;
    /**
     * Label opening mode
     */
    type: LabelRunModeType;
    /**
     * The properties to be passed to the label.
     */
    props: StorageObjectType;
    /**
     * If this is true, the choice can only be made once.
     */
    oneTime?: boolean;
    /**
     * If this is true, the choice can see only if there are no other choices. For example, all choices are one-time choices and they are already selected.
     */
    onlyHaveNoChoice?: boolean;
    /**
     * If this is true and if is the only choice, it will be automatically selected, and call/jump to the label.
     */
    autoSelect?: boolean;
};
/**
 * A list of choices (possibly conditional) that are shown to the player as a menu.
 */
export type PixiVNJsonChoices = (
    | PixiVNJsonChoice
    | PixiVNJsonConditionalStatements<PixiVNJsonChoice>
)[];

/**
 * The text content of a dialogue line.
 * Can be a plain string, a dynamic value-get, a conditional expression, or an array of any of these
 * (which will be concatenated into a single string at runtime).
 */
export type PixiVNJsonDialogText =
    | string
    | PixiVNJsonValueGet
    | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet | string[]>
    | (
          | string
          | PixiVNJsonValueGet
          | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet | string[]>
      )[];

/**
 * A dialogue line, optionally attributed to a character.
 * When a plain `Text` value is used, no character attribution is included.
 */
export type PixiVNJsonDialog<Text = string> =
    | {
          /**
           * The character id that will speak.
           */
          character: string;
          /**
           * The text to be displayed.
           */
          text: Text;
      }
    | Text;

/**
 * Describes a label that should be opened (called or jumped to) during a step.
 */
export type PixiVNJsonLabelToOpen<T extends {} = object> = {
    /**
     * The id of the label to open.
     */
    label: string | PixiVNJsonValueGet;
    /**
     * Label opening mode
     */
    type: LabelRunModeType;
    /**
     * The properties to be passed to the label. if you don't want to pass a object, but a list of parameters, you can use the {@link PixiVNJsonLabelToOpen.params} attribute.
     */
    props?: StepLabelPropsType<T>;
    /**
     * **It is not recommended to use it, use it only if necessary**. The parameters to be passed to the label. If you want to pass an object, use the {@link PixiVNJsonLabelToOpen.props} attribute.
     * "params" attribute will be stored in the temp storage with the key: {@link PIXIVNJSON_PARAM_ID} + ({@link narration.openedLabels.length} - 1).
     */
    params?: unknown[];
};

/**
 * Steps of a label.
 * Order of operations:
 * 1. run all {@link PixiVNJsonLabelStep.operations}
 * 2. set {@link PixiVNJsonLabelStep.choices}, {@link PixiVNJsonLabelStep.dialogue}, {@link PixiVNJsonLabelStep.glueEnabled}
 * 3. open {@link PixiVNJsonLabelStep.labelToOpen}
 * 4. go to next step if {@link PixiVNJsonLabelStep.goNextStep} is true
 * 5. end the label if {@link PixiVNJsonLabelStep.end} is "label_end"
 */
type PixiVNJsonLabelStep = {
    /**
     * Operations to execute at the start of this step (storage writes, canvas updates, sound, etc.).
     */
    operations?: PixiVNJsonConditionalOperation[];
    /**
     * Variable used to display a choice menu.
     */
    choices?: PixiVNJsonChoices | PixiVNJsonConditionalStatements<PixiVNJsonChoices>;
    /**
     * Variable used to display a dialog.
     */
    dialogue?:
        | PixiVNJsonDialog<PixiVNJsonDialogText>
        | PixiVNJsonConditionalStatements<PixiVNJsonDialog<PixiVNJsonDialogText>>;
    /**
     * This variable is used to add the next dialog text into the current dialog memory.
     * This value was added to introduce Ink Glue functionality https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#glue
     */
    glueEnabled?: boolean | PixiVNJsonConditionalStatements<boolean>;
    /**
     * Variable used to open a label.
     */
    labelToOpen?:
        | PixiVNJsonLabelToOpen
        | PixiVNJsonConditionalStatements<PixiVNJsonLabelToOpen>
        | (PixiVNJsonLabelToOpen | PixiVNJsonConditionalStatements<PixiVNJsonLabelToOpen>)[];
    /**
     * If is true, the next step will be executed automatically.
     */
    goNextStep?: boolean | PixiVNJsonConditionalStatements<boolean>;
    /**
     * Variable used to end some elements of the narrative.
     * - game_end: ends the game
     * - label_end: ends the label
     */
    end?: "game_end" | "label_end" | PixiVNJsonConditionalStatements<"game_end" | "label_end">;
    /**
     * If set, this step is replaced by the result of evaluating the given conditional statement.
     * Allows an entire step to be chosen at runtime based on a condition or step-switch strategy.
     */
    conditionalStep?: PixiVNJsonConditionalStatements<PixiVNJsonLabelStep | PixiVNJsonLabelStep[]>;
};

export default PixiVNJsonLabelStep;
