import { Assets } from "@drincs/pixi-vn";
import { PixiVNJsonIfElse, PixiVNJsonOperation } from "../interface";
import { PixiVNJsonOperationString } from "../interface/PixiVNJsonOperations";
import { getLogichValue } from "./utility";

export async function loadAssets(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString
) {
    let operation = getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(origin);
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
