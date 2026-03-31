import { sound } from "@drincs/pixi-vn/sound";
import { PixiVNJsonSound } from "../interface";
import { PixiVNJsonSoundEdit } from "../interface/PixiVNJsonSound";

export function soundOperation(operation: PixiVNJsonSound) {
    switch (operation.operationType) {
        case "play":
            sound.play(operation.alias, operation.props);
            break;
        case "stop":
            sound.stop(operation.alias);
            break;
        case "pause":
            switch (operation.type) {
                case "sound":
                    sound.pause(operation.alias);
                    break;
                case "channel":
                    sound.findChannel(operation.alias).pauseAll();
                    break;
                case "all":
                    sound.pauseAll();
                    break;
            }
            break;
        case "resume":
            switch (operation.type) {
                case "sound":
                    sound.resume(operation.alias);
                    break;
                case "channel":
                    sound.findChannel(operation.alias).resumeAll();
                    break;
                case "all":
                    sound.resumeAll();
                    break;
            }
            break;
        case "edit":
            Object.entries(operation.props).forEach(([key, value]) => {
                const mediaInstance = sound.find(operation.alias);
                if (mediaInstance) {
                    mediaInstance.set(key as keyof PixiVNJsonSoundEdit["props"], value);
                }
            });
            break;
    }
}
