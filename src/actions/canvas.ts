import { logger } from "@/utils/log-utility";
import type {
    PixiVNJsonCanvasAnimate,
    PixiVNJsonCanvasClear,
    PixiVNJsonCanvasEffect,
    PixiVNJsonCanvasImageContainerShow,
    PixiVNJsonCanvasImageVideoShow,
    PixiVNJsonCanvasRemove,
    PixiVNJsonCanvasShow,
    PixiVNJsonCanvasTextShow,
    PixiVNJsonImageContainerEdit,
    PixiVNJsonImageEdit,
    PixiVNJsonMediaTransiotions,
    PixiVNJsonTextEdit,
    PixiVNJsonUnknownEdit,
    PixiVNJsonVideoEdit,
    PixiVNJsonVideoPauseResume,
} from "@drincs/pixi-vn-json/schema";
import type { UPDATE_PRIORITY } from "pixi.js";
import { translator } from "@drincs/pixi-vn-json/translator";
import {
    canvas,
    type ContainerChild,
    effects,
    type ContainerMemory,
    ImageContainer,
    ImageSprite,
    type ImageSpriteMemory,
    showImage,
    showImageContainer,
    showText,
    showVideo,
    Text,
    transitions,
    VideoSprite,
    type VideoSpriteMemory,
} from "@drincs/pixi-vn/canvas";

async function showCanvasElement(
    element: ImageSprite | VideoSprite | ImageContainer | Text,
    operation: PixiVNJsonCanvasShow,
    transition: PixiVNJsonMediaTransiotions,
) {
    const { alias } = operation;
    const { props, priority } = transition as { props?: any; priority?: UPDATE_PRIORITY };
    switch (transition.type) {
        case "fade":
            await transitions.showWithFade(alias, element, props, priority);
            break;
        case "dissolve":
            await transitions.showWithDissolve(alias, element, props, priority);
            break;
        case "movein":
        case "moveout":
            await transitions.moveIn(alias, element, props, priority);
            break;
        case "zoomin":
        case "zoomout":
            await transitions.zoomIn(alias, element, props, priority);
            break;
        case "pushin":
        case "pushout":
            await transitions.pushIn(alias, element, props, priority);
            break;
        case "wipein":
        case "wipeout":
            await transitions.wipeIn(alias, element, props, priority);
            break;
        case "irisin":
        case "irisout":
            await transitions.irisIn(alias, element, props, priority);
            break;
        case "splitin":
        case "splitout":
            await transitions.splitIn(alias, element, props, priority);
            break;
        case "blurin":
        case "blurout":
            await transitions.blurIn(alias, element, props, priority);
            break;
        case "pixelatein":
        case "pixelateout":
            await transitions.pixelateIn(alias, element, props, priority);
            break;
        case "flashin":
        case "flashout":
            await transitions.flashIn(alias, element, props, priority);
            break;
        case "glitchin":
        case "glitchout":
            await transitions.glitchIn(alias, element, props, priority);
            break;
        case "twistin":
        case "twistout":
            await transitions.twistIn(alias, element, props, priority);
            break;
        case "warpin":
        case "warpout":
            await transitions.warpIn(alias, element, props, priority);
            break;
        case "ripplein":
        case "rippleout":
            await transitions.rippleIn(alias, element, props, priority);
            break;
        case "noisedissolvein":
        case "noisedissolveout":
            await transitions.noiseDissolveIn(alias, element, props, priority);
            break;
        case "tvin":
        case "tvout":
            await transitions.tvIn(alias, element, props, priority);
            break;
        case "pinchin":
        case "pinchout":
            await transitions.pinchIn(alias, element, props, priority);
            break;
    }
}

