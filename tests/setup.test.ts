import { Game } from "@drincs/pixi-vn";
import { test } from "vitest";
import { JsonUnifier } from "..";
import { narrationOperation } from "../src/utils/narration";
import { getConditionalStep, getLogichValue, setStorageValue } from "../src/utils/storage";

test("setup", async () => {
    Game.init();
    JsonUnifier.init({
        narrationOperation: narrationOperation,
        setStorageValue: setStorageValue,
        getLogichValue: getLogichValue,
        getConditionalStep: getConditionalStep,
    });
});
