import { narration, storage, StorageElementType } from "@drincs/pixi-vn";
import { PIXIVNJSON_PARAM_ID } from "../constants";
import { getLogichValue } from "../functions";
import { PixiVNJsonValueSet } from "../interface";

export function setStorageValue(value: PixiVNJsonValueSet) {
    let v = getLogichValue<StorageElementType>(value.value);
    let valueToSet: StorageElementType;
    if (v && typeof v === "object" && "type" in v) {
        valueToSet = getLogichValue<StorageElementType>(v);
    } else {
        valueToSet = v;
    }
    switch (value.storageType) {
        case "flagStorage":
            storage.setFlag(value.key, value.value);
            break;
        case "storage":
            storage.setVariable(value.key, valueToSet);
            break;
        case "tempstorage":
            storage.setTempVariable(value.key, valueToSet);
            break;
        case "params":
            let params: any[] = storage.getVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`) || [];
            if (params && params.length - 1 >= (value.key as number)) {
                params[value.key as number] = valueToSet;
            }
            storage.setTempVariable(`${PIXIVNJSON_PARAM_ID}${narration.openedLabels.length - 1}`, params);
            break;
    }
}