function removeCanvasElement(operation: PixiVNJsonCanvasRemove) {
    const { transition, alias } = operation;
    if (!transition) {
        canvas.remove(alias);
        return;
    }
    const { props, priority } = transition as { props?: any; priority?: UPDATE_PRIORITY };
    switch (transition.type) {
        case "fade":
            transitions.removeWithFade(alias, props, priority);
            break;
        case "dissolve":
            transitions.removeWithDissolve(alias, props, priority);
            break;
        case "movein":
        case "moveout":
            transitions.moveOut(alias, props, priority);
            break;
        case "zoomin":
        case "zoomout":
            transitions.zoomOut(alias, props, priority);
            break;
        case "pushin":
        case "pushout":
            transitions.pushOut(alias, props, priority);
            break;
        case "wipein":
        case "wipeout":
            transitions.wipeOut(alias, props, priority);
            break;
        case "irisin":
        case "irisout":
            transitions.irisOut(alias, props, priority);
            break;
        case "splitin":
        case "splitout":
            transitions.splitOut(alias, props, priority);
            break;
        case "blurin":
        case "blurout":
            transitions.blurOut(alias, props, priority);
            break;
        case "pixelatein":
        case "pixelateout":
            transitions.pixelateOut(alias, props, priority);
            break;
        case "flashin":
        case "flashout":
            transitions.flashOut(alias, props, priority);
            break;
        case "glitchin":
        case "glitchout":
            transitions.glitchOut(alias, props, priority);
            break;
        case "twistin":
        case "twistout":
            transitions.twistOut(alias, props, priority);
            break;
        case "warpin":
        case "warpout":
            transitions.warpOut(alias, props, priority);
            break;
        case "ripplein":
        case "rippleout":
            transitions.rippleOut(alias, props, priority);
            break;
        case "noisedissolvein":
        case "noisedissolveout":
            transitions.noiseDissolveOut(alias, props, priority);
            break;
        case "tvin":
        case "tvout":
            transitions.tvOut(alias, props, priority);
            break;
        case "pinchin":
        case "pinchout":
            transitions.pinchOut(alias, props, priority);
            break;
    }
}

/**
 * Handles show, edit, and remove operations for {@link ImageSprite} canvas elements.
 *
 * @param operation - The image operation descriptor.
 */
