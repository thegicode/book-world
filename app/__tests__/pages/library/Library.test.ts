/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter, CustomFetch } from "../../../scripts/utils";
import { hasLibrary } from "../../../scripts/modules/model";
// import LibraryItem from "../../../scripts/pages/library/LibraryItem";

import {
    readHtmlFile,
    //getElementFromHtml
} from "../../helpers";

import Library from "../../../scripts/pages/library/Library";

jest.mock("../../../scripts/utils/CustomFetch");
jest.mock("../../../scripts/modules/model", () => ({
    hasLibrary: jest.fn(),
}));
// jest.mock("../../../scripts/pages/library/LibraryItem", () => {
//     return jest.fn().mockImplementation(() => {
//         return { dataset: {} };
//     });
// });

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
}

describe("Library", () => {
    const CUSTOM_ELEMENT_NAME = "app-library";
    const mockData = {
        pageNo: 1,
        pageSize: 20,
        numFound: 8,
        resultNum: 8,
        libraries: [
            {
                libCode: "123456",
                libName: "하늘 도관",
                address: "서울특별시 강동구",
                tel: "02-427-1234",
                fax: "02-427-5678 ㅇ",
                latitude: "37.5650504",
                longitude: "127.1738009",
                homepage: "http://www.site.co.kr",
                closed: "매주 화요일 / 법정공휴일(일요일 제외)",
                operatingTime:
                    "평일 : 9시 ~ 22시 (어린이자료실 18시, 종합자료실 22시) / 주말  9시 ~17시",
                BookCount: "95464",
            },
        ],
    };
    const detailRegionCode = "12345";
    const testCustomFetch = CustomFetch.fetch as jest.Mock;
    let instance: LibraryForTest;
    const libraryHtml = readHtmlFile("../../markup/library.html");

    beforeEach(() => {
        testCustomFetch.mockResolvedValue(mockData);
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, LibraryForTest);
        }

        instance = new LibraryForTest(); // consstructor
        const libraryHtml = readHtmlFile("../../markup/library.html");
        instance.innerHTML = libraryHtml;

        document.body.appendChild(instance); // connectedCallback
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.removeChild(instance);
        jest.clearAllMocks();
    });

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
        testCustomFetch.mockResolvedValue(mockData);

        instance = new LibraryForTest();
        instance.innerHTML = libraryHtml;
        document.body.appendChild(instance);

        await instance.testFetchLibrarySearch(detailRegionCode);
        expect(CustomFetch.fetch).toHaveBeenCalledWith(
            `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`
        );
    });

    test("fetchLibrarySearch handles fetch error correctly", async () => {
        const mockError = new Error("Fail to get library search data.");
        testCustomFetch.mockRejectedValue(new Error("Some fetch error"));

        const consoleErrorSpy = jest.spyOn(console, "error");
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        consoleErrorSpy.mockImplementation(() => {});

        try {
            await instance.testFetchLibrarySearch(detailRegionCode);
        } catch (error) {
            expect(testCustomFetch).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                new Error("Some fetch error")
            );
            expect(error).toEqual(mockError);
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    test("render should call showMessage with 'notFound' when libraries array is empty", () => {
        const showMessageSpy = jest.spyOn(instance as any, "showMessage");
        const emptyData = { libraries: [] };

        instance.testRender(emptyData);

        expect(showMessageSpy).toHaveBeenCalledWith("notFound");
        showMessageSpy.mockRestore();
    });

    test("Should call hasLibrary", () => {
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

        (hasLibrary as jest.Mock).mockImplementation(
            (libCode) => libCode === "111111"
        );

        instance.testRender(libraryData);

        expect(hasLibrary).toHaveBeenCalledWith("111111");
        expect(hasLibrary).toHaveBeenCalledWith("222222");

        (hasLibrary as jest.Mock).mockClear();
    });

    test("handleDetailRegion method should call showMessage and fetchLibrarySearch", () => {
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
