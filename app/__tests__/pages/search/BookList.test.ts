/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Observer,
    CustomFetch,
    // CustomEventEmitter,
} from "../../../scripts/utils/index";
import BookList from "../../../scripts/pages/search/BookList";
import { readHtmlFile } from "../../helpers";

jest.mock("../../../scripts/utils/index");

describe("BookList", () => {
    const CUSTOM_ELEMENT_NAME = "book-list";
    let bookList: BookList | null;
    let mockFetch: jest.Mock;
    const mockData = {
        total: 10,
        display: 10,
        items: [{ title: "Test Book" }],
    };

    const searchHtml = readHtmlFile("../../markup/search.html");

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, BookList);
        }

        document.body.innerHTML = searchHtml;
        bookList = document.querySelector("book-list") as BookList;

        mockFetch = (CustomFetch.fetch as jest.Mock).mockImplementation(() =>
            Promise.resolve(mockData)
        );
    });

    afterEach(() => {
        document.body.innerHTML = "";
        bookList = null;

        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("'disconnectedCallback' should execute without errors when 'observer' is null", () => {
        const instance = bookList as any;

        instance.observer = null;

        expect(() => {
            instance.disconnectedCallback();
        }).not.toThrow();
    });

    test("setupObserver", () => {
        const instance = bookList as any;
        instance.setupObserver();
        expect(Observer).toHaveBeenCalled();
    });

    describe("onSearchPageInit", () => {
        test("should call handleKeywordPresent if keyword is present", () => {
            const instance = bookList as any;
            const event = new CustomEvent<{ keyword: string }>(
                "search-page-init",
                {
                    detail: { keyword: "test" },
                }
            );
            const mockHandleKeywordPresent = jest.spyOn(
                instance,
                "handleKeywordPresent"
            );
            instance.onSearchPageInit(event);

            expect(instance.keyword).toBe("test");
            expect(instance.length).toBe(0);
            expect(mockHandleKeywordPresent).toHaveBeenCalled();

            mockHandleKeywordPresent.mockRestore();
        });

        test("should call handleKeywordAbsent if keyword is absent", () => {
            const instance = bookList as any;
            const event = new CustomEvent<{ keyword: string }>(
                "search-page-init",
                {
                    detail: { keyword: "" },
                }
            );
            const mockHandleKeywordAbsent = jest.spyOn(
                instance,
                "handleKeywordAbsent"
            );

            instance.onSearchPageInit(event);

            expect(instance.keyword).toBe("");
            expect(instance.length).toBe(0);
            expect(mockHandleKeywordAbsent).toHaveBeenCalled();
        });
    });

    test("handleKeywordPresent should initiate loading", async () => {
        const instance = bookList as any;
        const showMessageSpy = jest.spyOn(instance, "showMessage");

        instance.keyword = "test";
        instance.length = 0;
        await instance.handleKeywordPresent();

        expect(showMessageSpy).toHaveBeenCalledWith("loading");
    });

    test("handleKeywordAbsent should hide pagingInfo and show a message", () => {
        const instance = bookList as any;
        const showMessageSpy = jest.spyOn(instance, "showMessage");

        instance.handleKeywordAbsent();

        expect(showMessageSpy).toHaveBeenCalledWith("message");
        expect(instance.pagingInfo.hidden).toBeTruthy();
    });

    describe("fetchSearchNaverBook", () => {
        test("fetchSearchNaverBook should fetch data and render it", async () => {
            const instance = bookList as any;
            instance.keyword = "test";
            instance.length = 0;

            await instance.fetchSearchNaverBook();

            expect(mockFetch).toHaveBeenCalledWith(
                "/search-naver-book?keyword=test&display=10&start=1"
            );
            expect(instance.length).toBe(mockData.display);
            expect(instance.pagingInfo.hidden).toBeFalsy();
        });

        test("fetchSearchNaverBook should execute without errors when keyword is null", async () => {
            const instance = bookList as any;
            instance.keyword = null;

            await expect(
                instance.fetchSearchNaverBook()
            ).resolves.not.toThrow();
        });

        test("should throw an error and log it when fetching fails", async () => {
            const instance = bookList as any;
            const errorMsg = "Mock error message";
            instance.keyword = "test";
            jest.spyOn(console, "error").mockImplementation(() => {});
            jest.spyOn(CustomFetch, "fetch").mockRejectedValue(
                new Error(errorMsg)
            );

            await expect(instance.fetchSearchNaverBook()).rejects.toThrow(
                `Failed to get books with keyword ${instance.keyword}.`
            );

            expect(console.error).toHaveBeenCalledWith(new Error(errorMsg));
        });
    });

    describe("render", () => {
        test("should call showMessage 'notFound' when total is 0", async () => {
            const instance = bookList as any;
            const data = {
                total: 0,
                display: 0,
                items: [],
            };
            const showMessageSpy = jest.spyOn(instance, "showMessage");

            await instance.render(data);

            expect(showMessageSpy).toHaveBeenCalledWith("notFound");
        });

        test("render should call the relevant methods based on the data", async () => {
            const mockLength = 0;

            const instance = bookList as any;
            instance.length = mockLength;
            const appendBookItemsSpy = jest.spyOn(instance, "appendBookItems");
            const updatePagingInfoSpy = jest.spyOn(
                instance,
                "updatePagingInfo"
            );
            const originalObserver = instance.observer;

            await instance.render(mockData);

            expect(updatePagingInfoSpy).toHaveBeenCalledWith({
                total: mockData.total,
                display: mockData.display,
            });
            expect(appendBookItemsSpy).toHaveBeenCalledWith(
                mockData.items,
                mockLength
            );
            expect(instance.observer.observe).not.toHaveBeenCalled();

            instance.observer = originalObserver;
        });

        test("total === this.length", async () => {
            const instance = bookList as any;
            const originalObserver = instance.observer;
            const mockData = {
                total: 10,
                display: 7,
                items: [
                    {
                        title: "1",
                    },
                ],
            };
            instance.length = 0;
            instance.observer = {
                observe: jest.fn(),
                disconnect: jest.fn(),
            };

            await instance.render(mockData);

            expect(instance.observer.observe).toHaveBeenCalled();

            instance.observer = originalObserver;
        });
    });

    describe("appendBookItems", () => {
        const items = mockData.items;
        let instance: any;

        beforeEach(() => {
            instance = bookList as any;
            instance.initializeProperties();
        });

        test("When template is not available", () => {
            document.body.querySelector("#tp-book-item")?.remove();

            expect(() => {
                instance.appendBookItems(items, 0);
            }).not.toThrow();
        });

        test("When template.content.firstElementChild is not available", () => {
            const tp = document.body.querySelector("#tp-book-item");
            if (tp) {
                tp.innerHTML = "";
            }

            expect(() => {
                instance.appendBookItems(items, 0);
            }).not.toThrow();
        });
    });

    describe("showMessage", () => {
        test("When template is not available", () => {
            const type = "undefined-type";
            const instance = bookList as any;

            expect(() => {
                instance.showMessage(type);
            }).not.toThrow();
        });

        test("When template.content.firstElementChild is not available", () => {
            const type = "notFound";
            const instance = bookList as any;

            const tp = document.body.querySelector("#tp-notFound");
            if (tp) {
                tp.innerHTML = "";
            }

            expect(() => {
                instance.showMessage(type);
            }).not.toThrow();
        });
    });
});
