import { getFlag, narration, NarrationManagerStatic, setFlag, storage, StorageElementType } from "@drincs/pixi-vn";
import { PixiVNJsonConditions, PixiVNJsonDialog, PixiVNJsonDialogText, PixiVNJsonLabelGet, PixiVNJsonLabelStep, PixiVNJsonStepSwitchElementType, PixiVNJsonStorageGet, PixiVNJsonUnionCondition, PixiVNJsonValueGet, PixiVNJsonValueSet } from "../interface";
import PixiVNJsonArithmeticOperations from "../interface/PixiVNJsonArithmeticOperations";
import PixiVNJsonConditionalResultToCombine from "../interface/PixiVNJsonConditionalResultToCombine";
import PixiVNJsonConditionalStatements from "../interface/PixiVNJsonConditionalStatements";
import { PixiVNJsonLogicGet } from "../interface/PixiVNJsonValue";

function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Get the value from the conditional statements.
 * @param statement is the conditional statements object
 * @returns the value from the conditional statements
 */
function getValueFromConditionalStatements<T>(
    statement: PixiVNJsonConditionalResultToCombine<T> | PixiVNJsonConditionalStatements<T> | T | undefined,
    params: any[]
): T | undefined {
    if (Array.isArray(statement) || !statement) {
        return statement
    }
    else if (statement && typeof statement === "object" && "type" in statement) {
        switch (statement.type) {
            case "resulttocombine":
                return combinateResult(statement, params)
            case "ifelse":
                let conditionResult = getLogichValue<boolean>(statement.condition, params)
                if (conditionResult) {
                    return getLogichValue<T>(statement.then as any, params)
                } else {
                    return getLogichValue<T>(statement.else as any, params)
                }
            case "stepswitch":
                let elements = getLogichValue<PixiVNJsonStepSwitchElementType<T>[]>(statement.elements, params) || []
                if (elements.length === 0) {
                    console.error("[Pixi’VN Json] getValueFromConditionalStatements elements.length === 0")
                    return undefined
                }
                switch (statement.choiceType) {
                    case "random":
                        let randomIndex = randomIntFromInterval(0, elements.length - 1)
                        return getLogichValue<T>(elements[randomIndex] as any, params)
                    case "loop":
                        let currentStepTimesCounter1 = NarrationManagerStatic.getCurrentStepTimesCounter(statement.nestedId) - 1
                        if (currentStepTimesCounter1 > elements.length - 1) {
                            currentStepTimesCounter1 = 0
                            return getLogichValue<T>(elements[0] as any, params)
                        }
                        return getLogichValue<T>(elements[currentStepTimesCounter1] as any, params)
                    case "sequential":
                        let end: T | undefined = undefined
                        let currentStepTimesCounter2 = NarrationManagerStatic.getCurrentStepTimesCounter(statement.nestedId) - 1
                        if (statement.end == "lastItem") {
                            end = getLogichValue<T>(elements[elements.length - 1] as any, params)
                        }
                        if (currentStepTimesCounter2 > elements.length - 1) {
                            return end
                        }
                        return getLogichValue<T>(elements[currentStepTimesCounter2] as any, params)
                    case "sequentialrandom":
                        let randomIndexWhitExclude = NarrationManagerStatic.getRandomNumber(0, elements.length - 1, {
                            nestedId: statement.nestedId,
                            onceOnly: true
                        })
                        if (randomIndexWhitExclude == undefined && statement.end == "lastItem") {
                            let obj = NarrationManagerStatic.getCurrentStepTimesCounterData(statement.nestedId)
                            if (!obj || !obj?.usedRandomNumbers) {
                                console.warn("[Pixi’VN Json] getValueFromConditionalStatements randomIndexWhitExclude == undefined")
                                return undefined
                            }
                            let lastItem = obj.usedRandomNumbers[`${0}-${elements.length - 1}`]
                            return getLogichValue<T>(elements[lastItem[lastItem.length - 1]] as any, params)
                        }
                        if (randomIndexWhitExclude == undefined) {
                            console.warn("[Pixi’VN Json] getValueFromConditionalStatements randomIndexWhitExclude == undefined")
                            return undefined
                        }
                        return getLogichValue<T>(elements[randomIndexWhitExclude] as any, params)
                }
        }
    }
    return statement
}

export function getConditionalStep(step: PixiVNJsonLabelStep, params: any[]): PixiVNJsonLabelStep {
    if (step.conditionalStep) {
        let conditionalStep = getLogichValue<PixiVNJsonLabelStep>(step.conditionalStep as any, params)
        if (conditionalStep) {
            let obj = {
                ...step,
                conditionalStep: undefined,
                ...conditionalStep,
            }
            return getConditionalStep(obj, params)
        }
        else if (getFlag(storage.keysSystem.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY)) {
            setFlag(storage.keysSystem.ADD_NEXT_DIALOG_TEXT_INTO_THE_CURRENT_DIALOG_FLAG_KEY, false)
        }
    }
    return step
}

