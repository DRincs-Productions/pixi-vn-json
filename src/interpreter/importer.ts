import type { LabelJsonOptions } from "@/interpreter/LabelJson";
import LabelJson from "@/interpreter/LabelJson";
import { runInitialOperation } from "@/interpreter/operation-utility";
import { logger } from "@/utils/log-utility";
import type { PixiVNJson, PixiVNJsonLabelStep } from "@drincs/pixi-vn-json/schema";
import { RegisteredLabels } from "@drincs/pixi-vn/narration";

/**
 * Import a Pixi'VN JSON to the system.
 * This feature was created to give other developers the ability to create tools that can generate Pixi'VN labels or that generate Pixi'VN after extracting information from a programming language designed for writing narratives.
 * @param values The Pixi'VN JSON to be imported
 * @returns
 */
export async function importPixiVNJson(
    values: PixiVNJson | string | (PixiVNJson | string)[],
    options: LabelJsonOptions = {},
) {
    if (!Array.isArray(values)) {
        if (typeof values === "object" || typeof values === "string") {
            values = [values];
        } else {
            logger.error("Error parsing imported Pixi'VN JSON: data is not an object");
            return;
        }
    }

    const jsons: PixiVNJson[] = values.map((data) => {
        if (typeof data === "string") {
            try {
                return JSON.parse(data) as PixiVNJson;
            } catch (e) {
                logger.error("Error parsing imported Pixi'VN JSON", e);
                return {} as PixiVNJson;
            }
        }
        return data;
    });

    const promises1 = jsons.map(async (data) => {
        if (data.initialOperations) {
            for (const operation of data.initialOperations) {
                if (
                    operation.type === "value" &&
                    (typeof operation.value !== "object" ||
                        !operation.value ||
                        !("type" in operation.value))
                ) {
                    runInitialOperation(operation);
                }
            }
        }
        return Promise.resolve();
    });

    await Promise.all(promises1);

    const promises2 = jsons.map(async (data) => {
        if (data.initialOperations) {
            for (const operation of data.initialOperations) {
                if (
                    operation.type !== "value" ||
                    (operation.type === "value" &&
                        typeof operation.value === "object" &&
                        operation.value &&
                        "type" in operation.value)
                ) {
                    runInitialOperation(operation);
                }
            }
        }
        if (data.labels) {
            const labels = data.labels;
            for (const labelId in labels) {
                try {
                    const steps: PixiVNJsonLabelStep[] = labels[labelId];
                    const label = new LabelJson(labelId, steps, undefined, options);
                    RegisteredLabels.add(label);
                } catch (e) {
                    logger.error(`Error creating JSON label ${labelId}`, e);
                }
            }
        }
        return Promise.resolve();
    });

    await Promise.all(promises2);
}
