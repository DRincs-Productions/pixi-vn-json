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
}
