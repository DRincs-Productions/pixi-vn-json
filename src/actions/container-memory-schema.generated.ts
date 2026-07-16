/**
 * GENERATED FILE — do not edit by hand.
 * Produced by `scripts/generate-container-memory-schema.mjs` from `@drincs/pixi-vn`'s own
 * `ContainerMemory` type. Re-run that script (see its header comment) to refresh this file after
 * that type changes.
 */

/**
 * JSON Schema (usable as `@drincs/pixi-vn-ink`'s `HashtagHandlerOptions.keySchemas` values, or
 * with any other JSON Schema validator) for `ContainerMemory`, excluding its own `elements` (the
 * container's child canvas elements — a self-referential list, not a flat property).
 */
export const containerMemorySchema: object = {
    type: "object",
    properties: {
        isRenderGroup: {
            type: "boolean",
        },
        blendMode: {
            enum: [
                "inherit",
                "normal",
                "add",
                "multiply",
                "screen",
                "darken",
                "lighten",
                "erase",
                "color-dodge",
                "color-burn",
                "linear-burn",
                "linear-dodge",
                "linear-light",
                "hard-light",
                "soft-light",
                "pin-light",
                "difference",
                "exclusion",
                "overlay",
                "saturation",
                "color",
                "luminosity",
                "normal-npm",
                "add-npm",
                "screen-npm",
                "none",
                "subtract",
                "divide",
                "vivid-light",
                "hard-mix",
                "negation",
                "min",
                "max",
            ],
        },
        tint: {
            anyOf: [
                {
                    type: "string",
                },
                {
                    type: "number",
                },
                {
                    type: "object",
                },
                {
                    type: "object",
                },
                {
                    type: "object",
                },
                {
                    type: "object",
                },
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
                {
                    type: "object",
                },
            ],
        },
        alpha: {
            type: "number",
        },
        angle: {
            type: "number",
        },
        children: {
            type: "object",
        },
        parent: {
            type: "object",
        },
        renderable: {
            type: "boolean",
        },
        rotation: {
            type: "number",
        },
        scale: {
            type: ["number", "object"],
        },
        pivot: {
            type: ["number", "object"],
        },
        origin: {
            type: ["number", "object"],
        },
        position: {
            type: "object",
        },
        skew: {
            type: "object",
        },
        visible: {
            type: "boolean",
        },
        x: {
            type: "number",
        },
        y: {
            type: "number",
        },
        boundsArea: {
            type: "object",
        },
        accessible: {
            type: "boolean",
        },
        accessibleTitle: {
            type: "string",
        },
        accessibleHint: {
            type: "string",
        },
        tabIndex: {
            type: "number",
        },
        accessibleType: {
            enum: [
                "object",
                "label",
                "a",
                "abbr",
                "address",
                "area",
                "article",
                "aside",
                "audio",
                "b",
                "base",
                "bdi",
                "bdo",
                "blockquote",
                "body",
                "br",
                "button",
                "canvas",
                "caption",
                "cite",
                "code",
                "col",
                "colgroup",
                "data",
                "datalist",
                "dd",
                "del",
                "details",
                "dfn",
                "dialog",
                "div",
                "dl",
                "dt",
                "em",
                "embed",
                "fieldset",
                "figcaption",
                "figure",
                "footer",
                "form",
                "h1",
                "h2",
                "h3",
                "h4",
                "h5",
                "h6",
                "head",
                "header",
                "hgroup",
                "hr",
                "html",
                "i",
                "iframe",
                "img",
                "input",
                "ins",
                "kbd",
                "legend",
                "li",
                "link",
                "main",
                "map",
                "mark",
                "menu",
                "meta",
                "meter",
                "nav",
                "noscript",
                "ol",
                "optgroup",
                "option",
                "output",
                "p",
                "picture",
                "pre",
                "progress",
                "q",
                "rp",
                "rt",
                "ruby",
                "s",
                "samp",
                "script",
                "search",
                "section",
                "select",
                "slot",
                "small",
                "source",
                "span",
                "strong",
                "style",
                "sub",
                "summary",
                "sup",
                "table",
                "tbody",
                "td",
                "template",
                "textarea",
                "tfoot",
                "th",
                "thead",
                "time",
                "title",
                "tr",
                "track",
                "u",
                "ul",
                "var",
                "video",
                "wbr",
            ],
        },
        accessiblePointerEvents: {
            enum: [
                "inherit",
                "none",
                "auto",
                "visiblePainted",
                "visibleFill",
                "visibleStroke",
                "visible",
                "painted",
                "fill",
                "stroke",
                "all",
            ],
        },
        accessibleText: {
            type: "string",
        },
        accessibleChildren: {
            type: "boolean",
        },
        cullArea: {
            type: "object",
        },
        cullable: {
            type: "boolean",
        },
        cullableChildren: {
            type: "boolean",
        },
        cursor: {
            anyOf: [
                {
                    const: "none",
                },
                {
                    const: "progress",
                },
                {
                    const: "auto",
                },
                {
                    const: "default",
                },
                {
                    const: "context-menu",
                },
                {
                    const: "help",
                },
                {
                    const: "pointer",
                },
                {
                    const: "wait",
                },
                {
                    const: "cell",
                },
                {
                    const: "crosshair",
                },
                {
                    const: "text",
                },
                {
                    const: "vertical-text",
                },
                {
                    const: "alias",
                },
                {
                    const: "copy",
                },
                {
                    const: "move",
                },
                {
                    const: "no-drop",
                },
                {
                    const: "not-allowed",
                },
                {
                    const: "e-resize",
                },
                {
                    const: "n-resize",
                },
                {
                    const: "ne-resize",
                },
                {
                    const: "nw-resize",
                },
                {
                    const: "s-resize",
                },
                {
                    const: "se-resize",
                },
                {
                    const: "sw-resize",
                },
                {
                    const: "w-resize",
                },
                {
                    const: "ns-resize",
                },
                {
                    const: "ew-resize",
                },
                {
                    const: "nesw-resize",
                },
                {
                    const: "col-resize",
                },
                {
                    const: "nwse-resize",
                },
                {
                    const: "row-resize",
                },
                {
                    const: "all-scroll",
                },
                {
                    const: "zoom-in",
                },
                {
                    const: "zoom-out",
                },
                {
                    const: "grab",
                },
                {
                    const: "grabbing",
                },
                {
                    allOf: [
                        {
                            type: "string",
                        },
                        {
                            type: "object",
                        },
                    ],
                },
            ],
        },
        eventMode: {
            enum: ["none", "auto", "passive", "static", "dynamic"],
        },
        interactive: {
            type: "boolean",
        },
        interactiveChildren: {
            type: "boolean",
        },
        hitArea: {
            type: "object",
        },
        width: {
            type: "number",
        },
        height: {
            type: "number",
        },
        mask: {
            type: ["number", "object"],
        },
        filters: {
            type: "object",
        },
        label: {
            type: "string",
        },
        zIndex: {
            type: "number",
        },
        sortDirty: {
            type: "boolean",
        },
        sortableChildren: {
            type: "boolean",
        },
        pixivnId: {
            type: "string",
        },
        index: {
            type: "number",
        },
        parentLabel: {
            type: "string",
        },
        onEvents: {
            type: "object",
        },
        align: {
            type: ["number", "object"],
        },
        xAlign: {
            type: "number",
        },
        yAlign: {
            type: "number",
        },
        percentagePosition: {
            type: ["number", "object"],
        },
        percentageX: {
            type: "number",
        },
        percentageY: {
            type: "number",
        },
    },
    required: ["pixivnId"],
    additionalProperties: false,
};
