import { translator } from "@drincs/pixi-vn-json/translator";
import { JsonUnifier } from "@drincs/pixi-vn-json/unifier";
import {
    LabelAbstract,
    LabelProps,
    narration,
    StepLabelPropsType,
    StepLabelType,
    StoredChoiceInterface,
} from "@drincs/pixi-vn/narration";
import { storage, SYSTEM_RESERVED_STORAGE_KEYS } from "@drincs/pixi-vn/storage";
import sha1 from "crypto-js/sha1";
import { PIXIVNJSON_PARAM_ID } from "../constants";
import { PixiVNJsonLabelStep, PixiVNJsonOperation } from "../interface";
import PixiVNJsonConditionalStatements from "../interface/PixiVNJsonConditionalStatements";
import {
    PixiVNJsonChoice,
    PixiVNJsonChoices,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonLabelToOpen,
} from "../interface/PixiVNJsonLabelStep";
import { createExportableElement } from "../utils/createExportableElement";
import { runOperation } from "./operation-utility";

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

                step = JsonUnifier.getConditionalStep(step);

                if (step.operations) {
                    let promises = step.operations.map((operation) => JsonUnifier.loadAssets(operation));
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
                    let res = JsonUnifier.getLogichValue<string | any[]>(t);
                    if (res) {
                        if (res && !Array.isArray(res) && typeof res === "object") {
                            res = JsonUnifier.getLogichValue<string | string[]>(res) || "";
                        }
                        if (Array.isArray(res)) {
                            texts = texts.map((v) => `${v}`).concat(res);
                        } else {
                            texts.push(`${res}`);
                        }
                    } else {
                        texts.push(`${t}`);
                    }
                } else {
                    texts.push(`${t}`);
                }
            });
            text = texts;
        } else {
            let res = JsonUnifier.getLogichValue<string | any[]>(origin) || "";
            if (res && !Array.isArray(res) && typeof res === "object") {
                res = JsonUnifier.getLogichValue<string | string[]>(res) || "";
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
        let dialogue = JsonUnifier.getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(origin);
        if (dialogue === undefined || dialogue === null) {
            return `${dialogue}`;
        }
        if (typeof dialogue === "object" && "character" in dialogue && "text" in dialogue) {
            return {
                character: dialogue.character,
                text: translator.t(this.getDialogueText(dialogue.text)),
            };
        } else {
            return translator.t(this.getDialogueText(`${dialogue}`));
        }
    }

    private getChoices(
        origin: PixiVNJsonChoices | PixiVNJsonConditionalStatements<PixiVNJsonChoices> | undefined
    ): PixiVNJsonChoice[] | undefined {
        const choices = JsonUnifier.getLogichValue<PixiVNJsonChoices>(origin);
        const options = choices
            ?.map((option) => {
                return JsonUnifier.getLogichValue<PixiVNJsonChoice>(option);
            })
            .filter((option) => option !== undefined);
        return options;
    }

    private stepConverter(stepProp: PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep)): StepLabelType<T> {
        return async (props) => {
            let step: PixiVNJsonLabelStep = typeof stepProp === "function" ? stepProp() : stepProp;
            step = createExportableElement(step);
            step = JsonUnifier.getConditionalStep(step);
            const operationStringConvert = this.operationStringConvert
                ? (value: string) => this.operationStringConvert!(value, step, props)
                : undefined;
            const { operations = [] } = step;
            for (let operation of operations) {
                await runOperation(operation, operationStringConvert);
            }

            let { labelToOpen: tempLabelToOpen = [] } = step;
            const choices = this.getChoices(step.choices);
            const glueEnabled = JsonUnifier.getLogichValue<boolean>(step.glueEnabled);
            const dialogue = this.getDialogue(step.dialogue);

            let labelToOpen: PixiVNJsonLabelToOpen[] = [];
            if (!Array.isArray(tempLabelToOpen)) {
                tempLabelToOpen = [tempLabelToOpen];
            }
            tempLabelToOpen.forEach((label) => {
                let i = JsonUnifier.getLogichValue<PixiVNJsonLabelToOpen<{}>>(label);
                if (i) {
                    labelToOpen.push(i);
                }
            });

            let goNextStep = JsonUnifier.getLogichValue<boolean>(step.goNextStep);
            let end = JsonUnifier.getLogichValue<"game_end" | "label_end">(step.end);

            if (choices) {
                let options: StoredChoiceInterface[] = choices.map((option) => {
                    let text: string | string[] = "";
                    if (Array.isArray(option.text)) {
                        let texts: string[] = [];
                        option.text.forEach((t) => {
                            if (typeof t === "string") {
                                texts.push(translator.t(t));
                            } else if (t && typeof t === "object") {
                                let res = JsonUnifier.getLogichValue<string | any[]>(t);
                                if (res && !Array.isArray(res) && typeof res === "object") {
                                    res = JsonUnifier.getLogichValue<string | string[]>(res) || "";
                                }
                                if (res) {
                                    if (Array.isArray(res)) {
                                        texts = texts.concat(translator.t(res));
                                    } else {
                                        texts.push(translator.t(res));
                                    }
                                }
                            }
                        });
                        text = texts;
                    } else if (typeof option.text === "string") {
                        text = translator.t(option.text);
                    }
                    const res: StoredChoiceInterface = {
                        label: option.label,
                        text: text,
                        props: option.props,
                        type: option.type,
                        oneTime: option.oneTime,
                        onlyHaveNoChoice: option.onlyHaveNoChoice,
                        autoSelect: option.autoSelect,
                    };
                    return res;
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
                    labelString = JsonUnifier.getLogichValue<string>(labelString) || "";
                }
                let labelParams = label.params?.map((param) => {
                    return JsonUnifier.getLogichValue(param);
                });
                props = {
                    ...props,
                    ...label.props,
                };
                if (label.type === "jump") {
                    if (narration.openedLabels.length > 0) narration.closeCurrentLabel();
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
