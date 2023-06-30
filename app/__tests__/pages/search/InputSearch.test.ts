/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter } from "../../../scripts/utils/index";
import { readHtmlFile, getElementFromHtml } from "../../helpers";
import InputSearch from "../../../scripts/pages/search/InputSearch";

jest.mock("../../../scripts/utils/index");

describe("InputSearch", () => {
    const CUSTOM_ELEMENT_NAME = "input-search";
    const MARKUP_FILE_PATH = "../../markup/search.html";

    let inputSearch: InputSearch;
    let instance: any;

    const element = getElementFromHtml(
        readHtmlFile(MARKUP_FILE_PATH),
        CUSTOM_ELEMENT_NAME
    ) as HTMLElement;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, InputSearch);
        }

        inputSearch = new InputSearch();
        inputSearch.innerHTML = element.innerHTML;

        instance = inputSearch as any;

        instance.initialize();

        document.body.appendChild(inputSearch);
    });

    afterEach(() => {
        inputSearch.innerHTML = "";
        document.body.removeChild(inputSearch);
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("does not add submit event listener when form is null on connected", () => {
        const addEventListenerSpy = jest.spyOn(
            EventTarget.prototype,
            "addEventListener"
        );

        instance.form = null;
        instance.connectedCallback();

        expect(addEventListenerSpy).not.toHaveBeenCalled();
    });

    test("does not remove submit event listener when form is null on connected", () => {
        const removeEventListenerSpy = jest.spyOn(
            EventTarget.prototype,
            "removeEventListener"
        );

        instance.form = null;
        instance.connectedCallback();

        expect(removeEventListenerSpy).not.toHaveBeenCalled();
    });

    describe("onSubmit", () => {
        let mockEvent: Partial<Event>;
        beforeEach(() => {
            mockEvent = {
                preventDefault: jest.fn(),
            };
        });
        test("clears the input field on form submission", () => {
            const mockKeyword = "test";

            instance.input = { value: mockKeyword, focus: jest.fn() };
            instance.onSubmit(mockEvent);

            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(instance.input.value).toBe("");
        });

        test("Does not dispatch custom event if input is null", () => {
            const dispatchSpy = jest.spyOn(CustomEventEmitter, "dispatch");
            instance.input = null;
            instance.onSubmit(mockEvent);

            expect(dispatchSpy).not.toHaveBeenCalled();
        });
    });
});
