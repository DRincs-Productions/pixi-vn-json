import {
    PixiVNJsonChoice,
    PixiVNJsonChoices,
    PixiVNJsonConditionalResultToCombine,
    PixiVNJsonConditionalStatements,
    PixiVNJsonDialog,
    PixiVNJsonDialogText,
    PixiVNJsonLabelStep,
    PixiVNJsonOperation,
} from "../interface";
import { operationStringToString } from "../utils/operationtoconvert";

export default class TranslatorManager {
    private static _beforeToTranslate: ((key: string) => string) | undefined = undefined;
    private static _translate: (key: string) => string = (key: string) => key;
    private static _afterToTranslate: ((key: string) => string) | undefined = undefined;
    static t<T = string | string[]>(key: T): T {
        if (Array.isArray(key)) {
            return key.map((k?: string) => TranslatorManager.translate(`${k}`)) as T;
        }
        return TranslatorManager.translate(`${key}`) as T;
    }
    static set beforeToTranslate(value: (key: string) => string) {
        TranslatorManager._beforeToTranslate = value;
    }
    static set translate(value: (key: string) => string) {
        TranslatorManager._translate = value;
    }
    static get translate(): (key: string) => string {
        return (key: string) => {
            let text = key;
            if (TranslatorManager._beforeToTranslate) {
                text = TranslatorManager._beforeToTranslate(text);
            }
            text = TranslatorManager._translate(text);
            if (TranslatorManager._afterToTranslate) {
                text = TranslatorManager._afterToTranslate(text);
            }
            return text;
        };
    }
    static set afterToTranslate(value: (key: string) => string) {
        TranslatorManager._afterToTranslate = value;
    }

    private static addKey(
        json: any,
        key: string[] | string,
        options: {
            defaultValue: "empty_string" | "copy_key";
        }
    ) {
        let defaultValue = options.defaultValue || "empty_string";
        if (typeof key === "string") {
            key = [key];
        }
        if (Array.isArray(key)) {
            key.forEach((k) => {
                if (json[k] === undefined) {
                    if (defaultValue === "empty_string") {
                        json[k] = "";
                    } else if (defaultValue === "copy_key") {
                        if (TranslatorManager._beforeToTranslate) {
                            json[k] = TranslatorManager._beforeToTranslate(k);
                        } else {
                            json[k] = k;
                        }
                    }
                }
            });
        }
    }
    private static getConditionalsThenElse<T>(
        data: PixiVNJsonConditionalStatements<T> | PixiVNJsonConditionalResultToCombine<T> | T,
        res: T[] = []
    ): T[] {
        if (typeof data === "object" && data && "type" in data) {
            if (data.type === "ifelse") {
                if (data.then) {
                    TranslatorManager.getConditionalsThenElse(data.then, res);
                }
                if (data.else) {
                    TranslatorManager.getConditionalsThenElse(data.else, res);
                }
            } else if (data.type === "stepswitch") {
                if (data.elements) {
                    if (Array.isArray(data.elements)) {
                        data.elements.forEach((element) => {
                            TranslatorManager.getConditionalsThenElse(element, res);
                        });
                    } else {
                        if (data.elements.type === "ifelse") {
                            let tempRes: T[][] = [];
                            TranslatorManager.getConditionalsThenElse(data.elements, tempRes);
                            tempRes.forEach((item) => {
                                res.push(...item);
                            });
                        } else if (data.elements.type === "stepswitch") {
                            let tempRes: T[][] = [];
                            TranslatorManager.getConditionalsThenElse(data.elements, tempRes);
                            tempRes.forEach((item) => {
                                res.push(...item);
                            });
                        } else {
                            TranslatorManager.getConditionalsThenElse(data.elements, res);
                        }
                    }
                }
            } else if (data.type === "resulttocombine") {
                if (data.firstItem) {
                    TranslatorManager.getConditionalsThenElse(data.firstItem, res);
                }
                if (data.secondConditionalItem) {
                    data.secondConditionalItem.forEach((item) => {
                        TranslatorManager.getConditionalsThenElse(item, res);
                    });
                }
            } else {
                res.push(data);
            }
        } else if (data) {
            res.push(data);
        }
        return res;
    }

