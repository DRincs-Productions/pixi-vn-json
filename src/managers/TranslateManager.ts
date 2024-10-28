import { PixiVNJsonChoice, PixiVNJsonChoices, PixiVNJsonConditionalResultToCombine, PixiVNJsonConditionalStatements, PixiVNJsonDialog, PixiVNJsonDialogText, PixiVNJsonLabelStep } from "../interface";

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
    getConditionalsThenElse<T>(data: PixiVNJsonConditionalStatements<T> | PixiVNJsonConditionalResultToCombine<T> | T, res: T[] = []): T[] {
        if (typeof data === "object" && data && "type" in data) {
            if (data.type === "ifelse") {
                if (data.then) {
                    this.getConditionalsThenElse(data.then, res);
                }
                if (data.else) {
                    this.getConditionalsThenElse(data.else, res);
                }
            }
            else if (data.type === "stepswitch") {
                if (data.elements) {
                    if (Array.isArray(data.elements)) {
                        data.elements.forEach((element) => {
                            this.getConditionalsThenElse(element, res);
                        });
                    }
                    else {
                        if (data.elements.type === "ifelse") {
                            let tempRes: T[][] = []
                            this.getConditionalsThenElse(data.elements, tempRes);
                            tempRes.forEach((item) => {
                                res.push(...item)
                            })
                        } else if (data.elements.type === "stepswitch") {
                            let tempRes: T[][] = []
                            this.getConditionalsThenElse(data.elements, tempRes);
                            tempRes.forEach((item) => {
                                res.push(...item)
                            })
                        } else {
                            this.getConditionalsThenElse(data.elements, res);
                        }
                    }
                }
            }
            else if (data.type === "resulttocombine") {
                if (data.firstItem) {
                    this.getConditionalsThenElse(data.firstItem, res);
                }
                if (data.secondConditionalItem) {
                    data.secondConditionalItem.forEach((item) => {
                        this.getConditionalsThenElse(item, res);
                    })
                }
            }
            else {
                res.push(data);
            }
        }
        else if (data) {
            res.push(data);
        }
        return res
    }

    generateNewTranslateFile(labels: PixiVNJsonLabelStep[], json: object = {}) {
        labels.forEach((label) => {
            if (label.choices) {
                let multichoices: PixiVNJsonChoices[] = []
                if (!Array.isArray(label.choices)) {
                    multichoices = this.getConditionalsThenElse(label.choices)
                }
                else {
                    multichoices = [label.choices]
                }
                multichoices.forEach((c) => c.forEach((choice) => {
                    if ("type" in choice) {
                        let res: PixiVNJsonChoice[] = []
                        if (choice.type === "ifelse" || choice.type === "stepswitch") {
                            this.getConditionalsThenElse(choice, res)
                        }
                        else {
                            res = [choice]
                        }
                        let texts = res.map((item) => this.getConditionalsThenElse(item.text))
                        texts.forEach((text) => {
                            if (Array.isArray(text)) {
                                text.forEach((t) => {
                                    if (Array.isArray(t)) {
                                        t.forEach((tt) => {
                                            if (typeof tt === "string") {
                                                this.addKey(json, tt)
                                            }
                                            else {
                                                this.getConditionalsThenElse(tt).forEach((t) => {
                                                    if (Array.isArray(t)) {
                                                        t.forEach((tt) => {
                                                            if (typeof tt === "string") {
                                                                this.addKey(json, tt)
                                                            }
                                                        })
                                                    }
                                                    else if (typeof t === "string") {
                                                        this.addKey(json, t)
                                                    }
                                                })
                                            }
                                        })
                                    }
                                    else if (typeof t === "string") {
                                        this.addKey(json, t)
                                    }
                                })
                            }
                        })
                    }
                }))
            }
            if (label.dialogue) {
                let dialogues: PixiVNJsonDialog<PixiVNJsonDialogText>[] = []
                if (!Array.isArray(label.dialogue)) {
                    dialogues = this.getConditionalsThenElse(label.dialogue)
                }
                else {
                    dialogues = [label.dialogue]
                }
                dialogues.forEach((dialogue) => {
                    if (typeof dialogue === "string") {
                        this.addKey(json, dialogue)
                    }
                    else if ("text" in dialogue) {
                        if (Array.isArray(dialogue.text)) {
                            dialogue.text.forEach((text) => {
                                if (typeof text === "string") {
                                    this.addKey(json, text)
                                }
                                else {
                                    let t = this.getConditionalsThenElse(text)
                                    t.forEach((tt) => {
                                        if (typeof tt === "string") {
                                            this.addKey(json, tt)
                                        }
                                        else if (Array.isArray(tt)) {
                                            tt.forEach((ttt) => {
                                                if (typeof ttt === "string") {
                                                    this.addKey(json, ttt)
                                                }
                                                else {
                                                    this.getConditionalsThenElse(ttt).forEach((t) => {
                                                        if (typeof t === "string") {
                                                            this.addKey(json, t)
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
            }
            if (label.conditionalStep) {
                let l = this.getConditionalsThenElse(label.conditionalStep)
                l.forEach((item) => {
                    if (Array.isArray(item)) {
                        this.generateNewTranslateFile(item, json)
                    }
                    else {
                        this.generateNewTranslateFile([item], json)
                    }
                })
            }
        });
        return json;
    }
}
