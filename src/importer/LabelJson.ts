import { createExportableElement } from "@drincs/pixi-vn";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import { translator } from "@drincs/pixi-vn-json/translator";
import {
    LabelAbstract,
    type LabelProps,
    narration,
    type StepLabelPropsType,
    type StepLabelType,
    type StoredChoiceInterface,
} from "@drincs/pixi-vn/narration";
import { storage, type StorageElementType } from "@drincs/pixi-vn/storage";
import sha1 from "crypto-js/sha1";
import { PIXIVNJSON_PARAM_ID } from "../constants";
import type { PixiVNJsonLabelStep, PixiVNJsonOperation } from "../interface";
import type PixiVNJsonConditionalStatements from "../interface/PixiVNJsonConditionalStatements";
import type {
    PixiVNJsonChoice,
    PixiVNJsonChoices,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonLabelToOpen,
} from "../interface/PixiVNJsonLabelStep";
import { logger } from "../utils/log-utility";
import { runOperation } from "./operation-utility";

export type LabelJsonOptions = {
    /**
     * Function that converts a string to a {@link PixiVNJsonOperation}.
     * If is a special operation you can return undefined and can run the operation.
     */
    operationStringConvert?: (
        value: string,
        step: PixiVNJsonLabelStep,
        props: StepLabelPropsType | object,
    ) => Promise<PixiVNJsonOperation | undefined>;
    /**
     * If true and a dialog is empty or has only spaces, {@link PixiVNJsonLabelStep.goNextStep} will be set to true.
     */
    skipEmptyDialogs?: boolean;
};

