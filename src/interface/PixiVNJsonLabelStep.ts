import { LabelRunModeType, narration, StepLabelPropsType, StorageObjectType } from "@drincs/pixi-vn"
import { PIXIVNJSON_PARAM_ID } from "../constants"
import PixiVNJsonConditionalStatements from "./PixiVNJsonConditionalStatements"
import { PixiVNJsonLabel } from "./PixiVNJsonLabels"
import PixiVNJsonOperations from "./PixiVNJsonOperations"
import { PixiVNJsonValueGet } from "./PixiVNJsonValue"

export type PixiVNJsonChoice = {
    /**
     * The text to be displayed.
     */
    text: PixiVNJsonDialogText
    /**
     * The label id to be opened.
     */
    label: string
    /**
     * Label opening mode
     */
    type: LabelRunModeType
    /**
     * The properties to be passed to the label.
     */
    props: StorageObjectType
    /**
     * If this is true, the choice can only be made once.
     */
    oneTime?: boolean
    /**
     * If this is true, the choice can see only if there are no other choices. For example, all choices are one-time choices and they are already selected.
     */
    onlyHaveNoChoice?: boolean
    /**
     * If this is true and if is the only choice, it will be automatically selected, and call/jump to the label.
     */
    autoSelect?: boolean
}
export type PixiVNJsonChoices = (PixiVNJsonChoice | PixiVNJsonConditionalStatements<PixiVNJsonChoice>)[]

export type PixiVNJsonDialogText = string | PixiVNJsonValueGet | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet | string[]> | (string | PixiVNJsonValueGet | PixiVNJsonConditionalStatements<string | PixiVNJsonValueGet | string[]>)[]

export type PixiVNJsonDialog<Text = string> = {
    /**
     * The character id that will speak.
     */
    character: string,
    /** 
     * The text to be displayed.
     */
    text: Text,
} | Text

export type PixiVNJsonLabelToOpen<T extends {} = {}> = {
    /**
     * The id of the label to open.
     */
    label: string | PixiVNJsonValueGet,
    /**
     * Label opening mode
     */
    type: LabelRunModeType,
    /**
     * The properties to be passed to the label. if you don't want to pass a object, but a list of parameters, you can use the {@link PixiVNJsonLabelToOpen.params} attribute.
     */
    props?: StepLabelPropsType<T>,
    /**
     * **It is not recommended to use it, use it only if necessary**. The parameters to be passed to the label. If you want to pass an object, use the {@link PixiVNJsonLabelToOpen.props} attribute.
     * "params" attribute will be stored in the temp storage with the key: {@link PIXIVNJSON_PARAM_ID} + ({@link narration.openedLabels.length} - 1).
     */
    params?: any[]
}

/**
 * Steps of a {@link PixiVNJsonLabel}.
 * Order of operations:
 * 1. run all {@link PixiVNJsonLabelStep.operation}
 * 2. set {@link PixiVNJsonLabelStep.choices}, {@link PixiVNJsonLabelStep.dialogue}, {@link PixiVNJsonLabelStep.glueEnabled}
 * 3. open {@link PixiVNJsonLabelStep.labelToOpen}
 * 4. go to next step if {@link PixiVNJsonLabelStep.goNextStep} is true
 * 5. end the label if {@link PixiVNJsonLabelStep.end} is "label_end"
 */
type PixiVNJsonLabelStep = {
    operation?: PixiVNJsonOperations
    /**
     * Variable used to display a choice menu.
     */
    choices?: PixiVNJsonChoices | PixiVNJsonConditionalStatements<PixiVNJsonChoices>
    /**
     * Variable used to display a dialog.
     */
    dialogue?: PixiVNJsonDialog<PixiVNJsonDialogText> | PixiVNJsonConditionalStatements<PixiVNJsonDialog<PixiVNJsonDialogText>>
    /**
     * This variable is used to add the next dialog text into the current dialog memory.
     * This value was added to introduce Ink Glue functionality https://github.com/inkle/ink/blob/master/Documentation/WritingWithInk.md#glue
     */
    glueEnabled?: boolean | PixiVNJsonConditionalStatements<boolean>
    /**
     * Variable used to open a label.
     */
    labelToOpen?: PixiVNJsonLabelToOpen | PixiVNJsonConditionalStatements<PixiVNJsonLabelToOpen> | (PixiVNJsonLabelToOpen | PixiVNJsonConditionalStatements<PixiVNJsonLabelToOpen>)[]
    /**
     * If is true, the next step will be executed automatically.
     */
    goNextStep?: boolean | PixiVNJsonConditionalStatements<boolean>
    /**
     * Variable used to end some elements of the narrative.
     * - game_end: ends the game
     * - label_end: ends the label
     */
    end?: "game_end" | "label_end" | PixiVNJsonConditionalStatements<"game_end" | "label_end">
    conditionalStep?: PixiVNJsonConditionalStatements<PixiVNJsonLabelStep | PixiVNJsonLabelStep[]>
}

export default PixiVNJsonLabelStep
