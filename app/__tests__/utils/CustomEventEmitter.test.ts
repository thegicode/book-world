import CustomEventEmitter from "../../scripts/utils/CustomEventEmitter";

describe("CustomEventEmitter", () => {
    let emitter: typeof CustomEventEmitter;

    beforeEach(() => {
        emitter = CustomEventEmitter;
    });

    test("shoud add listener and emit event", () => {
        const callback = jest.fn();
        const detail = { message: "Hello World" };

        emitter.add("test", callback);
        emitter.dispatch("test", detail);

        expect(callback).toHaveBeenCalledWith(
            expect.objectContaining({
                detail,
                type: "test",
            })
        );
    });

    test("should remove listener", () => {
        const callback = jest.fn();
        emitter.add("test", callback);
        emitter.remove("test", callback);
        emitter.dispatch("test");

        expect(callback).not.toHaveBeenCalled();
    });
});
