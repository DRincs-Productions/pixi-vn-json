import {
    type CanvasBaseInterface,
    moveIn,
    pushIn,
    showWithDissolve,
    showWithFade,
    zoomIn,
} from "@drincs/pixi-vn/canvas";

export { entranceTransitionKeySchemas } from "@/actions/entrance-transition-schemas.generated";

/**
 * The transition types used to bring a canvas element **in** (as opposed to
 * `moveout`/`zoomout`/`pushout`, used only to remove one). `dissolve`/`fade` have no direction —
 * they're shared with removal — but are still "entrance" transitions in the sense that
 * {@link entranceTransitionKeySchemas} validates them the same way for a `show`-style command.
 */
export const ENTRANCE_TRANSITION_TYPES = [
    "dissolve",
    "fade",
    "movein",
    "zoomin",
    "pushin",
] as const;

/**
 * One of {@link ENTRANCE_TRANSITION_TYPES}.
 */
export type EntranceTransitionType = (typeof ENTRANCE_TRANSITION_TYPES)[number];

/**
 * Runs an entrance transition on a canvas element — the same dispatch this package's own
 * interpreter uses internally (see `@/actions/canvas`) for the built-in
 * `image`/`video`/`text`/`imagecontainer` `show` operations (`showWithDissolve`, `showWithFade`,
 * `moveIn`, `zoomIn`, `pushIn`), exposed here so a third-party canvas-component library (e.g.
 * `pixi-vn-spine`) can reuse it for its own custom operation/command instead of re-implementing
 * the type → function mapping.
 *
 * @param alias The unique alias the element is (or will be) registered under on the canvas.
 * @param component The canvas element to show (e.g. a `Spine` instance already built by the
 *   caller). Matches the `component` parameter of `@drincs/pixi-vn`'s own `showWithDissolve`/
 *   `moveIn`/etc.
 * @param transitionType Which entrance transition to run (e.g. `"dissolve"`).
 * @param props The transition's own props (e.g. `{ duration: 2 }`), typically validated against
 *   {@link entranceTransitionKeySchemas} beforehand.
 * @returns The ids of the tickers used by the transition, once it starts.
 */
export async function executeEntranceTransition(
    alias: string,
    component: CanvasBaseInterface<any> | undefined,
    transitionType: EntranceTransitionType,
    props?: object,
): Promise<string[] | undefined> {
    switch (transitionType) {
        case "dissolve":
            return showWithDissolve(alias, component, props);
        case "fade":
            return showWithFade(alias, component, props);
        case "movein":
            return moveIn(alias, component, props);
        case "zoomin":
            return zoomIn(alias, component, props);
        case "pushin":
            return pushIn(alias, component, props);
    }
}
