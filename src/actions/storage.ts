import { PIXIVNJSON_PARAM_ID } from "@/constants";
import { functionOperation } from "@/utils/function-utility";
import { logger } from "@/utils/log-utility";
import { createExportableElement } from "@drincs/pixi-vn";
import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import type {
    PixiVNJsonArithmeticOperations,
    PixiVNJsonChoiceGet,
    PixiVNJsonConditionalOperation,
    PixiVNJsonConditionalResultToCombine,
    PixiVNJsonConditionalStatements,
    PixiVNJsonConditions,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonFunction,
    PixiVNJsonLabelGet,
    PixiVNJsonLabelStep,
    PixiVNJsonLogicGet,
    PixiVNJsonOnlyStorageSet,
    PixiVNJsonStepSwitchElementType,
    PixiVNJsonStorageGet,
    PixiVNJsonUnionCondition,
    PixiVNJsonValueGet,
    PixiVNJsonValueSet,
} from "@drincs/pixi-vn-json/schema";
import { translator } from "@drincs/pixi-vn-json/translator";
import {
    narration,
    NarrationManagerStatic,
    type StepLabelPropsType,
} from "@drincs/pixi-vn/narration";
import { storage, type StorageElementType } from "@drincs/pixi-vn/storage";

export function setStorageValue(value: PixiVNJsonValueSet, props: StepLabelPropsType = {}) {
    const v = JsonUnifier.getLogichValue<StorageElementType>(value.value, props);
    let valueToSet: StorageElementType;
    if (v && typeof v === "object" && "type" in v) {
        valueToSet = JsonUnifier.getLogichValue<StorageElementType>(v, props);
    } else {
        valueToSet = v;
    }
    switch (value.storageType) {
        case "flagStorage":
            storage.setFlag(value.key, value.value);
            break;
        case "storage":
            storage.set(value.key, valueToSet);
            break;
        case "tempstorage":
            storage.setTempVariable(value.key, valueToSet);
            break;
        case "params": {
            const params: any[] =
                storage.get(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`) || [];
            if (params && params.length - 1 >= (value.key as number)) {
                params[value.key as number] = valueToSet;
            }
            storage.setTempVariable(
                `${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`,
                params,
            );
            break;
        }
    }
}

export function setInitialStorageValue(
    value: PixiVNJsonOnlyStorageSet,
    props: StepLabelPropsType = {},
) {
    const v = JsonUnifier.getLogichValue<StorageElementType>(value.value, props);
    let valueToSet: StorageElementType;
    if (v && typeof v === "object" && "type" in v) {
        valueToSet = JsonUnifier.getLogichValue<StorageElementType>(v, props);
    } else {
        valueToSet = v;
    }
    switch (value.storageType) {
        case "storage":
        case "tempstorage":
            storage.default = {
                [value.key]: valueToSet,
            };
            break;
    }
}

export function getLogichValue<T = StorageElementType>(
    value:
        | T
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditions
        | PixiVNJsonFunction
        | PixiVNJsonConditionalStatements<
              T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions
          >,
    props: StepLabelPropsType = {},
): T | undefined {
    const v = getValueFromConditionalStatements<
        | T
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditions
        | PixiVNJsonFunction
    >(value, props);
    if (v && typeof v === "object" && "type" in v) {
        switch (v.type) {
            case "value":
                return getValue<T>(v, props);
            case "arithmetic":
            case "arithmeticsingle":
                return getValueFromArithmeticOperations(v as PixiVNJsonArithmeticOperations, props);
            case "compare":
            case "valueCondition":
            case "union":
                return getConditionResult(v, props) as T;
            case "function":
                return functionOperation(v as PixiVNJsonFunction, props) as T;
        }
    }
    return v as T;
}

function getValueFromArithmeticOperations<T = StorageElementType>(
    operation: PixiVNJsonArithmeticOperations,
    props: StepLabelPropsType,
): T | undefined {
    const leftValue = JsonUnifier.getLogichValue(operation.leftValue, props);
    switch (operation.type) {
        case "arithmetic": {
            const rightValue = JsonUnifier.getLogichValue(operation.rightValue, props);
            switch (operation.operator) {
                case "*":
                    return ((leftValue as any) * (rightValue as any)) as T;
                case "/":
                    return ((leftValue as any) / (rightValue as any)) as T;
                case "+":
                    return ((leftValue as any) + (rightValue as any)) as T;
                case "-":
                    return ((leftValue as any) - (rightValue as any)) as T;
                case "%":
                    return ((leftValue as any) % (rightValue as any)) as T;
                case "POW":
                    return ((leftValue as any) ** (rightValue as any)) as T;
                case "RANDOM":
                    return narration.getRandomNumber(leftValue as any, rightValue as any) as T;
            }
        }
        case "arithmeticsingle":
            switch (operation.operator) {
                case "INT":
                    return Number(leftValue as any) as T;
                case "FLOOR":
                    return Math.floor(leftValue as any) as T;
                case "FLOAT":
            }
            break;
    }
}

/**
 * Get the value from the storage or the value.
 * @param value is the value to get
 * @returns the value from the storage or the value
 */
function getValue<T = any>(
    value: StorageElementType | PixiVNJsonValueGet,
    props: StepLabelPropsType,
): T | undefined {
    if (value && typeof value === "object") {
        if ("type" in value) {
            if (value.type === "value" && value.storageOperationType === "get") {
                switch (value.storageType) {
                    case "storage":
                    case "tempstorage":
                        if (value.key === "_input_value_") {
                            return narration.inputValue as unknown as T;
                        }
                        return storage.get((value as PixiVNJsonStorageGet).key) as unknown as T;
                    case "flagStorage":
                        return storage.getFlag((value as PixiVNJsonStorageGet).key) as unknown as T;
                    case "label":
                        return narration.getTimesLabelOpened(
                            (value as PixiVNJsonLabelGet).label,
                        ) as unknown as T;
                    case "choice":
                        return narration.getTimesChoiceMade(
                            (value as PixiVNJsonChoiceGet).index,
                        ) as unknown as T;
                    case "logic":
                        return JsonUnifier.getLogichValue(
                            (value as PixiVNJsonLogicGet).operation,
                            props,
                        ) as unknown as T;
                    case "params": {
                        const params: any[] =
                            storage.get(
                                `${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`,
                            ) || [];
                        if (params && params.length > (value.key as number)) {
                            return params[value.key as number] as unknown as T;
                        }
                        logger.warn("getValue params not found");
                        return undefined;
                    }
                }
            }
        }
    }
    return value as T;
}

/**
 * Get the result of the condition.
 * @param condition is the condition object
 * @returns the result of the condition
 */
function getConditionResult(condition: PixiVNJsonConditions, props: StepLabelPropsType): boolean {
    if (!condition) {
        return false;
    }
    if (typeof condition !== "object" || !("type" in condition)) {
        if (condition) {
            return true;
        }
        return false;
    }
    switch (condition.type) {
        case "compare": {
            const leftValue = JsonUnifier.getLogichValue<any>(condition.leftValue, props);
            const rightValue = JsonUnifier.getLogichValue<any>(condition.rightValue, props);
            switch (condition.operator) {
                case "==":
                    return leftValue === rightValue;
                case "!=":
                    return leftValue !== rightValue;
                case "<":
                    return leftValue < rightValue;
                case "<=":
                    return leftValue <= rightValue;
                case ">":
                    return leftValue > rightValue;
                case ">=":
                    return leftValue >= rightValue;
                case "CONTAINS":
                    return leftValue.toString().includes(rightValue.toString());
            }
            break;
        }
        case "valueCondition":
            return JsonUnifier.getLogichValue(condition.value, props) ? true : false;
        case "union":
            return getUnionConditionResult(condition as PixiVNJsonUnionCondition, props);
    }
    if (condition) {
        return true;
    }
    return false;
}

/**
 * Get the result of the union condition.
 * @param condition is the union condition object
 * @returns the result of the union condition
 */
function getUnionConditionResult(
    condition: PixiVNJsonUnionCondition,
    props: StepLabelPropsType,
): boolean {
    if (condition.unionType === "not") {
        return !getLogichValue<boolean>(condition.condition, props);
    }
    let result: boolean = condition.unionType === "and" ? true : false;
    for (let i = 0; i < condition.conditions.length; i++) {
        result = JsonUnifier.getLogichValue<boolean>(condition.conditions[i], props) || false;
        if (condition.unionType === "and") {
            if (!result) {
                return false;
            }
        } else {
            if (result) {
                return true;
            }
        }
    }
    return result;
}

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get the value from the conditional statements.
 * @param statement is the conditional statements object
 * @returns the value from the conditional statements
 */
export function getValueFromConditionalStatements<T>(
    statement:
        | PixiVNJsonConditionalResultToCombine<T>
        | PixiVNJsonConditionalStatements<T>
        | T
        | undefined,
    props: StepLabelPropsType = {},
): T | undefined {
    if (Array.isArray(statement) || !statement) {
        return statement;
    } else if (statement && typeof statement === "object" && "type" in statement) {
        switch (statement.type) {
            case "resulttocombine":
                return combinateResult(statement, props);
            case "ifelse": {
                const conditionResult = JsonUnifier.getLogichValue<boolean>(
                    statement.condition,
                    props,
                );
                if (conditionResult) {
                    return JsonUnifier.getLogichValue<T>(statement.then as any, props);
                } else {
                    return JsonUnifier.getLogichValue<T>(statement.else as any, props);
                }
            }
            case "stepswitch": {
                const elements =
                    JsonUnifier.getLogichValue<PixiVNJsonStepSwitchElementType<T>[]>(
                        statement.elements,
                        props,
                    ) || [];
                if (elements.length === 0) {
                    logger.error("getValueFromConditionalStatements elements.length === 0");
                    return undefined;
                }
                switch (statement.choiceType) {
                    case "random": {
                        const randomIndex = randomIntFromInterval(0, elements.length - 1);
                        return JsonUnifier.getLogichValue<T>(elements[randomIndex] as any, props);
                    }
                    case "loop": {
                        let currentStepTimesCounter1 =
                            NarrationManagerStatic.getCurrentStepTimesCounter(statement.nestedId) -
                            1;
                        if (currentStepTimesCounter1 > elements.length - 1) {
                            currentStepTimesCounter1 = currentStepTimesCounter1 % elements.length;
                            return JsonUnifier.getLogichValue<T>(
                                elements[currentStepTimesCounter1] as any,
                                props,
                            );
                        }
                        return JsonUnifier.getLogichValue<T>(
                            elements[currentStepTimesCounter1] as any,
                            props,
                        );
                    }
                    case "sequential": {
                        let end: T | undefined;
                        const currentStepTimesCounter2 =
                            NarrationManagerStatic.getCurrentStepTimesCounter(statement.nestedId) -
                            1;
                        if (statement.end === "lastItem") {
                            end = JsonUnifier.getLogichValue<T>(
                                elements[elements.length - 1] as any,
                                props,
                            );
                        }
                        if (currentStepTimesCounter2 > elements.length - 1) {
                            return end;
                        }
                        return JsonUnifier.getLogichValue<T>(
                            elements[currentStepTimesCounter2] as any,
                            props,
                        );
                    }
                    case "sequentialrandom": {
                        const randomIndexWhitExclude = NarrationManagerStatic.getRandomNumber(
                            0,
                            elements.length - 1,
                            {
                                nestedId: statement.nestedId,
                                onceOnly: true,
                            },
                        );
                        if (randomIndexWhitExclude === undefined && statement.end === "lastItem") {
                            const obj = NarrationManagerStatic.getCurrentStepTimesCounterData(
                                statement.nestedId,
                            );
                            if (!obj?.usedRandomNumbers) {
                                logger.warn(
                                    "getValueFromConditionalStatements randomIndexWhitExclude == undefined",
                                );
                                return undefined;
                            }
                            const lastItem = obj.usedRandomNumbers[`${0}-${elements.length - 1}`];
                            return JsonUnifier.getLogichValue<T>(
                                elements[lastItem[lastItem.length - 1]] as any,
                                props,
                            );
                        }
                        if (randomIndexWhitExclude === undefined) {
                            logger.warn(
                                "getValueFromConditionalStatements randomIndexWhitExclude == undefined",
                            );
                            return undefined;
                        }
                        return JsonUnifier.getLogichValue<T>(
                            elements[randomIndexWhitExclude] as any,
                            props,
                        );
                    }
                }
            }
        }
    }
    return statement;
}

export function getConditionalStep(
    originalStep: PixiVNJsonLabelStep,
    props: StepLabelPropsType = {},
): PixiVNJsonLabelStep {
    if (originalStep.conditionalStep) {
        const conditionalStep = createExportableElement(
            JsonUnifier.getLogichValue<PixiVNJsonLabelStep>(
                originalStep.conditionalStep as any,
                props,
            ),
        );
        if (conditionalStep?.glueEnabled === undefined) {
            delete conditionalStep?.glueEnabled;
        }
        if (conditionalStep?.goNextStep === undefined) {
            delete conditionalStep?.goNextStep;
        }
        if (conditionalStep?.end === undefined) {
            delete conditionalStep?.end;
        }
        if (conditionalStep?.choices === undefined) {
            delete conditionalStep?.choices;
        }
        if (conditionalStep?.dialogue === undefined) {
            delete conditionalStep?.dialogue;
        }
        if (conditionalStep?.labelToOpen === undefined) {
            delete conditionalStep?.labelToOpen;
        }
        if (conditionalStep?.operations === undefined) {
            delete conditionalStep?.operations;
        }
        if (conditionalStep) {
            const obj = {
                ...originalStep,
                conditionalStep: undefined,
                ...conditionalStep,
            };
            return getConditionalStep(obj, props);
        } else if (narration.dialogGlue) {
            narration.dialogGlue = false;
        }
    }
    return originalStep;
}

function combinateResult<T>(
    value: PixiVNJsonConditionalResultToCombine<T>,
    props: StepLabelPropsType,
): undefined | T {
    const first = value.firstItem;
    const second: T[] = [];
    value.secondConditionalItem?.forEach((item) => {
        if (!Array.isArray(item)) {
            const i = JsonUnifier.getLogichValue<T>(item as any, props);
            second.push(i as any);
        } else {
            item.forEach((i) => {
                const j = JsonUnifier.getLogichValue<T>(i, props);
                second.push(j as any);
            });
        }
    });
    const toCheck = first ? [first, ...second] : second;
    if (toCheck.length === 0) {
        logger.warn("combinateResult toCheck.length === 0");
        return undefined;
    }

    if (typeof toCheck[0] === "string") {
        return translator.t(toCheck) as T;
    }
    if (typeof toCheck[0] === "object") {
        const steps = toCheck as PixiVNJsonLabelStep[];
        let beforeIsGlueEnabled: undefined | boolean;
        let beforeHaveText = false;
        const dialogueArray: PixiVNJsonDialog<PixiVNJsonDialogText>[] = steps.map((step, index) => {
            step = getConditionalStep(step, props);
            let value =
                JsonUnifier.getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(
                    step.dialogue,
                    props,
                ) || "";
            if (index === 0) {
                beforeIsGlueEnabled =
                    JsonUnifier.getLogichValue<boolean>(step.glueEnabled, props) || false;
                return value;
            } else if (typeof value === "object" && "text" in value) {
                value = `${value.character}: ${value.text}`;
            }
            if (beforeIsGlueEnabled === false && beforeHaveText) {
                value = `\n\n${value}`;
            }
            if (value) {
                beforeHaveText = true;
            }
            beforeIsGlueEnabled =
                JsonUnifier.getLogichValue<boolean>(step.glueEnabled, props) || false;
            return value;
        });
        const firstDialogue = JsonUnifier.getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(
            dialogueArray[0],
            props,
        );
        const character =
            typeof firstDialogue === "object" && "character" in firstDialogue
                ? firstDialogue.character
                : undefined;
        const dialogues: string | string[] = dialogueArray.flatMap((dialogue) => {
            let text: PixiVNJsonDialogText;
            if (dialogue && typeof dialogue === "object" && "text" in dialogue) {
                text = dialogue.text;
            } else {
                text = dialogue;
            }
            let textEasy: string | string[];
            if (Array.isArray(text)) {
                textEasy = text.map((t) => {
                    const value = JsonUnifier.getLogichValue<string>(t, props);
                    return translator.t(`${value}`);
                });
            } else {
                textEasy = JsonUnifier.getLogichValue<string>(text, props) || "";
            }
            return translator.t(textEasy);
        });
        const end = steps.find((step) => step.end);
        const choices = steps.find((step) => step.choices);
        let glueEnabled: boolean | PixiVNJsonConditionalStatements<boolean> | undefined = false;
        let goNextStep: boolean | PixiVNJsonConditionalStatements<boolean> | undefined = false;
        if (steps.length > 0) {
            if (steps[0].glueEnabled && steps[0].goNextStep && steps[0].dialogue === undefined) {
                narration.dialogGlue = true;
            }
            glueEnabled = steps[steps.length - 1].glueEnabled;
            goNextStep = steps
                .reverse()
                .find(
                    (step) => !(step.operations && (!step.dialogue || !step.choices)),
                )?.goNextStep;
        }
        const labelToOpen = steps.find((step) => step.labelToOpen);
        let operations: PixiVNJsonConditionalOperation[] = [];
        steps.forEach((step) => {
            if (step.operations) {
                operations = [...operations, ...step.operations];
            }
        });

        const res: PixiVNJsonLabelStep = {
            dialogue: character
                ? {
                      character: character,
                      text: dialogues,
                  }
                : dialogues,
            end: end?.end,
            choices: choices?.choices,
            glueEnabled: glueEnabled,
            goNextStep: goNextStep,
            labelToOpen: labelToOpen?.labelToOpen,
            operations: operations,
        };
        return res as T;
    }
}
