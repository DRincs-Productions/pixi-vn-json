import { translator } from "@drincs/pixi-vn-json/translator";
import { narration, NarrationManagerStatic } from "@drincs/pixi-vn/narration";
import { storage, StorageElementType, SYSTEM_RESERVED_STORAGE_KEYS } from "@drincs/pixi-vn/storage";
import { PIXIVNJSON_PARAM_ID } from "../constants";
import {
    PixiVNJsonArithmeticOperations,
    PixiVNJsonChoiceGet,
    PixiVNJsonConditionalResultToCombine,
    PixiVNJsonConditionalStatements,
    PixiVNJsonConditions,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonLabelGet,
    PixiVNJsonLabelStep,
    PixiVNJsonLogicGet,
    PixiVNJsonOperation,
    PixiVNJsonStepSwitchElementType,
    PixiVNJsonStorageGet,
    PixiVNJsonUnionCondition,
    PixiVNJsonValueGet,
    PixiVNJsonValueSet,
} from "../interface";
import { createExportableElement } from "../utils/createExportableElement";
import { logger } from "./log-utility";

export function setStorageValue(value: PixiVNJsonValueSet) {
    let v = getLogichValue<StorageElementType>(value.value);
    let valueToSet: StorageElementType;
    if (v && typeof v === "object" && "type" in v) {
        valueToSet = getLogichValue<StorageElementType>(v);
    } else {
        valueToSet = v;
    }
    switch (value.storageType) {
        case "flagStorage":
            storage.setFlag(value.key, value.value);
            break;
        case "storage":
            storage.setVariable(value.key, valueToSet);
            break;
        case "tempstorage":
            storage.setTempVariable(value.key, valueToSet);
            break;
        case "params":
            let params: any[] = storage.getVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`) || [];
            if (params && params.length - 1 >= (value.key as number)) {
                params[value.key as number] = valueToSet;
            }
            storage.setTempVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`, params);
            break;
    }
}

export function getLogichValue<T = StorageElementType>(
    value:
        | T
        | PixiVNJsonValueGet
        | PixiVNJsonArithmeticOperations
        | PixiVNJsonConditions
        | PixiVNJsonConditionalStatements<
              T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions
          >
): T | undefined {
    let v = getValueFromConditionalStatements<
        T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions
    >(value);
    if (v && typeof v === "object" && "type" in v) {
        switch (v.type) {
            case "value":
                return getValue<T>(v);
            case "arithmetic":
            case "arithmeticsingle":
                return getValueFromArithmeticOperations(v as PixiVNJsonArithmeticOperations);
            case "compare":
            case "valueCondition":
            case "union":
                return getConditionResult(v) as T;
        }
    }
    return v as T;
}

function getValueFromArithmeticOperations<T = StorageElementType>(
    operation: PixiVNJsonArithmeticOperations
): T | undefined {
    let leftValue = getLogichValue(operation.leftValue);
    switch (operation.type) {
        case "arithmetic":
            let rightValue = getLogichValue(operation.rightValue);
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
                    return Math.pow(leftValue as any, rightValue as any) as T;
                case "RANDOM":
                    return narration.getRandomNumber(leftValue as any, rightValue as any) as T;
            }
        case "arithmeticsingle":
            switch (operation.operator) {
                case "INT":
                    return parseInt(leftValue as any) as T;
                case "FLOOR":
                    return Math.floor(leftValue as any) as T;
                case "FLOAT":
                    return parseFloat(leftValue as any) as T;
            }
            break;
    }
}

/**
 * Get the value from the storage or the value.
 * @param value is the value to get
 * @returns the value from the storage or the value
 */
