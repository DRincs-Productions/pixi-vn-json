import { AssetsManifest, RegisteredLabels, storage, StorageElementType } from "@drincs/pixi-vn";
import objectMerge from "object-merge";
import { LabelJson } from "../classes";
import { LabelJsonOptions } from "../classes/LabelJson";
import { PixiVNJson, PixiVNJsonLabelStep } from "../interface";
import { logger } from "../utils/log-utility";
import { runOperation } from "./operation-utility";

async function mergeManifests(baseManifest: AssetsManifest | {} = {}, jsons: PixiVNJson[]): Promise<AssetsManifest> {
    const manifests: object[] = [baseManifest];
    jsons.forEach((json) => {
        if (json.manifest) {
            manifests.push(json.manifest);
        }
    });
    return objectMerge(...manifests) as AssetsManifest;
}

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
    const { operationStringConvert, baseManifest, createManifest, skipEmptyDialogs } = options;

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
            data.initialOperations.forEach((operation) => {
                let promise = runOperation(
                    operation,
                    operationStringConvert ? (value) => operationStringConvert(value, {}, {}) : undefined
                );
                promises.push(promise);
            });
            let basicStorage: {
                [key: string]: StorageElementType;
            } = {};
            [...storage.storage.keys()].forEach((value, key) => {
                basicStorage[value] = storage.storage.get(value);
            });
            storage.startingStorage = basicStorage;
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
    if (createManifest) {
        const manifestPromise = mergeManifests(baseManifest, jsons);
        let res = await Promise.all([manifestPromise, ...promises]);
        const manifest = res[0];
        createManifest(manifest);
    } else {
        await Promise.all(promises);
    }
}
