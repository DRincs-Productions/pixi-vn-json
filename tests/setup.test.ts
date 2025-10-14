import { Game } from "@drincs/pixi-vn";
import { JsonUnifier } from "@drincs/pixi-vn-json/unifier";
import { test } from "vitest";
import { narrationOperation } from "../src/utils/narration";
import { getConditionalStep, getLogichValue, setInitialStorageValue, setStorageValue } from "../src/utils/storage";

test("setup", async () => {
    Game.init();
    JsonUnifier.init({
        narrationOperation: narrationOperation,
        setStorageValue: setStorageValue,
        setInitialStorageValue: setInitialStorageValue,
        getLogichValue: getLogichValue,
        getConditionalStep: getConditionalStep,
    });
});