function getValue<T = any>(value: StorageElementType | PixiVNJsonValueGet): T | undefined {
    if (value && typeof value === "object") {
        if ("type" in value) {
            if (value.type === "value" && value.storageOperationType === "get") {
                switch (value.storageType) {
                    case "storage":
                    case "tempstorage":
                        return storage.getVariable((value as PixiVNJsonStorageGet).key) as unknown as T;
                    case "flagStorage":
                        return storage.getFlag((value as PixiVNJsonStorageGet).key) as unknown as T;
                    case "label":
                        return narration.getTimesLabelOpened((value as PixiVNJsonLabelGet).label) as unknown as T;
                    case "choice":
                        return narration.getTimesChoiceMade((value as PixiVNJsonChoiceGet).index) as unknown as T;
                    case "logic":
                        return getLogichValue((value as PixiVNJsonLogicGet).operation) as unknown as T;
                    case "params":
                        let params: any[] =
                            storage.getVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`) || [];
                        if (params && params.length > (value.key as number)) {
                            return params[value.key as number] as unknown as T;
                        }
                        logger.warn("getValue params not found");
                        return undefined;
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
function getConditionResult(condition: PixiVNJsonConditions): boolean {
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
        case "compare":
            let leftValue = getLogichValue<any>(condition.leftValue);
            let rightValue = getLogichValue<any>(condition.rightValue);
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
        case "valueCondition":
            return getLogichValue(condition.value) ? true : false;
        case "union":
            return getUnionConditionResult(condition as PixiVNJsonUnionCondition);
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
function getUnionConditionResult(condition: PixiVNJsonUnionCondition): boolean {
    if (condition.unionType === "not") {
        return !getLogichValue<boolean>(condition.condition);
    }
    let result: boolean = condition.unionType === "and" ? true : false;
    for (let i = 0; i < condition.conditions.length; i++) {
        result = getLogichValue<boolean>(condition.conditions[i]) || false;
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
function getValueFromConditionalStatements<T>(
    statement: PixiVNJsonConditionalResultToCombine<T> | PixiVNJsonConditionalStatements<T> | T | undefined
): T | undefined {
    if (Array.isArray(statement) || !statement) {
        return statement;
    } else if (statement && typeof statement === "object" && "type" in statement) {
        switch (statement.type) {
            case "resulttocombine":
                return combinateResult(statement);
            case "ifelse":
                let conditionResult = getLogichValue<boolean>(statement.condition);
                if (conditionResult) {
                    return getLogichValue<T>(statement.then as any);
                } else {
                    return getLogichValue<T>(statement.else as any);
                }
            case "stepswitch":
                let elements = getLogichValue<PixiVNJsonStepSwitchElementType<T>[]>(statement.elements) || [];
                if (elements.length === 0) {
                    logger.error("getValueFromConditionalStatements elements.length === 0");
                    return undefined;
                }
                switch (statement.choiceType) {
                    case "random":
                        let randomIndex = randomIntFromInterval(0, elements.length - 1);
                        return getLogichValue<T>(elements[randomIndex] as any);
                    case "loop":
                        let currentStepTimesCounter1 =
                            NarrationManagerStatic.getCurrentStepTimesCounter(statement.nestedId) - 1;
                        if (currentStepTimesCounter1 > elements.length - 1) {
                            currentStepTimesCounter1 = currentStepTimesCounter1 % elements.length;
                            return getLogichValue<T>(elements[currentStepTimesCounter1] as any);
                        }
                        return getLogichValue<T>(elements[currentStepTimesCounter1] as any);
                    case "sequential":
                        let end: T | undefined = undefined;
                        let currentStepTimesCounter2 =
                            NarrationManagerStatic.getCurrentStepTimesCounter(statement.nestedId) - 1;
                        if (statement.end == "lastItem") {
                            end = getLogichValue<T>(elements[elements.length - 1] as any);
                        }
                        if (currentStepTimesCounter2 > elements.length - 1) {
                            return end;
                        }
                        return getLogichValue<T>(elements[currentStepTimesCounter2] as any);
                    case "sequentialrandom":
                        let randomIndexWhitExclude = NarrationManagerStatic.getRandomNumber(0, elements.length - 1, {
                            nestedId: statement.nestedId,
                            onceOnly: true,
                        });
                        if (randomIndexWhitExclude == undefined && statement.end == "lastItem") {
                            let obj = NarrationManagerStatic.getCurrentStepTimesCounterData(statement.nestedId);
                            if (!obj || !obj?.usedRandomNumbers) {
                                logger.warn("getValueFromConditionalStatements randomIndexWhitExclude == undefined");
                                return undefined;
                            }
                            let lastItem = obj.usedRandomNumbers[`${0}-${elements.length - 1}`];
                            return getLogichValue<T>(elements[lastItem[lastItem.length - 1]] as any);
                        }
                        if (randomIndexWhitExclude == undefined) {
                            logger.warn("getValueFromConditionalStatements randomIndexWhitExclude == undefined");
                            return undefined;
                        }
                        return getLogichValue<T>(elements[randomIndexWhitExclude] as any);
                }
        }
    }
    return statement;
}

export function getConditionalStep(originalStep: PixiVNJsonLabelStep): PixiVNJsonLabelStep {
    if (originalStep.conditionalStep) {
        let conditionalStep = createExportableElement(
            getLogichValue<PixiVNJsonLabelStep>(originalStep.conditionalStep as any)
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
            let obj = {
                ...originalStep,
                conditionalStep: undefined,
                ...conditionalStep,
            };
            return getConditionalStep(obj);
        } else if (
            storage.getFlag(SYSTEM_RESERVED_STORAGE_KEYS.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY)
        ) {
            storage.setFlag(SYSTEM_RESERVED_STORAGE_KEYS.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY, false);
        }
    }
    return originalStep;
}

function combinateResult<T>(value: PixiVNJsonConditionalResultToCombine<T>): undefined | T {
    let first = value.firstItem;
    let second: T[] = [];
    value.secondConditionalItem?.forEach((item) => {
        if (!Array.isArray(item)) {
            let i = getLogichValue<T>(item as any);
            second.push(i as any);
        } else {
            item.forEach((i) => {
                let j = getLogichValue<T>(i);
                second.push(j as any);
            });
        }
    });
    let toCheck = first ? [first, ...second] : second;
    if (toCheck.length === 0) {
        logger.warn("combinateResult toCheck.length === 0");
        return undefined;
    }

    if (typeof toCheck[0] === "string") {
        return translator.t(toCheck) as T;
    }
    if (typeof toCheck[0] === "object") {
        let steps = toCheck as PixiVNJsonLabelStep[];
        let beforeIsGlueEnabled: undefined | boolean = undefined;
        let dialogueArray: PixiVNJsonDialog<PixiVNJsonDialogText>[] = steps.map((step, index) => {
            step = getConditionalStep(step);
            let value = getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(step.dialogue) || "";
            if (index === 0) {
                beforeIsGlueEnabled = getLogichValue<boolean>(step.glueEnabled) || false;
                return value;
            } else if (typeof value === "object" && "text" in value) {
                value = value.character + ": " + value.text;
            }
            if (beforeIsGlueEnabled === false) {
                value = "\n\n" + value;
            }
            beforeIsGlueEnabled = getLogichValue<boolean>(step.glueEnabled) || false;
            return value;
        });
        let firstDialogue = getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(dialogueArray[0]);
        let character =
            typeof firstDialogue === "object" && "character" in firstDialogue ? firstDialogue.character : undefined;
        let dialogues: string | string[] = dialogueArray.flatMap((dialogue) => {
            let text: PixiVNJsonDialogText;
            if (dialogue && typeof dialogue === "object" && "text" in dialogue) {
                text = dialogue.text;
            } else {
                text = dialogue;
            }
            let textEasy: string | string[];
            if (Array.isArray(text)) {
                textEasy = text.map((t) => {
                    let value = getLogichValue<string>(t);
                    return translator.t(`${value}`);
                });
            } else {
                textEasy = getLogichValue<string>(text) || "";
            }
            return translator.t(textEasy);
        });
        let end = steps.find((step) => step.end);
        let choices = steps.find((step) => step.choices);
        let glueEnabled: boolean | PixiVNJsonConditionalStatements<boolean> | undefined = false;
        let goNextStep: boolean | PixiVNJsonConditionalStatements<boolean> | undefined = false;
        if (steps.length > 0) {
            if (steps[0].glueEnabled && steps[0].goNextStep && steps[0].dialogue === undefined) {
                storage.setFlag(
                    SYSTEM_RESERVED_STORAGE_KEYS.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY,
                    true
                );
            }
            glueEnabled = steps[steps.length - 1].glueEnabled;
            goNextStep = steps
                .reverse()
                .find((step) => !(step.operations && (!step.dialogue || !step.choices)))?.goNextStep;
        }
        let labelToOpen = steps.find((step) => step.labelToOpen);
        let operations: PixiVNJsonOperation[] = [];
        steps.forEach((step) => {
            if (step.operations) {
                operations.forEach((operation) => {
                    operations.push(operation);
                });
            }
        });

        let res: PixiVNJsonLabelStep = {
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
