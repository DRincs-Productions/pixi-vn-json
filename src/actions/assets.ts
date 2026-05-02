import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import type {
    PixiVNJsonIfElse,
    PixiVNJsonOperation,
    PixiVNJsonOperationString,
} from "@drincs/pixi-vn-json/schema";
import { Assets } from "@drincs/pixi-vn/canvas";

export async function loadAssets(
    origin: PixiVNJsonOperation | PixiVNJsonIfElse<PixiVNJsonOperation> | PixiVNJsonOperationString,
) {
    const operation = JsonUnifier.getLogichValue<PixiVNJsonOperation | PixiVNJsonOperationString>(
        origin,
        {},
    );
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
