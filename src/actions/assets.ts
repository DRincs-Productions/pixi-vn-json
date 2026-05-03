import { JsonUnifier } from "@drincs/pixi-vn-json/core";
import type {
    PixiVNJsonIfElse,
    PixiVNJsonOperation,
    PixiVNJsonOperationString,
} from "@drincs/pixi-vn-json/schema";
import { Assets } from "@drincs/pixi-vn/canvas";

/**
 * Loads or lazily-loads asset bundles/aliases described by a JSON operation.
 * Supports both individual asset aliases (`type: "assets"`) and named bundles
 * (`type: "bundle"`), each with `"load"` (blocking) or `"lazyload"` (background) variants.
 *
 * @param origin - The operation or conditional expression that describes what to load.
 */
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