    /**
     * Generates a JSON translation object from the provided labels.
     * @param labels The labels to translate.
     * @param json The JSON object to populate with translations.
     * @param options Options for translation, including default value handling.
     * @returns The populated JSON object with translations.
     */
    static async generateJsonTranslation(
        labels: PixiVNJsonLabelStep[],
        json: object = {},
        options: {
            /**
             * Default value to use when a key is not found.
             * - "empty_string": Use an empty string as the default value.
             * - "copy_key": Use the key itself as the default value.
             * @default "copy_key"
             */
            defaultValue?: "empty_string" | "copy_key";
            operationStringConvert?: (value: string) => Promise<PixiVNJsonOperation | undefined>;
        } = {}
    ) {
        const { defaultValue = "copy_key", operationStringConvert } = options;
        let promises = labels.map(async (label) => {
            if (label.choices) {
                let multichoices: PixiVNJsonChoices[] = [];
                if (!Array.isArray(label.choices)) {
                    multichoices = TranslatorManager.getConditionalsThenElse(label.choices);
                } else {
                    multichoices = [label.choices];
                }
                multichoices.forEach((c) =>
                    c.forEach((choice) => {
                        if ("type" in choice) {
                            let res: PixiVNJsonChoice[] = [];
                            if (choice.type === "ifelse" || choice.type === "stepswitch") {
                                TranslatorManager.getConditionalsThenElse(choice, res);
                            } else {
                                res = [choice];
                            }
                            let texts = res.map((item) => TranslatorManager.getConditionalsThenElse(item.text));
                            texts.forEach((text) => {
                                if (Array.isArray(text)) {
                                    text.forEach((t) => {
                                        if (Array.isArray(t)) {
                                            t.forEach((tt) => {
                                                if (typeof tt === "string") {
                                                    TranslatorManager.addKey(json, tt, { defaultValue });
                                                } else {
                                                    TranslatorManager.getConditionalsThenElse(tt).forEach((t) => {
                                                        if (Array.isArray(t)) {
                                                            t.forEach((tt) => {
                                                                if (typeof tt === "string") {
                                                                    TranslatorManager.addKey(json, tt, {
                                                                        defaultValue,
                                                                    });
                                                                }
                                                            });
                                                        } else if (typeof t === "string") {
                                                            TranslatorManager.addKey(json, t, { defaultValue });
                                                        }
                                                    });
                                                }
                                            });
                                        } else if (typeof t === "string") {
                                            TranslatorManager.addKey(json, t, { defaultValue });
                                        }
                                    });
                                }
                            });
                        }
                    })
                );
            }
            if (label.dialogue) {
                let dialogues: PixiVNJsonDialog<PixiVNJsonDialogText>[] = [];
                if (!Array.isArray(label.dialogue)) {
                    dialogues = TranslatorManager.getConditionalsThenElse(label.dialogue);
                } else {
                    dialogues = [label.dialogue];
                }
                dialogues.forEach((dialogue) => {
                    if (typeof dialogue === "string") {
                        TranslatorManager.addKey(json, dialogue, { defaultValue });
                    } else if ("text" in dialogue) {
                        let text = TranslatorManager.getConditionalsThenElse(dialogue.text);
                        if (typeof text === "string") {
                            text = [text];
                        }
                        text.forEach((text) => {
                            if (typeof text === "string") {
                                TranslatorManager.addKey(json, text, { defaultValue });
                            } else {
                                let t = TranslatorManager.getConditionalsThenElse(text);
                                t.forEach((tt) => {
                                    if (typeof tt === "string") {
                                        TranslatorManager.addKey(json, tt, { defaultValue });
                                    } else if (Array.isArray(tt)) {
                                        tt.forEach((ttt) => {
                                            if (typeof ttt === "string") {
                                                TranslatorManager.addKey(json, ttt, { defaultValue });
                                            } else {
                                                TranslatorManager.getConditionalsThenElse(ttt).forEach((t) => {
                                                    if (typeof t === "string") {
                                                        TranslatorManager.addKey(json, t, { defaultValue });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            if (label.operations) {
                for (let operation of label.operations) {
                    if (operation.type === "operationtoconvert" && operationStringConvert) {
                        let stringOperation = operationStringToString(operation);
                        let res = await operationStringConvert(stringOperation);
                        if (!res) {
                            return;
                        }
                        operation = res;
                    }
                    switch (operation.type) {
                        case "text":
                            switch (operation.operationType) {
                                case "show":
                                    TranslatorManager.addKey(json, operation.text, { defaultValue });
                                    break;
                            }
                            break;
                    }
                }
            }
            if (label.conditionalStep) {
                let l = TranslatorManager.getConditionalsThenElse(label.conditionalStep);
                l.forEach((item) => {
                    if (Array.isArray(item)) {
                        TranslatorManager.generateJsonTranslation(item, json, options);
                    } else {
                        TranslatorManager.generateJsonTranslation([item], json, options);
                    }
                });
            }
        });
        await Promise.all(promises);
        return json;
    }
}
