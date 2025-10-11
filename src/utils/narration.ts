import { narration } from "@drincs/pixi-vn/narration";
import type { PixiVNJsonNarration } from "../interface";

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
