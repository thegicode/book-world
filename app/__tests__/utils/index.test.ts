import {
    CustomEventEmitter,
    CustomFetch,
    Observer,
} from "../../scripts/utils/index";

describe("utils index", () => {
    test("CustomEventEmitter is defined", () => {
        expect(CustomEventEmitter).toBeDefined();
    });

    test("CustomFetch is defined", () => {
        expect(CustomFetch).toBeDefined();
    });

    test("Observer is defined", () => {
        expect(Observer).toBeDefined();
    });
});
