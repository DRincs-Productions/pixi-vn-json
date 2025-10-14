import { RegisteredLabels } from "@drincs/pixi-vn/narration";
import { LabelJson } from ".";
import { PixiVNJson, PixiVNJsonLabelStep } from "../interface";
import { logger } from "../utils/log-utility";
import { LabelJsonOptions } from "./LabelJson";
import { runInitialOperation } from "./operation-utility";

/**
 * Import a Pixi'VN JSON to the system.
 * This feature was created to give other developers the ability to create tools that can generate Pixi'VN labels or that generate Pixi'VN after extracting information from a programming language designed for writing narratives.
 * @param values The Pixi'VN JSON to be imported
 * @returns
 */
export async function importPixiVNJson(
    values: PixiVNJson | string | (PixiVNJson | string)[],
    options: LabelJsonOptions = {}
) {
    if (!Array.isArray(values)) {
        if (typeof values === "object" || typeof values === "string") {
            values = [values];
        } else {
            logger.error("Error parsing imported Pixi'VN JSON: data is not an object");
            return;
        }
    }

    const jsonsPromises: Promise<PixiVNJson>[] = values.map(async (data) => {
        if (typeof data === "string") {
            try {
                data = JSON.parse(data) as PixiVNJson;
            } catch (e) {
                logger.error("Error parsing imported Pixi'VN JSON", e);
                data = {};
            }
        }
        return data;
    });
    const jsons = await Promise.all(jsonsPromises);

    const promises = jsons.map(async (data) => {
        const promises: Promise<void>[] = [];
        if (data.initialOperations) {
            for (let operation of data.initialOperations) {
                runInitialOperation(operation);
            }
        }
        if (data.labels) {
            let labels = data.labels;
            for (const labelId in labels) {
                try {
                    const steps: PixiVNJsonLabelStep[] = labels[labelId];
                    let label = new LabelJson(labelId, steps, undefined, options);
                    RegisteredLabels.add(label);
                } catch (e) {
                    logger.error(`Error creating JSON label ${labelId}`, e);
                }
            }
        }
        return Promise.all(promises);
    });

    await Promise.all(promises);
}