export async function imageOperation(
    operation: PixiVNJsonCanvasImageVideoShow | PixiVNJsonImageEdit | PixiVNJsonCanvasRemove,
) {
    switch (operation.operationType) {
        case "show":
            if (operation.transition) {
                const imageToShow = new ImageSprite(
                    operation.props,
                    operation.url || operation.alias,
                );
                await showCanvasElement(imageToShow, operation, operation.transition);
            } else {
                await showImage(operation.alias, operation.url, operation.props);
            }
            break;
        case "edit": {
            const image = canvas.find<ImageSprite>(operation.alias);
            if (image) {
                if (operation.props) {
                    await image.setMemory({
                        ...image.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`Image with alias ${operation.alias} not found.`);
            }
            break;
        }
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}

/**
 * Handles show, edit, remove, pause, and resume operations for {@link VideoSprite} canvas elements.
 *
 * @param operation - The video operation descriptor.
 */
export async function videoOperation(
    operation:
        | PixiVNJsonCanvasRemove
        | PixiVNJsonCanvasImageVideoShow
        | PixiVNJsonVideoEdit
        | PixiVNJsonVideoPauseResume,
) {
    switch (operation.operationType) {
        case "show":
            if (operation.transition) {
                const videoToShow = new VideoSprite(
                    operation.props,
                    operation.url || operation.alias,
                );
                await showCanvasElement(videoToShow, operation, operation.transition);
            } else {
                await showVideo(operation.alias, operation.url, operation.props);
            }
            break;
        case "edit": {
            const video = canvas.find<VideoSprite>(operation.alias);
            if (video) {
                if (operation.props) {
                    await video.setMemory({
                        ...video.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`Video with alias ${operation.alias} not found.`);
            }
            break;
        }
        case "remove":
            removeCanvasElement(operation);
            break;
        case "pause":
        case "resume": {
            const video = canvas.find<VideoSprite>(operation.alias);
            if (video) {
                video.paused = operation.operationType === "pause";
            } else {
                logger.error(`Video with alias ${operation.alias} not found.`);
            }
            break;
        }
    }
}

/**
 * Handles show, edit, and remove operations for {@link ImageContainer} canvas elements.
 *
 * @param operation - The image-container operation descriptor.
 */
export async function imageContainerOperation(
    operation:
        | PixiVNJsonCanvasRemove
        | PixiVNJsonCanvasImageContainerShow
        | PixiVNJsonImageContainerEdit,
) {
    switch (operation.operationType) {
        case "show":
            if (operation.transition) {
                const imageContainerToShow = new ImageContainer(operation.props, operation.urls);
                await showCanvasElement(imageContainerToShow, operation, operation.transition);
            } else {
                await showImageContainer(operation.alias, operation.urls, operation.props);
            }
            break;
        case "edit": {
            const image = canvas.find<ImageContainer>(operation.alias);
            if (image) {
                if (operation.props) {
                    await image.setMemory({
                        ...image.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`ImageContainer with alias ${operation.alias} not found.`);
            }
            break;
        }
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}

/**
 * Handles show, edit, and remove operations for {@link Text} canvas elements.
 * On show, the text content is run through the active {@link translator} before display.
 *
 * @param operation - The text operation descriptor.
 */
export async function textOperation(
    operation: PixiVNJsonCanvasRemove | PixiVNJsonCanvasTextShow | PixiVNJsonTextEdit,
) {
    switch (operation.operationType) {
        case "show":
            operation.props = operation.props || {};
            operation.props.text = translator.t(operation.text);
            if (operation.transition) {
                const imageContainerToShow = new Text(operation.props);
                await showCanvasElement(imageContainerToShow, operation, operation.transition);
            } else {
                showText(operation.alias, operation.text, operation.props);
            }
            break;
        case "edit": {
            const image = canvas.find<Text>(operation.alias);
            if (image) {
                if (operation.props) {
                    await image.setMemory({
                        ...image.memory,
                        ...operation.props,
                    });
                }
            } else {
                logger.error(`Text with alias ${operation.alias} not found.`);
            }
            break;
        }
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}

/**
 * Handles edit and remove operations for any canvas element whose specific type is unknown.
 * Useful as a generic fallback when the element type is not determined at the call site.
 *
 * @param operation - The generic canvas-element operation descriptor.
 */
export async function canvasElementOperation(
    operation:
        | PixiVNJsonUnknownEdit<
              ImageSpriteMemory | VideoSpriteMemory | ContainerMemory<ContainerChild>
          >
        | PixiVNJsonCanvasRemove,
) {
    switch (operation.operationType) {
        case "edit":
            try {
                const unknown = canvas.find(operation.alias);
                if (unknown) {
                    if (operation.props) {
                        unknown.setMemory({
                            ...unknown.memory,
                            ...operation.props,
                        });
                    }
                } else {
                    logger.error(`Canvas Element with alias ${operation.alias} not found.`);
                }
            } catch (e) {
                logger.error(
                    `There was an error while trying to edit the canvas element with alias ${operation.alias}.`,
                    e,
                );
            }
            break;
        case "remove":
            removeCanvasElement(operation);
            break;
    }
}
/**
 * Handles generic canvas-wide operations (e.g. clearing every element).
 *
 * @param operation - The canvas operation descriptor.
 */
export function canvasOperation(operation: PixiVNJsonCanvasClear) {
    switch (operation.operationType) {
        case "clear":
            canvas.removeAll();
            break;
    }
}
/**
 * Applies a visual effect (e.g. shake) to a canvas element.
 *
 * @param operation - The canvas effect descriptor.
 */
export async function effectOperation(operation: PixiVNJsonCanvasEffect) {
    switch (operation.type) {
        case "shake":
            await effects.shakeEffect(operation.alias, operation.props, operation.priority);
            break;
        case "bounce":
            await effects.bounceEffect(operation.alias, operation.props, operation.priority);
            break;
        case "pulse":
            await effects.pulseEffect(operation.alias, operation.props, operation.priority);
            break;
        case "hop":
            await effects.hopEffect(operation.alias, operation.props, operation.priority);
            break;
        case "wiggle":
            await effects.wiggleEffect(operation.alias, operation.props, operation.priority);
            break;
        case "nod":
            await effects.nodEffect(operation.alias, operation.props, operation.priority);
            break;
        case "sway":
            await effects.swayEffect(operation.alias, operation.props, operation.priority);
            break;
        case "punch":
            await effects.punchEffect(operation.alias, operation.props, operation.priority);
            break;
        case "glitch":
            await effects.glitchEffect(operation.alias, operation.props, operation.priority);
            break;
        case "chromatic-aberration":
            await effects.chromaticAberrationEffect(
                operation.alias,
                operation.props,
                operation.priority,
            );
            break;
        case "shockwave":
            await effects.shockwaveEffect(operation.alias, operation.props, operation.priority);
            break;
        case "radial-blur":
            await effects.radialBlurEffect(operation.alias, operation.props, operation.priority);
            break;
        case "blur-pulse":
            await effects.blurPulseEffect(operation.alias, operation.props, operation.priority);
            break;
        case "vignette-pulse":
            await effects.vignettePulseEffect(operation.alias, operation.props, operation.priority);
            break;
        case "desaturate":
            await effects.desaturateEffect(operation.alias, operation.props, operation.priority);
            break;
        case "glow-pulse":
            await effects.glowPulseEffect(operation.alias, operation.props, operation.priority);
            break;
    }
}

/**
 * Starts a keyframe animation or animation sequence on a canvas element.
 *
 * @param operation - The animate operation descriptor.
 */
export function animateOperation(operation: PixiVNJsonCanvasAnimate) {
    switch (operation.type) {
        case "animate":
            canvas.animate(
                operation.alias,
                operation.keyframes,
                operation.options,
                operation.priority,
            );
            break;
        case "animate-sequence":
            canvas.animate(
                operation.alias,
                operation.sequence,
                operation.options,
                operation.priority,
            );
            break;
    }
}
