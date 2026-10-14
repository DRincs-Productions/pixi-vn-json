import type { PixiVNJsonSound } from "@drincs/pixi-vn-json/schema";
import { sound } from "@drincs/pixi-vn/sound";

/**
 * Handles all sound operations: play, stop, pause, resume, and property editing.
 * Supports targeting individual sounds, channels, or all sounds at once.
 *
 * @param operation - The sound operation descriptor.
 */
export function soundOperation(operation: PixiVNJsonSound) {
    switch (operation.operationType) {
        case "play":
            if (operation.url) {
                sound.play(operation.alias, operation.url, operation.props);
            } else {
                sound.play(operation.alias, operation.props);
            }
            break;
        case "stop":
            switch (operation.type) {
                case "sound":
                    sound.stop(operation.alias);
                    break;
                case "all":
                    sound.stopAll();
                    break;
            }
            break;
        case "pause":
            switch (operation.type) {
                case "sound":
                    sound.pause(operation.alias);
                    break;
                case "channel":
                    sound.channels.find(operation.alias).pauseAll();
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
                    sound.channels.find(operation.alias).resumeAll();
                    break;
                case "all":
                    sound.resumeAll();
                    break;
            }
            break;
        case "edit": {
            const mediaInstance = sound.find(operation.alias);
            if (!mediaInstance) break;
            for (const [key, value] of Object.entries(operation.props)) {
                switch (key) {
                    case "volume":
                        mediaInstance.volume.value = value as number;
                        break;
                    case "playbackRate":
                        mediaInstance.playbackRate = value as number;
                        break;
                    case "mute":
                        mediaInstance.mute = value as boolean;
                        break;
                    case "loop":
                        mediaInstance.loop = value as boolean;
                        break;
                    case "paused":
                        mediaInstance.paused = value as boolean;
                        break;
                }
            }
            break;
        }
    }
}
