/**
 * GENERATED FILE — do not edit by hand.
 * Produced by `scripts/generate-entrance-transition-schemas.mjs` from
 * `@drincs/pixi-vn`'s own transition prop types. Re-run that script (see its header comment) to
 * refresh this file after those types change.
 */

/**
 * JSON Schemas (usable as `@drincs/pixi-vn-ink`'s `HashtagHandlerOptions.keySchemas` values, or
 * with any other JSON Schema validator) for each entrance transition's own props, keyed by
 * transition name.
 */
export const entranceTransitionKeySchemas: Record<string, object> = {
    dissolve: {
        type: "object",
        properties: {
            completeOnContinue: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    fade: {
        type: "object",
        properties: {
            completeOnContinue: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    movein: {
        type: "object",
        properties: {
            direction: {
                enum: ["left", "right", "up", "down"],
            },
            motionBlur: {
                anyOf: [
                    {
                        type: "number",
                    },
                    {
                        const: false,
                    },
                    {
                        const: true,
                    },
                ],
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    zoomin: {
        type: "object",
        properties: {
            direction: {
                enum: ["left", "right", "up", "down"],
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    pushin: {
        type: "object",
        properties: {
            direction: {
                enum: ["left", "right", "up", "down"],
            },
            motionBlur: {
                anyOf: [
                    {
                        type: "number",
                    },
                    {
                        const: false,
                    },
                    {
                        const: true,
                    },
                ],
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    wipein: {
        type: "object",
        properties: {
            angle: {
                type: "number",
            },
            direction: {
                enum: ["left", "right", "up", "down"],
            },
            invert: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    irisin: {
        type: "object",
        properties: {
            origin: {
                type: "object",
            },
            aspect: {
                type: "number",
            },
            direction: {
                enum: ["expand", "contract"],
            },
            invert: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    splitin: {
        type: "object",
        properties: {
            direction: {
                enum: ["inward", "outward"],
            },
            orientation: {
                enum: ["horizontal", "vertical"],
            },
            origin: {
                type: "number",
            },
            invert: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    blurin: {
        type: "object",
        properties: {
            strength: {
                type: "number",
            },
            quality: {
                type: "number",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    pixelatein: {
        type: "object",
        properties: {
            pixelSize: {
                type: "number",
            },
            direction: {
                enum: ["up-left", "up-right", "down-left", "down-right"],
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    flashin: {
        type: "object",
        properties: {
            color: {
                type: ["string", "number", "object"],
            },
            maxAlpha: {
                type: "number",
            },
            holdDuration: {
                type: "number",
            },
            pulses: {
                type: "number",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    glitchin: {
        type: "object",
        properties: {
            strength: {
                type: "number",
            },
            bursts: {
                type: "number",
            },
            slices: {
                type: "number",
            },
            rgbSplit: {
                type: "number",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    twistin: {
        type: "object",
        properties: {
            angle: {
                type: "number",
            },
            radius: {
                type: "number",
            },
            origin: {
                type: "object",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    warpin: {
        type: "object",
        properties: {
            strength: {
                type: "number",
            },
            origin: {
                type: "object",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    ripplein: {
        type: "object",
        properties: {
            origin: {
                type: "object",
            },
            amplitude: {
                type: "number",
            },
            wavelength: {
                type: "number",
            },
            speed: {
                type: "number",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    noisedissolvein: {
        type: "object",
        properties: {
            edge: {
                enum: ["hard", "soft"],
            },
            noiseScale: {
                type: "number",
            },
            seed: {
                type: "number",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    tvin: {
        type: "object",
        properties: {
            lineThickness: {
                type: "number",
            },
            brightness: {
                type: "number",
            },
            scanlines: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
    pinchin: {
        type: "object",
        properties: {
            strength: {
                type: "number",
            },
            mode: {
                enum: ["pinch", "bulge"],
            },
            radius: {
                type: "number",
            },
            origin: {
                type: "object",
            },
            fadeComponent: {
                type: "boolean",
            },
            completeOnContinue: {
                type: "boolean",
            },
            animateOldComponentOut: {
                type: "boolean",
            },
            delay: {
                type: ["number", "object"],
            },
            stiffness: {
                type: "number",
            },
            damping: {
                type: "number",
            },
            mass: {
                type: "number",
            },
            duration: {
                type: "number",
            },
            visualDuration: {
                type: "number",
            },
            bounce: {
                type: "number",
            },
            velocity: {
                type: "number",
            },
            restSpeed: {
                type: "number",
            },
            restDelta: {
                type: "number",
            },
            bounceStiffness: {
                type: "number",
            },
            bounceDamping: {
                type: "number",
            },
            min: {
                type: "number",
            },
            max: {
                type: "number",
            },
            power: {
                type: "number",
            },
            timeConstant: {
                type: "number",
            },
            isSync: {
                type: "boolean",
            },
            elapsed: {
                type: "number",
            },
            type: {
                anyOf: [
                    {
                        const: false,
                    },
                    {
                        const: "keyframes",
                    },
                    {
                        type: "object",
                    },
                    {
                        const: "decay",
                    },
                    {
                        const: "spring",
                    },
                    {
                        const: "tween",
                    },
                    {
                        const: "inertia",
                    },
                ],
            },
            autoplay: {
                type: "boolean",
            },
            startTime: {
                type: "number",
            },
            from: {},
            inherit: {
                type: "boolean",
            },
            skipAnimations: {
                type: "boolean",
            },
            path: {
                type: "object",
            },
            when: {
                anyOf: [
                    {
                        type: "string",
                    },
                    {
                        const: false,
                    },
                ],
            },
            delayChildren: {
                type: ["number", "object"],
            },
            staggerChildren: {
                type: "number",
            },
            staggerDirection: {
                type: "number",
            },
            repeat: {
                type: "number",
            },
            repeatType: {
                enum: ["loop", "reverse", "mirror"],
            },
            repeatDelay: {
                type: "number",
            },
            ease: {
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        const: "linear",
                    },
                    {
                        const: "easeIn",
                    },
                    {
                        const: "easeOut",
                    },
                    {
                        const: "easeInOut",
                    },
                    {
                        const: "circIn",
                    },
                    {
                        const: "circOut",
                    },
                    {
                        const: "circInOut",
                    },
                    {
                        const: "backIn",
                    },
                    {
                        const: "backOut",
                    },
                    {
                        const: "backInOut",
                    },
                    {
                        const: "anticipate",
                    },
                    {
                        type: "object",
                    },
                    {
                        type: "object",
                    },
                ],
            },
            times: {
                type: "object",
            },
            reduceMotion: {
                type: "boolean",
            },
            aliasToRemoveAfter: {
                type: ["string", "object"],
            },
            tickerAliasToResume: {
                type: ["string", "object"],
            },
            tickerIdToResume: {
                type: ["string", "object"],
            },
        },
        additionalProperties: false,
    },
};