function combinateResult<T>(value: PixiVNJsonConditionalResultToCombine<T>, params: any[]): undefined | T {
    let first = value.firstItem
    let second: T[] = []
    value.secondConditionalItem?.forEach((item) => {
        if (!Array.isArray(item)) {
            let i = getLogichValue<T>(item as any, params)
            second.push(i as any)
        }
        else {
            item.forEach((i) => {
                let j = getLogichValue<T>(i, params)
                second.push(j as any)
            })
        }
    })
    let toCheck = first ? [first, ...second] : second
    if (toCheck.length === 0) {
        console.warn("[Pixi’VN Json] combinateResult toCheck.length === 0")
        return undefined
    }

    if (typeof toCheck[0] === "string") {
        return toCheck.join("") as T
    }
    if (typeof toCheck[0] === "object") {
        let steps = toCheck as PixiVNJsonLabelStep[]
        let dialogueArray: PixiVNJsonDialog<PixiVNJsonDialogText>[] = steps.map((step) => {
            step = getConditionalStep(step, params)
            return getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(step.dialogue, params) || ""
        })
        let firstDialogue = getLogichValue<PixiVNJsonDialog<PixiVNJsonDialogText>>(dialogueArray[0], params)
        let character = typeof firstDialogue === "object" && "character" in firstDialogue ? firstDialogue.character : undefined
        let dialogues: string = dialogueArray.map((dialogue) => {
            let text: PixiVNJsonDialogText
            if (dialogue && typeof dialogue === "object" && "text" in dialogue) {
                text = dialogue.text
            }
            else {
                text = dialogue
            }
            let textEasy: string
            if (Array.isArray(text)) {
                textEasy = text.map((t) => {
                    let value = getLogichValue<string>(t, params)
                    return `${value}`
                }).join("")
            }
            else {
                textEasy = getLogichValue<string>(text, params) || ""
            }
            return textEasy
        }).join("")
        let end = steps.find((step) => step.end)
        let choices = steps.find((step) => step.choices)
        let glueEnabled: boolean | PixiVNJsonConditionalStatements<boolean> | undefined = false
        let goNextStep: boolean | PixiVNJsonConditionalStatements<boolean> | undefined = false
        if (steps.length > 0) {
            glueEnabled = steps[steps.length - 1].glueEnabled
            goNextStep = steps[steps.length - 1].goNextStep
        }
        let labelToOpen = steps.find((step) => step.labelToOpen)
        let operation = steps.find((step) => step.operation)

        let res: PixiVNJsonLabelStep = {
            dialogue: character ? {
                character: character,
                text: dialogues
            } : dialogues,
            end: end?.end,
            choices: choices?.choices,
            glueEnabled: glueEnabled,
            goNextStep: goNextStep,
            labelToOpen: labelToOpen?.labelToOpen,
            operation: operation?.operation
        }
        return res as T
    }
}

/**
 * Get the result of the condition.
 * @param condition is the condition object
 * @returns the result of the condition
 */
function getConditionResult(condition: PixiVNJsonConditions, params: any[]): boolean {
    if (!condition) {
        return false
    }
    if (typeof condition !== "object" || !("type" in condition)) {
        if (condition) {
            return true
        }
        return false
    }
    switch (condition.type) {
        case "compare":
            let leftValue = getLogichValue<any>(condition.leftValue, params)
            let rightValue = getLogichValue<any>(condition.rightValue, params)
            switch (condition.operator) {
                case "==":
                    return leftValue === rightValue
                case "!=":
                    return leftValue !== rightValue
                case "<":
                    return leftValue < rightValue
                case "<=":
                    return leftValue <= rightValue
                case ">":
                    return leftValue > rightValue
                case ">=":
                    return leftValue >= rightValue
                case "CONTAINS":
                    return leftValue.toString().includes(rightValue.toString())
            }
            break
        case "valueCondition":
            return getLogichValue(condition.value, params) ? true : false
        case "union":
            return getUnionConditionResult(condition as PixiVNJsonUnionCondition, params)
        case "labelcondition":
            if ("operator" in condition && "label" in condition) {
                switch (condition.operator) {
                    case "started":
                        return narration.getTimesLabelOpened(condition.label as string) > 0
                    case "completed":
                        return narration.isLabelAlreadyCompleted(condition.label as string)
                }
            }
            break
    }
    if (condition) {
        return true
    }
    return false
}

