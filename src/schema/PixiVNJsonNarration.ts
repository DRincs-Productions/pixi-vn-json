type PixiVNJsonInputRequest = {
    type: "input";
    operationType: "request";
    valueType?: string;
    defaultValue?: any;
};

type PixiVNJsonDialogue = {
    type: "dialogue";
    operationType: "clean";
};

type PixiVNJsonNarration = PixiVNJsonDialogue | PixiVNJsonInputRequest;
export default PixiVNJsonNarration;
