import type { PixiVNJsonNarration } from "@drincs/pixi-vn-json/schema";
import { narration } from "@drincs/pixi-vn/narration";

export function narrationOperation(operation: PixiVNJsonNarration) {
    switch (operation.type) {
        case "input":
            narration.requestInput({ type: operation.valueType }, operation.defaultValue);
            break;
        case "dialogue":
            narration.dialogue = undefined;
            break;
    }
}
