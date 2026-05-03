import type PixiVNJsonConditionalResultToCombine from "@/schema/PixiVNJsonConditionalResultToCombine";
import type PixiVNJsonConditionalStatements from "@/schema/PixiVNJsonConditionalStatements";

/**
 * A single element that can appear inside a step-switch, which may be a direct value,
 * a conditional statement, or a result-to-combine.
 */
export type PixiVNJsonStepSwitchElementType<Then> =
    | Then
    | PixiVNJsonConditionalStatements<Then>
    | PixiVNJsonConditionalResultToCombine<Then>;
/**
 * The elements collection of a step-switch — either a plain array or a conditional that produces an array.
 */
export type PixiVNJsonStepSwitchElementsType<Then> =
    | PixiVNJsonStepSwitchElementType<Then>[]
    | PixiVNJsonConditionalStatements<Then[]>;

/**
 * Picks one element at random each time the step is visited.
 */
interface PixiVNJsonRandom<Then> {
    type: "stepswitch";
    choiceType: "random";
    /**
     * The pool of elements to choose from randomly.
     */
    elements: PixiVNJsonStepSwitchElementsType<Then>;
}
/**
 * Picks elements in a random order, advancing through the list across visits (no repeats until exhausted).
 */
interface PixiVNJsonSequentialRandom<Then> {
    type: "stepswitch";
    choiceType: "sequentialrandom";
    /**
     * The pool of elements to iterate through in randomised order.
     */
    elements: PixiVNJsonStepSwitchElementsType<Then>;
    /**
     * When the sequential ends, what should be the value? If undefined, it will return undefined.
     * If "lastItem", it will return the last item in the array.
     */
    end: undefined | "lastItem";
    /**
     * The subId is used for manager nested switches
     */
    nestedId?: string;
}
/**
 * Advances through the elements list one by one on each visit (in order).
 */
interface PixiVNJsonSequential<Then> {
    type: "stepswitch";
    choiceType: "sequential";
    /**
     * The ordered list of elements to iterate through.
     */
    elements: PixiVNJsonStepSwitchElementsType<Then>;
    /**
     * When the sequential ends, what should be the value? If undefined, it will return undefined.
     * If "lastItem", it will return the last item in the array.
     */
    end: undefined | "lastItem";
    /**
     * The subId is used for manager nested switches
     */
    nestedId?: string;
}
/**
 * Loops through the elements list indefinitely, cycling back to the first element after the last.
 */
interface PixiVNJsonLoop<Then> {
    type: "stepswitch";
    choiceType: "loop";
    /**
     * The list of elements to cycle through.
     */
    elements: PixiVNJsonStepSwitchElementsType<Then>;
    /**
     * The subId is used for manager nested switches
     */
    nestedId?: string;
}

/**
 * A step-switch selects one element from a list using a defined strategy (random, sequential, loop, or sequential-random).
 */
type PixiVNJsonStepSwitch<Then> =
    | PixiVNJsonRandom<Then>
    | PixiVNJsonSequential<Then>
    | PixiVNJsonLoop<Then>
    | PixiVNJsonSequentialRandom<Then>;
export default PixiVNJsonStepSwitch;
