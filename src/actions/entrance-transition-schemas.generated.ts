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
            forceCompleteBeforeNext: {
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
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        allOf: [
                            {
                                type: "object",
                            },
                            {
                                type: "object",
                            },
                        ],
                    },
                ],
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
            forceCompleteBeforeNext: {
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
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        allOf: [
                            {
                                type: "object",
                            },
                            {
                                type: "object",
                            },
                        ],
                    },
                ],
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
            forceCompleteBeforeNext: {
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
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        allOf: [
                            {
                                type: "object",
                            },
                            {
                                type: "object",
                            },
                        ],
                    },
                ],
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
            forceCompleteBeforeNext: {
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
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        allOf: [
                            {
                                type: "object",
                            },
                            {
                                type: "object",
                            },
                        ],
                    },
                ],
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
            forceCompleteBeforeNext: {
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
                anyOf: [
                    {
                        type: "object",
                    },
                    {
                        allOf: [
                            {
                                type: "object",
                            },
                            {
                                type: "object",
                            },
                        ],
                    },
                ],
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
