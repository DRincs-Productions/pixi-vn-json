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

/**
 * Resolves a storage value that may itself be a nested logic expression.
 * If the first resolution returns an object with a `type` field (i.e. another logic expression),
 * it is resolved a second time.
 */
function resolveStorageValue(
    rawValue: PixiVNJsonValueSet["value"] | PixiVNJsonOnlyStorageSet["value"],
    props: StepLabelPropsType,
): StorageElementType {
    const v = JsonUnifier.getLogichValue<StorageElementType>(rawValue, props);
    if (v && typeof v === "object" && "type" in v) {
        return JsonUnifier.getLogichValue<StorageElementType>(v, props);
    }
    return v;
}

/**
 * Sets a value in the appropriate storage layer (flag storage, persistent storage,
 * temporary storage, or label parameters) as described by the operation.
 *
 * @param value - The storage-set operation descriptor.
 * @param props - The current step label props (used to resolve dynamic values).
 */
export function setStorageValue(value: PixiVNJsonValueSet, props: StepLabelPropsType = {}) {
    const valueToSet = resolveStorageValue(value.value, props);
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
            const params: StorageElementType[] =
                (storage.get(
                    `${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`,
                ) as StorageElementType[]) || [];
            if (params.length > (value.key as number)) {
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

/**
 * Sets a default (initial) value in persistent or temporary storage.
 * Unlike {@link setStorageValue}, this only applies to `"storage"` and `"tempstorage"` types
 * and writes to `storage.default` so the value is used as a fallback.
 *
 * @param value - The initial storage-set operation descriptor.
 * @param props - The current step label props (used to resolve dynamic values).
 */
export function setInitialStorageValue(
    value: PixiVNJsonOnlyStorageSet,
    props: StepLabelPropsType = {},
) {
    const valueToSet = resolveStorageValue(value.value, props);
    switch (value.storageType) {
        case "storage":
        case "tempstorage":
            storage.default = {
                [value.key]: valueToSet,
            };
            break;
    }
}

/**
 * Resolves a JSON logic value (storage get, arithmetic, condition, function, conditional statement)
 * down to a plain TypeScript value of type `T`.
 *
 * This is the main evaluation entry-point: conditional statements are unwrapped first,
 * then the remaining expression type is dispatched to the appropriate handler.
 *
 * @param value - The value or expression to resolve.
 * @param props - The current step label props passed down through the call chain.
 * @returns The resolved value, or `undefined` if the expression cannot be evaluated.
 */
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
                    if (typeof leftValue === "string" || typeof rightValue === "string") {
                        return `${leftValue}${rightValue}` as unknown as T;
                    }
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return [...leftValue, ...rightValue] as unknown as T;
                    } else if (Array.isArray(leftValue)) {
                        return [...leftValue, rightValue] as unknown as T;
                    } else if (Array.isArray(rightValue)) {
                        return [leftValue, ...rightValue] as unknown as T;
                    }
                    return ((leftValue as any) + (rightValue as any)) as T;
                case "-":
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return leftValue.filter(
                            (v) => !rightValue.includes(v as any),
                        ) as unknown as T;
                    } else if (Array.isArray(leftValue)) {
                        return leftValue.filter((v) => v !== rightValue) as unknown as T;
                    } else if (Array.isArray(rightValue)) {
                        logger.warn(
                            "getValueFromArithmeticOperations cannot subtract array from non-array",
                        );
                        return undefined;
                    }
                    return ((leftValue as any) - (rightValue as any)) as T;
                case "%":
                    return ((leftValue as any) % (rightValue as any)) as T;
                case "POW":
                    return ((leftValue as any) ** (rightValue as any)) as T;
                case "RANDOM":
                    return narration.getRandomNumber(leftValue as any, rightValue as any) as T;
                case "INTERSECTION":
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return leftValue.filter((v) =>
                            rightValue.includes(v as any),
                        ) as unknown as T;
                    } else {
                        logger.warn(
                            "getValueFromArithmeticOperations cannot intersect non-array values",
                        );
                        return undefined;
                    }
                default:
                    logger.warn(`getValueFromArithmeticOperations unknown operator`, operation);
                    return undefined;
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
        return !!condition;
    }
    switch (condition.type) {
        case "compare": {
            const leftValue = JsonUnifier.getLogichValue<any>(condition.leftValue, props);
            const rightValue = JsonUnifier.getLogichValue<any>(condition.rightValue, props);
            switch (condition.operator) {
                case "==":
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return (
                            leftValue.length === rightValue.length &&
                            leftValue.every((v) => rightValue.includes(v))
                        );
                    }
                    return leftValue === rightValue;
                case "!=":
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return (
                            leftValue.length !== rightValue.length ||
                            !leftValue.every((v) => rightValue.includes(v))
                        );
                    }
                    return leftValue !== rightValue;
                case "<":
                    if (typeof leftValue === "string" && typeof rightValue === "string") {
                        return leftValue.localeCompare(rightValue) < 0;
                    }
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return leftValue.length < rightValue.length;
                    }
                    return leftValue < rightValue;
                case "<=":
                    if (typeof leftValue === "string" && typeof rightValue === "string") {
                        return leftValue.localeCompare(rightValue) <= 0;
                    }
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return leftValue.length <= rightValue.length;
                    }
                    return leftValue <= rightValue;
                case ">":
                    if (typeof leftValue === "string" && typeof rightValue === "string") {
                        return leftValue.localeCompare(rightValue) > 0;
                    }
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return leftValue.length > rightValue.length;
                    }
                    return leftValue > rightValue;
                case ">=":
                    if (typeof leftValue === "string" && typeof rightValue === "string") {
                        return leftValue.localeCompare(rightValue) >= 0;
                    }
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return leftValue.length >= rightValue.length;
                    }
                    return leftValue >= rightValue;
                case "CONTAINS":
                    // If all rightValue items are included in leftValue, return true. If leftValue is string, check if it includes rightValue as substring
                    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
                        return rightValue.every((v) => leftValue.includes(v));
                    }
                    if (Array.isArray(leftValue)) {
                        return leftValue.includes(rightValue);
                    }
                    return leftValue.toString().includes(rightValue.toString());
            }
            break;
        }
        case "value": {
            const res = JsonUnifier.getLogichValue(condition, props);
            if (Array.isArray(res)) {
                return res.length > 0;
            }
            if (res && typeof res === "object") {
                return Object.keys(res).length > 0;
            }
            return !!res;
        }
        case "union":
            return getUnionConditionResult(condition as PixiVNJsonUnionCondition, props);
    }
    return !!condition;
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
        const res = getLogichValue<boolean>(condition.condition, props);
        if (Array.isArray(res)) {
            return res.length === 0;
        }
        if (res && typeof res === "object") {
            return Object.keys(res).length === 0;
        }
        return !res;
    }
    const resolve = (c: PixiVNJsonConditions) =>
        JsonUnifier.getLogichValue<boolean>(c, props) || false;
    if (condition.unionType === "and") {
        return condition.conditions.every(resolve);
    }
    return condition.conditions.some(resolve);
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

/**
 * Resolves the `conditionalStep` field of a label step and merges the result back
 * into the step, recursively, until no more conditional overrides remain.
 *
 * Undefined properties on the resolved conditional step are deleted so they do not
 * overwrite existing values on the base step.
 *
 * @param originalStep - The label step that may contain a `conditionalStep` expression.
 * @param props - The current step label props used to evaluate the condition.
 * @returns The fully resolved label step.
 */
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
    const second = (value.secondConditionalItem ?? []).flatMap((item) => {
        if (!Array.isArray(item)) {
            return [JsonUnifier.getLogichValue<T>(item as any, props) as T];
        }
        return item.map((i) => JsonUnifier.getLogichValue<T>(i, props) as T);
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
