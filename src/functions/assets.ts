import { Assets } from "@drincs/pixi-vn";
import { PixiVNJsonIfElse, PixiVNJsonOperationBase } from "../interface";
import { PixiVNJsonOperationString } from "../interface/PixiVNJsonOperations";
import { getLogichValue } from "./utility";

export async function loadAssets(
    origin: PixiVNJsonOperationBase | PixiVNJsonIfElse<PixiVNJsonOperationBase> | PixiVNJsonOperationString
) {
    let operation = getLogichValue<PixiVNJsonOperationBase | PixiVNJsonOperationString>(origin);
    if (!operation) {
        return;
    }
    switch (operation.type) {
        case "assets":
            switch (operation.operationType) {
                case "load":
                    await Assets.load(operation.assets);
                    break;
            }
            break;
    }
}
