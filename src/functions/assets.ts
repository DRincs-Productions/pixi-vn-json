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
                    await Assets.load(operation.aliases);
                    break;
                case "lazyload":
                    Assets.backgroundLoad(operation.aliases);
                    break;
            }
            break;
        case "bundle":
            switch (operation.operationType) {
                case "load":
                    await Assets.loadBundle(operation.aliases);
                    break;
                case "lazyload":
                    Assets.backgroundLoadBundle(operation.aliases);
                    break;
            }
            break;
    }
}
