import { saveLabel } from "@drincs/pixi-vn"
import { LabelJson } from "../classes"
import { PixiVNJson, PixiVNJsonLabelStep } from "../interface"
import { PixiVNJsonOperation } from "../interface/PixiVNJsonOperations"
import { runOperation } from "./operationUtility"

/**
 * Import a Pixi'VN JSON to the system.
 * This feature was created to give other developers the ability to create tools that can generate Pixi'VN labels or that generate Pixi'VN after extracting information from a programming language designed for writing narratives.
 * @param data The Pixi'VN JSON to be imported
 * @returns
 */
export function importPixiVNJson(
    data: PixiVNJson | string,
    operationStringConvert?: (value: string) => PixiVNJsonOperation | undefined
) {
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
            runOperation(operation, [], operationStringConvert)
        }
    }
    if (data.labels) {
        let labels = data.labels
        for (const labelId in labels) {
            try {
                const steps: PixiVNJsonLabelStep[] = labels[labelId]
                let label = new LabelJson(labelId, steps, undefined, operationStringConvert)
                saveLabel(label)
            }
            catch (e) {
                console.error(`[Pixi’VN Json] Error creating JSON label ${labelId}`, e)
            }
        }
    }
}
