/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter } from "../../../scripts/utils/index";

import AppSearch from "../../../scripts/pages/search/AppSearch";

jest.mock("../../../scripts/utils/index", () => ({
    CustomEventEmitter: {
        dispatch: jest.fn(),
    },
}));

describe("AppSearch", () => {
    const CUSTOM_ELEMENT_NAME = "app-search";
    let appSearchInstance: AppSearch;
    let originalLocation: Location;
    const testKeyword = "test";

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, AppSearch);
        }

        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                search: `?keyword=${testKeyword}`,
            },
        });

        appSearchInstance = new AppSearch();
    });

    afterEach(() => {
        window.location = originalLocation;

        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("should dispatch 'search-page-init' event with keyword on renderBookList", () => {
        (appSearchInstance as any).renderBookList();

        expect(CustomEventEmitter.dispatch).toHaveBeenLastCalledWith(
            "search-page-init",
            { keyword: testKeyword }
        );
    });

    test("should not dispatch 'search-page-init' event if no keyword is provided", () => {
        Object.defineProperty(window, "location", {
            writable: true,
            value: {
                search: `?keyword=`,
            },
        });

        const consoleLogSpy = jest.spyOn(console, "log");
        consoleLogSpy.mockImplementation(() => {});
        (appSearchInstance as any).renderBookList();

        expect(CustomEventEmitter.dispatch).not.toHaveBeenCalled();
        expect(consoleLogSpy).toHaveBeenCalledWith(
            "No keyword provided for search."
        );

        consoleLogSpy.mockRestore();
    });

    test("should bind popstate event to boundPopStateHandler on connectedCallback", () => {
        const addEventListenerSpy = jest.spyOn(window, "addEventListener");

        appSearchInstance.connectedCallback();

        expect(addEventListenerSpy).toHaveBeenCalledWith(
            "popstate",
            expect.any(Function)
        );
    });

    test("should call renderBookList when popstate event is triggered", () => {
        const renderBookListSpy = jest.spyOn(
            appSearchInstance as any,
            "renderBookList"
        );

        appSearchInstance.connectedCallback();

        window.dispatchEvent(new PopStateEvent("popstate"));

        expect(renderBookListSpy).toHaveBeenCalled();
    });

    test("should remove popstate event listener on disconnectedCallback", () => {
        const instance = appSearchInstance as any;
        instance.boundPopStateHandler = jest.fn();

        const removeEventListenerSpy = jest.spyOn(
            window,
            "removeEventListener"
        );

        instance.disconnectedCallback();

        expect(removeEventListenerSpy).toHaveBeenCalledWith(
            "popstate",
            instance.boundPopStateHandler
        );
    });
});
