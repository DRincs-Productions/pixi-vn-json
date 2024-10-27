import { PixiVNJsonLabelStep } from "../interface";

export default class TranslatorManager {
    private static _translate: (key: string) => string = (key: string) => key;
    static t<T = string | string[]>(key: T): T {
        if (Array.isArray(key)) {
            return key.map((k?: string) => TranslatorManager._translate(`${k}`)) as T;
        }
        return TranslatorManager._translate(`${key}`) as T;
    }
    static set translate(value: (key: string) => string) {
        TranslatorManager._translate = value;
    }

    addKey(json: any, key: string[] | string) {
        if (typeof key === "string") {
            key = [key];
        }
        if (Array.isArray(key)) {
            key.forEach((k) => {
                if (json[k] === undefined) {
                    json[k] = "";
                }
            });
        }
    }
    generateNewTranslateFile(labels: PixiVNJsonLabelStep[], json: object = {}) {
        labels.forEach((label) => {
            if (label.choices) {
                if (Array.isArray(label.choices)) {
                    label.choices.forEach((choice) => {
                        if ("text" in choice) {
                            this.addKey(json, choice.text);
                        }
                    });
                }
            }
        });
        return json;
    }
}
