import { JsonUnifier } from "src";
import { narrationOperation } from "src/utils/narration";
import { getConditionalStep, getLogichValue, setStorageValue } from "src/utils/storage";
import { test } from "vitest";

test("setup", async () => {
    JsonUnifier.init({
        narrationOperation: narrationOperation,
        setStorageValue: setStorageValue,
        getLogichValue: getLogichValue,
        getConditionalStep: getConditionalStep,
    });
});
