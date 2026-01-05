import { sound } from "@drincs/pixi-vn/sound";
import { PixiVNJsonSound } from "../interface";

export function soundOperation(operation: PixiVNJsonSound) {
    switch (operation.operationType) {
        case "play":
            sound.play(operation.alias, operation.props);
            break;
        case "stop":
            sound.stop(operation.alias);
            break;
        case "pause":
            sound.pause(operation.alias);
            break;
        case "resume":
            sound.resume(operation.alias);
            break;
        case "volume":
            sound.volume(operation.alias, operation.value);
            break;
    }
}
