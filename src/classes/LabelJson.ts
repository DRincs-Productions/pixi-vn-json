import {
    ChoiceMenuOption,
    LabelAbstract,
    LabelProps,
    narration,
    StepLabelPropsType,
    StepLabelType,
    storage,
    SYSTEM_RESERVED_STORAGE_KEYS,
} from "@drincs/pixi-vn";
import sha1 from "crypto-js/sha1";
import { PIXIVNJSON_PARAM_ID } from "../constants";
import { loadAssets } from "../functions/assets";
import { runOperation } from "../functions/operation-utility";
import { getConditionalStep, getLogichValue } from "../functions/utility";
import { PixiVNJsonLabelStep, PixiVNJsonOperation } from "../interface";
import PixiVNJsonConditionalStatements from "../interface/PixiVNJsonConditionalStatements";
import {
    PixiVNJsonChoice,
    PixiVNJsonChoices,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonLabelToOpen,
} from "../interface/PixiVNJsonLabelStep";
import TranslatorManager from "../managers/TranslateManager";

export type LabelJsonOptions = {
    /**
     * Function that converts a string to a {@link PixiVNJsonOperation}.
     * If is a special operation you can return undefined and can run the operation.
     */
    operationStringConvert?: (
        value: string,
        step: PixiVNJsonLabelStep,
        props: StepLabelPropsType | {}
    ) => Promise<PixiVNJsonOperation | undefined>;
    /**
     * If true and a dialog is empty or has only spaces, {@link PixiVNJsonLabelStep.goNextStep} will be set to true.
     */
    skipEmptyDialogs?: boolean;
};

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
        options: LabelJsonOptions = {}
    ) {
        if (!props) {
            props = {};
        }
        props.onLoadingLabel = async () => {
            for (let stepProp of steps) {
                let step: PixiVNJsonLabelStep;
                if (typeof stepProp === "function") {
                    step = stepProp();
                } else {
                    step = stepProp;
                }

                step = getConditionalStep(step);

                if (step.operations) {
                    let promises = step.operations.map((operation) => loadAssets(operation));
                    await Promise.all(promises);
                }
            }
        };
        super(id, props);
        this._steps = steps;
        this.operationStringConvert = options.operationStringConvert;
        this.skipEmptyDialogs = options.skipEmptyDialogs || false;
    }

    private _steps: (PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep))[];
    get steps(): StepLabelType<T>[] {
        return this._steps.map((step) => {
            return this.stepConverter(step);
        });
    }
    get stepCount(): number {
        return this._steps.length;
    }
    getStepById(stepId: number): StepLabelType<T> | undefined {
        if (stepId < 0 || stepId >= this._steps.length) {
            return undefined;
        }
        let step = this._steps[stepId];
        return this.stepConverter(step);
    }

    private operationStringConvert?: (
        value: string,
        step: PixiVNJsonLabelStep,
        props: StepLabelPropsType
    ) => Promise<PixiVNJsonOperation | undefined>;
    private skipEmptyDialogs: boolean = false;

    public getStepSha(index: number): string | undefined {
        if (index < 0 || index >= this.steps.length) {
            return undefined;
        }
        let step = this._steps[index];
        let sha1String = sha1(step.toString().toLocaleLowerCase());
        return sha1String.toString();
    }

    private getDialogueText(origin: PixiVNJsonDialogText): string | string[] {
        let text: string | string[] = "";
        if (Array.isArray(origin)) {
            let texts: string[] = [];
            origin.forEach((t) => {
                if (typeof t === "string") {
                    texts.push(t);
                } else if (t && typeof t === "object") {
                    let res = getLogichValue<string | any[]>(t);
                    if (res) {
                        if (res && !Array.isArray(res) && typeof res === "object") {
                            res = getLogichValue<string | string[]>(res) || "";
                        }
                        if (Array.isArray(res)) {
                            texts = texts.concat(res);
                        } else {
                            texts.push(`${res}`);
                        }
                    } else {
                        texts.push(`${t}`);
                    }
                }
            });
            text = texts;
        } else {
            let res = getLogichValue<string | any[]>(origin) || "";
            if (res && !Array.isArray(res) && typeof res === "object") {
                res = getLogichValue<string | string[]>(res) || "";
            }
            text = res;
        }
        return `${text}`;
    }
    private getDialogue(
        origin:
            | PixiVNJsonDialog<PixiVNJsonDialogText>
            | PixiVNJsonConditionalStatements<PixiVNJsonDialog<PixiVNJsonDialogText>>
            | undefined
    ): PixiVNJsonDialog<string | string[]> | undefined {
        if (origin === undefined || origin === null) {
            return undefined;
        }
        let dialogue = getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(origin);
        if (dialogue === undefined || dialogue === null) {
            return "";
        }
        if (typeof dialogue === "object" && "character" in dialogue && "text" in dialogue) {
            return {
                character: dialogue.character,
                text: TranslatorManager.t(this.getDialogueText(dialogue.text)),
            };
        } else {
            return TranslatorManager.t(this.getDialogueText(dialogue));
        }
    }

    private getChoices(
        origin: PixiVNJsonChoices | PixiVNJsonConditionalStatements<PixiVNJsonChoices> | undefined
    ): PixiVNJsonChoice[] | undefined {
        const choices = getLogichValue<PixiVNJsonChoices>(origin);
        const options = choices
            ?.map((option) => {
                return getLogichValue<PixiVNJsonChoice>(option);
            })
            .filter((option) => option !== undefined);
        return options;
    }

    private stepConverter(stepProp: PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep)): StepLabelType<T> {
        return async (props) => {
            let step: PixiVNJsonLabelStep;
            if (typeof stepProp === "function") {
                step = stepProp();
            } else {
                step = stepProp;
            }

            step = getConditionalStep(step);

            if (step.operations) {
                for (let operation of step.operations) {
                    await runOperation(
                        operation,
                        this.operationStringConvert
                            ? (value) => this.operationStringConvert!(value, step, props)
                            : undefined
                    );
                }
            }

            let choices = this.getChoices(step.choices);
            let glueEnabled = getLogichValue<boolean>(step.glueEnabled);
            let dialogue: PixiVNJsonDialog<string | string[]> | undefined = this.getDialogue(step.dialogue);
            let labelToOpen: PixiVNJsonLabelToOpen[] = [];
            if (step.labelToOpen) {
                if (!Array.isArray(step.labelToOpen)) {
                    step.labelToOpen = [step.labelToOpen];
                }
                step.labelToOpen.forEach((label) => {
                    let i = getLogichValue<PixiVNJsonLabelToOpen<{}>>(label);
                    if (i) {
                        labelToOpen.push(i);
                    }
                });
            }
            let goNextStep = getLogichValue<boolean>(step.goNextStep);
            let end = getLogichValue<"game_end" | "label_end">(step.end);

            if (choices) {
                let options = choices.map((option) => {
                    let text: string | string[] = "";
                    if (Array.isArray(option.text)) {
                        let texts: string[] = [];
                        option.text.forEach((t) => {
                            if (typeof t === "string") {
                                texts.push(TranslatorManager.t(t));
                            } else if (t && typeof t === "object") {
                                let res = getLogichValue<string | any[]>(t);
                                if (res && !Array.isArray(res) && typeof res === "object") {
                                    res = getLogichValue<string | string[]>(res) || "";
                                }
                                if (res) {
                                    if (Array.isArray(res)) {
                                        texts = texts.concat(TranslatorManager.t(res));
                                    } else {
                                        texts.push(TranslatorManager.t(res));
                                    }
                                }
                            }
                        });
                        text = texts;
                    } else if (typeof option.text === "string") {
                        text = TranslatorManager.t(option.text);
                    }
                    return new ChoiceMenuOption(text, option.label, option.props, {
                        type: option.type,
                        oneTime: option.oneTime,
                        onlyHaveNoChoice: option.onlyHaveNoChoice,
                        autoSelect: option.autoSelect,
                    });
                });
                narration.choiceMenuOptions = options;
            } else {
                narration.choiceMenuOptions = undefined;
            }

            if (dialogue !== undefined) {
                narration.dialogue = dialogue;
                if (
                    this.skipEmptyDialogs &&
                    typeof dialogue === "string" &&
                    (dialogue === "" || RegExp(/^\s+$/).test(dialogue))
                ) {
                    goNextStep = true;
                }
            }
            if (glueEnabled) {
                storage.setFlag(
                    SYSTEM_RESERVED_STORAGE_KEYS.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY,
                    true
                );
            } else if (glueEnabled === false) {
                storage.setFlag(
                    SYSTEM_RESERVED_STORAGE_KEYS.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY,
                    false
                );
            }

            for (let label of labelToOpen) {
                let labelString = label.label;
                if (typeof labelString === "object") {
                    labelString = getLogichValue<string>(labelString) || "";
                }
                let labelParams = label.params?.map((param) => {
                    return getLogichValue(param);
                });
                props = {
                    ...props,
                    ...label.props,
                };
                if (label.type === "jump") {
                    narration.closeCurrentLabel();
                    storage.setTempVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length}`, labelParams);
                    await narration.callLabel(labelString, props);
                } else {
                    storage.setTempVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length}`, labelParams);
                    await narration.callLabel(labelString, props);
                }
            }

            if (end === "game_end") {
                narration.closeAllLabels();
                await narration.goNext(props, { runNow: true });
            } else if (end === "label_end") {
                narration.closeCurrentLabel();
            }

            if (goNextStep) {
                await narration.goNext(props, { runNow: true });
            }
        };
    }
}
