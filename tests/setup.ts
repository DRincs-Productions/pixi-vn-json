import { Game } from "@drincs/pixi-vn";
import { JsonUnifier } from "src/core";
import { narrationOperation } from "../src/utils/narration";
import { getConditionalStep, getLogichValue, setInitialStorageValue, setStorageValue } from "../src/utils/storage";

Game.init();
JsonUnifier.init({
    narrationOperation: narrationOperation,
    setStorageValue: setStorageValue,
    setInitialStorageValue: setInitialStorageValue,
    getLogichValue: getLogichValue,
    getConditionalStep: getConditionalStep,
});