export default class LabelJson<T extends {} = object> extends LabelAbstract<LabelJson<T>, T> {
    /**
     * @param id is the id of the label
     * @param steps is the list of steps that the label will perform
     * @param props is the properties of the label
     */
    constructor(
        id: string,
        steps: (PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep))[],
        props?: LabelProps<LabelJson<T>>,
        options: LabelJsonOptions = {},
    ) {
        if (!props) {
            props = {};
        }
        props.onLoadingLabel = async () => {
            for (const stepProp of steps) {
                let step: PixiVNJsonLabelStep;
                if (typeof stepProp === "function") {
                    step = stepProp();
                } else {
                    step = stepProp;
                }

                step = JsonUnifier.getConditionalStep(step);

                if (step.operations) {
                    try {
                        const promises = step.operations.map((operation) =>
                            JsonUnifier.loadAssets(operation),
                        );
                        await Promise.all(promises);
                    } catch (error) {
                        logger.error(
                            "The operation in the onLoadingLabel function of the label has an error:",
                            error,
                        );
                    }
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
        const step = this._steps[stepId];
        return this.stepConverter(step);
    }

    private operationStringConvert?: (
        value: string,
        step: PixiVNJsonLabelStep,
        props: StepLabelPropsType,
    ) => Promise<PixiVNJsonOperation | undefined>;
    private skipEmptyDialogs: boolean = false;

    public getStepSha(index: number): string | undefined {
        if (index < 0 || index >= this.steps.length) {
            return undefined;
        }
        const step = this._steps[index];
        const sha1String = sha1(step.toString().toLocaleLowerCase());
        return sha1String.toString();
    }

    private getDialogueText(
        origin: PixiVNJsonDialogText,
        props: StepLabelPropsType,
    ): string | string[] {
        let text: string | string[] = "";
        if (Array.isArray(origin)) {
            let texts: string[] = [];
            origin.forEach((t) => {
                if (typeof t === "string") {
                    texts.push(t);
                } else if (t && typeof t === "object") {
                    let res = JsonUnifier.getLogichValue<string | any[]>(t, props);
                    if (res) {
                        if (res && !Array.isArray(res) && typeof res === "object") {
                            res = JsonUnifier.getLogichValue<string | string[]>(res, props) || "";
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
            let res = JsonUnifier.getLogichValue<string | any[]>(origin, props);
            if (res && !Array.isArray(res) && typeof res === "object") {
                res = JsonUnifier.getLogichValue<string | string[]>(res, props);
            }

            if (res && Array.isArray(res)) {
                text = res.map((v) => `${v}`);
            } else {
                text = `${res}`;
            }
        }
        return text;
    }
    private getDialogue(
        origin:
            | PixiVNJsonDialog<PixiVNJsonDialogText>
            | PixiVNJsonConditionalStatements<PixiVNJsonDialog<PixiVNJsonDialogText>>
            | undefined,
        props: StepLabelPropsType,
    ): PixiVNJsonDialog<string | string[]> | undefined {
        if (origin === undefined || origin === null) {
            return undefined;
        }
        const dialogue = JsonUnifier.getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(
            origin,
            props,
        );
        if (dialogue === undefined || dialogue === null) {
            return `${dialogue}`;
        }
        if (typeof dialogue === "object" && "character" in dialogue && "text" in dialogue) {
            return {
                character: dialogue.character,
                text: translator.t(this.getDialogueText(dialogue.text, props)),
            };
        } else {
            return translator.t(this.getDialogueText(dialogue, props));
        }
    }

    private getChoices(
        origin: PixiVNJsonChoices | PixiVNJsonConditionalStatements<PixiVNJsonChoices> | undefined,
        props: StepLabelPropsType,
    ): PixiVNJsonChoice[] | undefined {
        const choices = JsonUnifier.getLogichValue<PixiVNJsonChoices>(origin, props);
        const options = choices
            ?.map((option) => {
                return JsonUnifier.getLogichValue<PixiVNJsonChoice>(option, props);
            })
            .filter((option) => option !== undefined);
        return options;
    }

    private stepConverter(
        stepProp: PixiVNJsonLabelStep | (() => PixiVNJsonLabelStep),
    ): StepLabelType<T> {
        return async (props) => {
            let step: PixiVNJsonLabelStep = typeof stepProp === "function" ? stepProp() : stepProp;
            step = createExportableElement(step);
            step = JsonUnifier.getConditionalStep(step, props);
            const operationStringConvert = this.operationStringConvert
                ? (value: string) => this.operationStringConvert!(value, step, props)
                : undefined;
            const { operations = [] } = step;
            for (const operation of operations) {
                await runOperation(operation, props, operationStringConvert);
            }

            let { labelToOpen: tempLabelToOpen = [] } = step;
            const choices = this.getChoices(step.choices, props);
            const glueEnabled = JsonUnifier.getLogichValue<boolean>(step.glueEnabled, props);
            const dialogue = this.getDialogue(step.dialogue, props);

            const labelToOpen: PixiVNJsonLabelToOpen[] = [];
            if (!Array.isArray(tempLabelToOpen)) {
                tempLabelToOpen = [tempLabelToOpen];
            }
            tempLabelToOpen.forEach((label) => {
                const i = JsonUnifier.getLogichValue<PixiVNJsonLabelToOpen>(label, props);
                if (i) {
                    labelToOpen.push(i);
                }
            });

            let goNextStep = JsonUnifier.getLogichValue<boolean>(step.goNextStep, props);
            const end = JsonUnifier.getLogichValue<"game_end" | "label_end">(step.end, props);

            if (choices) {
                const options: StoredChoiceInterface[] = choices.map((option) => {
                    let text: string | string[] = "";
                    if (Array.isArray(option.text)) {
                        let texts: string[] = [];
                        option.text.forEach((t) => {
                            if (typeof t === "string") {
                                texts.push(translator.t(t));
                            } else if (t && typeof t === "object") {
                                let res = JsonUnifier.getLogichValue<string | any[]>(t, props);
                                if (res && !Array.isArray(res) && typeof res === "object") {
                                    res =
                                        JsonUnifier.getLogichValue<string | string[]>(res, props) ||
                                        "";
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
                narration.choices = options;
            } else {
                narration.choices = undefined;
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
                narration.dialogGlue = true;
            } else if (glueEnabled === false) {
                narration.dialogGlue = false;
            }

            for (const label of labelToOpen) {
                let labelString = label.label;
                if (typeof labelString === "object") {
                    labelString = JsonUnifier.getLogichValue<string>(labelString, props) || "";
                }
                const labelParams = label.params?.map((param) => {
                    return JsonUnifier.getLogichValue(param, props);
                });
                props = {
                    ...props,
                    ...label.props,
                };
                if (label.type === "jump") {
                    if (narration.openedLabels.length > 0) narration.closeCurrentLabel();
                    storage.setTempVariable(
                        `${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length}`,
                        labelParams as StorageElementType,
                    );
                    await narration.call(labelString, props);
                } else {
                    storage.setTempVariable(
                        `${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length}`,
                        labelParams as StorageElementType,
                    );
                    await narration.call(labelString, props);
                }
            }

            if (end === "game_end") {
                narration.closeAllLabels();
                await narration.continue(props, { runNow: true });
            } else if (end === "label_end") {
                narration.closeCurrentLabel();
            }

            if (goNextStep) {
                await narration.continue(props, { runNow: true });
            }
        };
    }
}
