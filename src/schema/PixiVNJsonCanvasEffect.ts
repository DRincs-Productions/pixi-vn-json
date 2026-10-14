import type {
    BlurPulseEffectProps,
    BounceEffectProps,
    ChromaticAberrationEffectProps,
    DesaturateEffectProps,
    GlitchEffectProps,
    GlowPulseEffectProps,
    HopEffectProps,
    NodEffectProps,
    PulseEffectProps,
    PunchEffectProps,
    RadialBlurEffectProps,
    ShakeEffectProps,
    ShockwaveEffectProps,
    SwayEffectProps,
    VignettePulseEffectProps,
    WiggleEffectProps,
} from "@drincs/pixi-vn";
import type { UPDATE_PRIORITY } from "pixi.js";

/**
 * Applies a shake effect to a canvas element.
 */
export type PixiVNJsonEffectShake = {
    type: "shake";
    /**
     * Alias of the canvas element to apply the shake effect to.
     */
    alias: string;
    /**
     * Configuration properties for the shake effect (amplitude, duration, etc.).
     */
    props: ShakeEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Bounces a canvas element.
 */
export type PixiVNJsonEffectBounce = {
    type: "bounce";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: BounceEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Pulses (repeated, decaying scale bump) a canvas element.
 */
export type PixiVNJsonEffectPulse = {
    type: "pulse";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: PulseEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Hops a canvas element.
 */
export type PixiVNJsonEffectHop = {
    type: "hop";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: HopEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Wiggles a canvas element.
 */
export type PixiVNJsonEffectWiggle = {
    type: "wiggle";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: WiggleEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Nods a canvas element.
 */
export type PixiVNJsonEffectNod = {
    type: "nod";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: NodEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Sways a canvas element.
 */
export type PixiVNJsonEffectSway = {
    type: "sway";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: SwayEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Punches a canvas element.
 */
export type PixiVNJsonEffectPunch = {
    type: "punch";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: PunchEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a glitch effect to a canvas element.
 */
export type PixiVNJsonEffectGlitch = {
    type: "glitch";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: GlitchEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a chromatic aberration effect to a canvas element.
 */
export type PixiVNJsonEffectChromaticAberration = {
    type: "chromatic-aberration";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: ChromaticAberrationEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a shockwave effect to a canvas element.
 */
export type PixiVNJsonEffectShockwave = {
    type: "shockwave";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: ShockwaveEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a radial blur effect to a canvas element.
 */
export type PixiVNJsonEffectRadialBlur = {
    type: "radial-blur";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: RadialBlurEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a blur pulse effect to a canvas element.
 */
export type PixiVNJsonEffectBlurPulse = {
    type: "blur-pulse";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: BlurPulseEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a vignette pulse effect to a canvas element.
 */
export type PixiVNJsonEffectVignettePulse = {
    type: "vignette-pulse";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: VignettePulseEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a desaturate effect to a canvas element.
 */
export type PixiVNJsonEffectDesaturate = {
    type: "desaturate";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: DesaturateEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Applies a glow pulse effect to a canvas element.
 */
export type PixiVNJsonEffectGlowPulse = {
    type: "glow-pulse";
    /**
     * Alias of the canvas element to apply the effect to.
     */
    alias: string;
    /**
     * Configuration properties for the effect.
     */
    props?: GlowPulseEffectProps;
    /**
     * Pixi.js update priority for the effect ticker callback.
     */
    priority?: UPDATE_PRIORITY;
};

/**
 * Union of all canvas visual effects.
 */
type PixiVNJsonCanvasEffect =
    | PixiVNJsonEffectShake
    | PixiVNJsonEffectBounce
    | PixiVNJsonEffectPulse
    | PixiVNJsonEffectHop
    | PixiVNJsonEffectWiggle
    | PixiVNJsonEffectNod
    | PixiVNJsonEffectSway
    | PixiVNJsonEffectPunch
    | PixiVNJsonEffectGlitch
    | PixiVNJsonEffectChromaticAberration
    | PixiVNJsonEffectShockwave
    | PixiVNJsonEffectRadialBlur
    | PixiVNJsonEffectBlurPulse
    | PixiVNJsonEffectVignettePulse
    | PixiVNJsonEffectDesaturate
    | PixiVNJsonEffectGlowPulse;
export default PixiVNJsonCanvasEffect;
