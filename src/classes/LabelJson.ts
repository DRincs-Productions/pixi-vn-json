import { ChoiceMenuOption, getFlag, LabelAbstract, LabelProps, narration, setFlag, StepLabelType, storage } from "@drincs/pixi-vn"
import sha1 from 'crypto-js/sha1'
import { PIXIVNJSON_PARAM_ID } from '../constants'
import { runOperation } from "../functions/operationUtility"
import { geLogichValue } from "../functions/utility"
import { PixiVNJsonLabelStep, PixiVNJsonOperation } from "../interface"
import PixiVNJsonConditionalStatements from '../interface/PixiVNJsonConditionalStatements'
import { PixiVNJsonChoice, PixiVNJsonChoices, PixiVNJsonDialog, PixiVNJsonDialogText, PixiVNJsonLabelToOpen } from "../interface/PixiVNJsonLabelStep"

export default class LabelJson<T extends {} = {}> extends LabelAbstract<LabelJson<T>, T> {
    /**
     * @param id is the id of the label
     * @param steps is the list of steps that the label will perform
     * @param props is the properties of the label
     */
    constructor(
        id: string,
        steps: (PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep))[],
        props?: LabelProps<LabelJson<T>>,
        operationStringConvert?: (value: string) => PixiVNJsonOperation | undefined,
    ) {
        super(id, props)
        this._steps = steps
        this.operationStringConvert = operationStringConvert
    }

    private _steps: (PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep))[]
    /**
     * Get the steps of the label.
     */
    public get steps(): StepLabelType<T>[] {
        return this._steps.map((step) => {
            return this.stepConverter(step)
        })
    }

    private operationStringConvert?: (value: string) => PixiVNJsonOperation | undefined

    public getStepSha1(index: number): string | undefined {
        if (index < 0 || index >= this.steps.length) {
            return undefined
        }
        let step = this._steps[index]
        let sha1String = sha1(step.toString().toLocaleLowerCase())
        return sha1String.toString()
    }

    private getDialogueText(origin: PixiVNJsonDialogText, params: any[]): string | string[] {
        let text: string | string[] = ""
        if (Array.isArray(origin)) {
            let texts: string[] = []
            origin.forEach((t) => {
                if (typeof t === "string") {
                    texts.push(t)
                }
                else if (t && typeof t === "object") {
                    let res = geLogichValue<string | any[]>(t, params)
                    if (res) {
                        if (res && !Array.isArray(res) && typeof res === "object") {
                            res = geLogichValue<string | string[]>(res, params) || ""
                        }
                        if (Array.isArray(res)) {
                            texts = texts.concat(res)
                        }
                        else {
                            texts.push(res)
                        }
                    }
                }
            })
            text = texts
        }
        else {
            let res = geLogichValue<string | any[]>(origin, params) || ""
            if (res && !Array.isArray(res) && typeof res === "object") {
                res = geLogichValue<string | string[]>(res, params) || ""
            }
            text = res
        }
        return text
    }
    private getDialogue(origin: PixiVNJsonDialog<PixiVNJsonDialogText> | PixiVNJsonConditionalStatements<PixiVNJsonDialog<PixiVNJsonDialogText>> | undefined, params: any[]): PixiVNJsonDialog<string | string[]> | undefined {
        let d = geLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(origin, params)
        let dialogue: PixiVNJsonDialog<string | string[]> | undefined = undefined
        if (d) {
            if (typeof d === "object" && "character" in d && "text" in d) {
                dialogue = {
                    character: d.character,
                    text: this.getDialogueText(d.text, params)
                }
            }
            else {
                dialogue = this.getDialogueText(d, params)
            }
        }
        return dialogue
    }

    private getChoices(origin: PixiVNJsonChoices | PixiVNJsonConditionalStatements<PixiVNJsonChoices> | undefined, params: any[]): PixiVNJsonChoice[] | undefined {
        const choices = geLogichValue<PixiVNJsonChoices>(origin, params)
        const options = choices?.map((option) => {
            return geLogichValue<PixiVNJsonChoice>(option, params)
        }).filter((option) => option !== undefined)
        return options
    }

    private getConditionalStep(step: PixiVNJsonLabelStep, params: any[]): PixiVNJsonLabelStep {
        if (step.conditionalStep) {
            let conditionalStep = geLogichValue<PixiVNJsonLabelStep>(step.conditionalStep as any, params)
            if (conditionalStep) {
                let obj = {
                    ...step,
                    conditionalStep: undefined,
                    ...conditionalStep,
                }
                return this.getConditionalStep(obj, params)
            }
            else if (getFlag(storage.keysSystem.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY)) {
                setFlag(storage.keysSystem.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY, false)
            }
        }
        return step
    }

    private stepConverter(step: PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep)): StepLabelType<T> {
        return async (props) => {
            let params: any[] = props[PIXIVNJSON_PARAM_ID]
            if (typeof step === "function") {
                step = step()
            }

            step = this.getConditionalStep(step, params)

            if (step.operation) {
                for (let operation of step.operation) {
                    await runOperation(operation, params, this.operationStringConvert)
                }
            }

            let choices = this.getChoices(step.choices, params)
            let glueEnabled = geLogichValue<boolean>(step.glueEnabled, params)
            let dialogue: PixiVNJsonDialog<string | string[]> | undefined = this.getDialogue(step.dialogue, params)
            let labelToOpen: PixiVNJsonLabelToOpen[] = []
            if (step.labelToOpen) {
                if (!Array.isArray(step.labelToOpen)) {
                    step.labelToOpen = [step.labelToOpen]
                }
                step.labelToOpen.forEach((label) => {
                    let i = geLogichValue<PixiVNJsonLabelToOpen<{}>>(label, params)
                    if (i) {
                        labelToOpen.push(i)
                    }
                })
            }
            let goNextStep = geLogichValue<boolean>(step.goNextStep, params)
            let end = geLogichValue<"game_end" | "label_end">(step.end, params)

            if (choices) {
                let options = choices.map((option) => {
                    let text: string = ""
                    if (Array.isArray(option.text)) {
                        let texts: string[] = []
                        option.text.forEach((t) => {
                            if (typeof t === "string") {
                                texts.push(t)
                            }
                            else if (t && typeof t === "object") {
                                let res = geLogichValue<string | any[]>(t, params)
                                if (res && !Array.isArray(res) && typeof res === "object") {
                                    res = geLogichValue<string | string[]>(res, params) || ""
                                }
                                if (res) {
                                    if (Array.isArray(res)) {
                                        texts = texts.concat(res)
                                    }
                                    else {
                                        texts.push(res)
                                    }
                                }
                            }
                        })
                        text = texts.join()
                    }
                    else if (typeof option.text === "string") {
                        text = option.text
                    }
                    return new ChoiceMenuOption(text, option.label, option.props, {
                        type: option.type,
                        oneTime: option.oneTime,
                        onlyHaveNoChoice: option.onlyHaveNoChoice,
                        autoSelect: option.autoSelect,
                    })
                })
                narration.choiceMenuOptions = options
            }
            else {
                narration.choiceMenuOptions = undefined
            }

            if (dialogue !== undefined) {
                narration.dialogue = (dialogue)
            }
            if (glueEnabled) {
                setFlag(storage.keysSystem.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY, true)
            }
            else if (glueEnabled === false) {
                setFlag(storage.keysSystem.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY, false)
            }

            labelToOpen.forEach((label) => {
                let labelString = label.label
                if (typeof labelString === "object") {
                    labelString = geLogichValue<string>(labelString, params) || ""
                }
                let labelParams = label.params?.map((param) => {
                    return geLogichValue(param, params)
                })
                props = {
                    ...props,
                    ...label.props,
                    [PIXIVNJSON_PARAM_ID]: labelParams
                }
                if (label.type === "jump") {
                    narration.jumpLabel(labelString, props)
                }
                else {
                    narration.callLabel(labelString, props)
                }
            })

            if (end === "game_end") {
                narration.closeAllLabels()
                await narration.goNext(props)
            }
            else if (end === "label_end") {
                narration.closeCurrentLabel()
            }

            if (goNextStep) {
                await narration.goNext(props)
            }
        }
    }
}
