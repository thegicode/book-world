/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../type.d.ts" />

import { CustomEventEmitter, CustomFetch } from "../../../scripts/utils";
import { hasLibrary } from "../../../scripts/modules/model";

import { readHtmlFile } from "../../helpers";

import Library from "../../../scripts/pages/library/Library";

jest.mock("../../../scripts/utils/CustomFetch");
jest.mock("../../../scripts/modules/model", () => ({
    hasLibrary: jest.fn(),
}));

class LibraryForTest extends Library {
    async testFetchLibrarySearch(detailRegionCode: string) {
        await this.fetchLibrarySearch(detailRegionCode);
    }
    testRender(data: ILibrarySearchByBookResult) {
        this.render(data);
    }
    testHandleDetailRegion(evt: ICustomEvent<{ detailRegionCode: string }>) {
        this.handleDetailRegion(evt);
    }
    testShowMessage(type: string) {
        this.showMessage(type);
    }
}

describe("Library", () => {
    const CUSTOM_ELEMENT_NAME = "app-library";
    const detailRegionCode = "12345";
    const testCustomFetch = CustomFetch.fetch as jest.Mock;
    let instance: LibraryForTest;

    const libraryData = {
        libraries: [
            {
                address: "서울특별시 행복구",
                homepage: "http://www.happy.co.kr",
                libCode: "111111",
                libName: "행복",
                telephone: "010-1111-11111",
            },
            {
                address: "서울특별시 스마일구",
                homepage: "http://www.smile.co.kr",
                libCode: "222222",
                libName: "스마일",
                telephone: "010-2222-2222",
            },
        ],
    };

    beforeEach(() => {
        const mockData = {
            pageNo: 1,
            pageSize: 20,
            numFound: 8,
            resultNum: 8,
            ...libraryData,
        };
        testCustomFetch.mockResolvedValue(mockData);
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, LibraryForTest);
        }

        instance = new LibraryForTest();
        instance.innerHTML = readHtmlFile("../../markup/library.html");

        document.body.appendChild(instance);
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.removeChild(instance);
        jest.clearAllMocks();
    });

    async function testFetchErrorHandling(error: Error, expectedError: Error) {
        testCustomFetch.mockRejectedValue(error);
        const consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(() => {});

        try {
            await instance.testFetchLibrarySearch(detailRegionCode);
        } catch (actualError) {
            expect(testCustomFetch).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith(error);
            expect(actualError).toEqual(expectedError);
        } finally {
            consoleErrorSpy.mockRestore();
        }
    }

    test("connectedCallback should add event listener", () => {
        const addSpy = jest.spyOn(CustomEventEmitter, "add");

        instance.connectedCallback();

        expect(addSpy).toHaveBeenCalledWith(
            "set-detail-region",
            expect.any(Function)
        );
        addSpy.mockRestore();
    });

    test("disconnectedCallback should remove event listener", () => {
        const removeSpy = jest.spyOn(CustomEventEmitter, "remove");

        instance.disconnectedCallback();

        expect(removeSpy).toHaveBeenCalledWith(
            "set-detail-region",
            expect.any(Function)
        );

        removeSpy.mockRestore();
    });

    test("fetchLibrarySearch should call fetch", async () => {
        await instance.testFetchLibrarySearch(detailRegionCode);
        expect(CustomFetch.fetch).toHaveBeenCalledWith(
            `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`
        );
    });

    test("fetchLibrarySearch handles fetch error correctly", async () => {
        const fetchError = new Error("Some fetch error");
        const expectedError = new Error("Fail to get library search data.");
        await testFetchErrorHandling(fetchError, expectedError);

        // const mockError = new Error("Fail to get library search data.");
        // testCustomFetch.mockRejectedValue(new Error("Some fetch error"));

        // const consoleErrorSpy = jest.spyOn(console, "error");
        // // eslint-disable-next-line @typescript-eslint/no-empty-function
        // consoleErrorSpy.mockImplementation(() => {});

        // try {
        //     await instance.testFetchLibrarySearch(detailRegionCode);
        // } catch (error) {
        //     expect(testCustomFetch).toHaveBeenCalled();
        //     expect(consoleErrorSpy).toHaveBeenCalledWith(
        //         new Error("Some fetch error")
        //     );
        //     expect(error).toEqual(mockError);
        // } finally {
        //     consoleErrorSpy.mockRestore();
        // }
    });

    test("render should call showMessage with 'notFound' when libraries array is empty", () => {
        const showMessageSpy = jest.spyOn(instance as any, "showMessage");
        const emptyData = { libraries: [] };

        instance.testRender(emptyData);

        expect(showMessageSpy).toHaveBeenCalledWith("notFound");
        showMessageSpy.mockRestore();
    });

    test("render should skip a library when the template is not found", () => {
        const form = document.querySelector("form");
        if (form) form.innerHTML = "";
        document.querySelector("#tp-item")?.remove();

        instance.testRender(libraryData);
        expect(form?.childElementCount).toBe(0);
    });

    test("render should call hasLibrary", () => {
        (hasLibrary as jest.Mock).mockImplementation(
            (libCode) => libCode === "111111"
        );

        instance.testRender(libraryData);

        expect(hasLibrary).toHaveBeenCalledWith("111111");
        expect(hasLibrary).toHaveBeenCalledWith("222222");

        (hasLibrary as jest.Mock).mockClear();
    });

    test("render should skip a message when the template is not found", () => {
        const template = document.querySelector("#tp-null-template");

        instance.testShowMessage("type");
        const form = document.querySelector("form");

        expect(form?.childElementCount).toBe(0);
    });

    test("handleDetailRegion should call showMessage and fetchLibrarySearch", () => {
        // Arrange
        const mockShowMessage = jest
            .spyOn(instance as any, "showMessage")
            .mockImplementation(() => {});
        const mockFetchLibrarySearch = jest
            .spyOn(instance as any, "fetchLibrarySearch")
            .mockResolvedValue(() => {});

        // Create a mock event of type ICustomEvent
        const mockEvent: ICustomEvent<{ detailRegionCode: string }> = {
            bubbles: false,
            cancelBubble: false,
            cancelable: false,
            composed: false,
            currentTarget: null,
            defaultPrevented: false,
            detail: { detailRegionCode: "12345" },
            eventPhase: 0,
            isTrusted: false,
            returnValue: false,
            srcElement: null,
            target: null,
            timeStamp: 0,
            type: "",
            composedPath: function (): EventTarget[] {
                throw new Error("Function not implemented.");
            },
            initEvent: function (
                type: string,
                bubbles?: boolean | undefined,
                cancelable?: boolean | undefined
            ): void {
                throw new Error("Function not implemented.");
            },
            preventDefault: function (): void {
                throw new Error("Function not implemented.");
            },
            stopImmediatePropagation: function (): void {
                throw new Error("Function not implemented.");
            },
            stopPropagation: function (): void {
                throw new Error("Function not implemented.");
            },
            AT_TARGET: 0,
            BUBBLING_PHASE: 0,
            CAPTURING_PHASE: 0,
            NONE: 0,
        };

        // Act
        instance.testHandleDetailRegion(mockEvent);

        // Assert
        expect(mockShowMessage).toHaveBeenCalledWith("loading");
        expect(mockFetchLibrarySearch).toHaveBeenCalledWith("12345");

        // Cleanup
        mockShowMessage.mockRestore();
        mockFetchLibrarySearch.mockRestore();
    });
});