/**
 * Get the value from the storage or the value.
 * @param value is the value to get
 * @returns the value from the storage or the value
 */
function getValue<T = any>(value: StorageElementType | PixiVNJsonValueGet, params: any[]): T | undefined {
    if (value && typeof value === "object") {
        if ("type" in value) {
            if (value.type === "value" && value.storageOperationType === "get") {
                switch (value.storageType) {
                    case "storage":
                    case "tempstorage":
                        return storage.getVariable((value as PixiVNJsonStorageGet).key) as unknown as T
                    case "flagStorage":
                        return getFlag((value as PixiVNJsonStorageGet).key) as unknown as T
                    case "label":
                        return narration.getTimesLabelOpened((value as PixiVNJsonLabelGet).label) as unknown as T
                    case "logic":
                        return getLogichValue((value as PixiVNJsonLogicGet).operation, params) as unknown as T
                    case "params":
                        if (params && params.length - 1 >= (value.key as number)) {
                            return params[(value.key as number)] as unknown as T
                        }
                        console.warn("[Pixi’VN Json] getValue params not found")
                        return undefined
                }
            }
        }
    }
    return value as T
}

/**
 * Get the result of the union condition.
 * @param condition is the union condition object
 * @returns the result of the union condition
 */
function getUnionConditionResult(condition: PixiVNJsonUnionCondition, params: any[]): boolean {
    if (condition.unionType === "not") {
        return !getLogichValue<boolean>(condition.condition, params)
    }
    let result: boolean = condition.unionType === "and" ? true : false
    for (let i = 0; i < condition.conditions.length; i++) {
        result = getLogichValue<boolean>(condition.conditions[i], params) || false
        if (condition.unionType === "and") {
            if (!result) {
                return false
            }
        } else {
            if (result) {
                return true
            }
        }
    }
    return result
}

export function setStorageJson(value: PixiVNJsonValueSet, params: any[]) {
    let v = getLogichValue<StorageElementType>(value.value, params)
    let valueToSet: StorageElementType
    if (v && typeof v === "object" && "type" in v) {
        valueToSet = getLogichValue<StorageElementType>(v, params)
    }
    else {
        valueToSet = v
    }
    switch (value.storageType) {
        case "flagStorage":
            setFlag(value.key, value.value)
            break
        case "storage":
            storage.setVariable(value.key, valueToSet)
            break
        case "tempstorage":
            storage.setTempVariable(value.key, valueToSet)
            break
        case "params":
            if (params && params.length - 1 >= (value.key as number)) {
                params[(value.key as number)] = valueToSet
            }
            break
    }
}

export function getLogichValue<T = StorageElementType>(
    value: T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions | PixiVNJsonConditionalStatements<T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions>,
    params: any[]
): T | undefined {
    let v = getValueFromConditionalStatements<T | PixiVNJsonValueGet | PixiVNJsonArithmeticOperations | PixiVNJsonConditions>(value, params)
    if (
        v && typeof v === "object" && "type" in v
    ) {
        switch (v.type) {
            case "value":
                return getValue<T>(v, params)
            case "arithmetic":
            case "arithmeticsingle":
                return getValueFromArithmeticOperations(v as PixiVNJsonArithmeticOperations, params)
            case "compare":
            case "valueCondition":
            case "union":
            case "labelcondition":
                return getConditionResult(v, params) as T
        }
    }
    return v as T
}
function getValueFromArithmeticOperations<T = StorageElementType>(operation: PixiVNJsonArithmeticOperations, params: any[]): T | undefined {
    let leftValue = getLogichValue(operation.leftValue, params)
    switch (operation.type) {
        case "arithmetic":
            let rightValue = getLogichValue(operation.rightValue, params)
            switch (operation.operator) {
                case "*":
                    return (leftValue as any) * (rightValue as any) as T
                case "/":
                    return (leftValue as any) / (rightValue as any) as T
                case "+":
                    return (leftValue as any) + (rightValue as any) as T
                case "-":
                    return (leftValue as any) - (rightValue as any) as T
                case "%":
                    return (leftValue as any) % (rightValue as any) as T
                case "POW":
                    return Math.pow(leftValue as any, rightValue as any) as T
                case "RANDOM":
                    return narration.getRandomNumber(leftValue as any, rightValue as any) as T
            }
        case "arithmeticsingle":
            switch (operation.operator) {
                case "INT":
                    return parseInt(leftValue as any) as T
                case "FLOOR":
                    return Math.floor(leftValue as any) as T
                case "FLOAT":
                    return parseFloat(leftValue as any) as T
            }
            break
    }
}