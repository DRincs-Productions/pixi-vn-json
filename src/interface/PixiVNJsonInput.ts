type PixiVNJsonInputRequest = {
    type: "input";
    operationType: "request";
    valueType?: string;
    defaultValue?: any;
};

type PixiVNJsonInput = PixiVNJsonInputRequest;
export default PixiVNJsonInput;
