import { saveLabel, StorageManagerStatic } from "@drincs/pixi-vn"
import { LabelJson } from "../classes"
import { LabelJsonOptions } from "../classes/LabelJson"
import { PixiVNJson, PixiVNJsonLabelStep } from "../interface"
import { runOperation } from "./operation-utility"

/**
 * Import a Pixi'VN JSON to the system.
 * This feature was created to give other developers the ability to create tools that can generate Pixi'VN labels or that generate Pixi'VN after extracting information from a programming language designed for writing narratives.
 * @param data The Pixi'VN JSON to be imported
 * @returns
 */
export function importPixiVNJson(
    data: PixiVNJson | string,
    options: LabelJsonOptions = {}
) {
    let operationStringConvert = options?.operationStringConvert
    try {
        if (typeof data === "string") {
            data = JSON.parse(data) as PixiVNJson
        }
    }
    catch (e) {
        console.error("[Pixi’VN Json] Error parsing imported Pixi'VN JSON", e)
        return
    }
    if (typeof data !== "object") {
        console.error("[Pixi’VN Json] Error parsing imported Pixi'VN JSON: data is not an object")
        return
    }
    if (data.initialOperations) {
        for (let operation of data.initialOperations) {
            runOperation(operation, operationStringConvert ? (value) => operationStringConvert(value, {}, {}) : undefined)
        }
        StorageManagerStatic.saveStorageAsBasicStorage()
    }
    if (data.labels) {
        let labels = data.labels
        for (const labelId in labels) {
            try {
                const steps: PixiVNJsonLabelStep[] = labels[labelId]
                let label = new LabelJson(labelId, steps, undefined, options)
                saveLabel(label)
            }
            catch (e) {
                console.error(`[Pixi’VN Json] Error creating JSON label ${labelId}`, e)
            }
        }
    }
}
