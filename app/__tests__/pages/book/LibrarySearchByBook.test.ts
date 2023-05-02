// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../type.d.ts" />
/// <reference types="node" />

import fs from "fs";
import path from "path";

import LibrarySearchByBook from "../../../scripts/pages/book/LibrarySearchByBook";
import CustomFetch from "../../../scripts/utils/CustomFetch";
import { getState } from "../../../scripts/modules/model";

jest.mock("../../../scripts/utils/CustomFetch");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

class TestLibrarySearchByBook extends LibrarySearchByBook {
    async testFetchList(isbn: string) {
        await this.fetchList(isbn);
    }

    async testFetchLibrarySearchByBook(
        isbn: string,
        region: string,
        dtl_region: string
    ) {
        await this.fetchLibrarySearchByBook(isbn, region, dtl_region);
    }

    async testLoanAvailable(isbn: string, libCode: string, el: HTMLElement) {
        await this.loanAvailable(isbn, libCode, el);
    }

    async testFetchLoadnAvailabilty(
        isbn: string,
        libCode: string
    ): Promise<boolean> {
        return await this.fetchLoadnAvailabilty(isbn, libCode);
    }

    testRender({ libraries }: ILibrarySearchByBookResult, isbn: string) {
        this.render({ libraries }, isbn);
    }

    testCreateLibrarySearchResultItem(
        isbn: string,
        homepage: string,
        libCode: string,
        libName: string
    ) {
        return this.createLibrarySearchResultItem(
            isbn,
            homepage,
            libCode,
            libName
        );
    }
}

function readHtml() {
    const filePath = path.join(__dirname, "../../../markup/book.html");
    return fs.readFileSync(filePath, "utf-8");
}

function getElement(bookHtml: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(bookHtml, "text/html");
    return doc.querySelector("library-search-by-book") as HTMLElement | null;
}

describe("LibrarySearchByBook", () => {
    const CUSTOM_ELEMENT_NAME = "library-search-by-book";

    let instance: TestLibrarySearchByBook;
    let originalLocation: Location;
    const bookHtml = readHtml();
    const element = getElement(bookHtml);

    const mockedFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;
    const mockIsbn = "1234567890123";

    beforeEach(() => {
        originalLocation = window.location;
        Object.defineProperty(window, "location", {
            value: { ...originalLocation, search: `?isbn=${mockIsbn}` },
            writable: true,
        });
    });

    afterEach(() => {
        window.location = originalLocation;
        if (document.body.contains(instance) && instance !== null) {
            document.body.removeChild(instance);
        }
        instance.innerHTML = "";
        document.body.innerHTML = "";
        jest.clearAllMocks();

        // console.log("instance.body", instance.innerHTML);
    });

    describe("check state, libries, template", () => {
        const mockGetState = getState as jest.MockedFunction<typeof getState>;
        beforeEach(() => {
            if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
                customElements.define(
                    CUSTOM_ELEMENT_NAME,
                    TestLibrarySearchByBook
                );
            }

            // console.log("instance", instance.innerHTML);
            // console.log("document.body", document.body.innerHTML);
        });

        test("fetchList : regions = {}", async () => {
            mockGetState.mockReturnValue({
                favoriteBooks: [],
                libraries: {},
                regions: {},
            });

            instance = new TestLibrarySearchByBook();

            if (element !== null) {
                instance.appendChild(element);
            }
            document.body.appendChild(instance);

            expect(
                document.body.querySelector(".library-search-by-book")
                    ?.textContent
            ).toBe("");
        });

        test("fetchList : detail region = {}", async () => {
            mockGetState.mockReturnValue({
                favoriteBooks: [],
                libraries: {},
                regions: {
                    detail1: {},
                },
            });

            if (element !== null) {
                instance.appendChild(element);
            }

            document.body.appendChild(instance);

            expect(
                document.body.querySelector(".library-search-by-book")
                    ?.textContent
            ).toBe("");
        });

        test("render : libraries.length < 1", () => {
            const mockData: ILibrarySearchByBookResult = {
                libraries: [],
            };

            if (element !== null) {
                instance.appendChild(element);
            }
            instance.testRender(mockData, mockIsbn);

            expect(
                instance.querySelector(".library-search-by-book")?.textContent
            ).toBe("");
        });

        test("render : !container", () => {
            const mockData: ILibrarySearchByBookResult = {
                libraries: [
                    {
                        address: "address",
                        homepage: "https://example.com",
                        libCode: "123",
                        libName: "Example Library",
                        telephone: "0101234567",
                    },
                ],
            };
            instance.innerHTML = "<div></div>";
            instance.testRender(mockData, mockIsbn);
            expect(
                instance.querySelector(".library-search-by-book")
            ).toBeNull();
        });

        test("createLibrarySearchResultItem: !template", () => {
            document.body.innerHTML = `
                <library-search-by-book>
                    <h4>도서 소장 도서관 조회</h4>
                    <div class="library-search-by-book"></div>
                </library-search-by-book>`;

            instance.testCreateLibrarySearchResultItem(
                mockIsbn,
                "homepage",
                "libCode",
                "libName"
            );

            expect(
                document.body.querySelector("#tp-librarySearchByBookItem")
            ).toBeNull();
        });

        test("createLibrarySearchResultItem: not exist a element in template", () => {
            document.body.innerHTML = `
                <library-search-by-book>
                    <h4>도서 소장 도서관 조회</h4>
                    <div class="library-search-by-book"></div>
                </library-search-by-book>
                <template id="tp-librarySearchByBookItem"><li><p><span class="loanAvailable"></span></p></li></template>`;

            instance.testCreateLibrarySearchResultItem(
                mockIsbn,
                "homepage",
                "libCode",
                "libName"
            );

            const template = document.querySelector(
                "#tp-librarySearchByBookItem"
            ) as HTMLTemplateElement;

            const cloned = template.content.firstElementChild?.cloneNode(
                true
            ) as HTMLElement;

            expect(cloned.querySelector("a")).toBeNull();
        });

        test("createLibrarySearchResultItem: cloned null", () => {
            document.body.innerHTML = `
                <library-search-by-book>
                    <h4>도서 소장 도서관 조회</h4>
                    <div class="library-search-by-book"></div>
                </library-search-by-book>
                <template id="tp-librarySearchByBookItem"></template>`;

            instance.testCreateLibrarySearchResultItem(
                mockIsbn,
                "homepage",
                "libCode",
                "libName"
            );

            const template = document.querySelector(
                "#tp-librarySearchByBookItem"
            ) as HTMLTemplateElement;

            const cloned = template.content.firstElementChild?.cloneNode(
                true
            ) as HTMLElement;

            expect(cloned).toBeUndefined();
        });
    });

    describe("state > 0 & libraries > 0", () => {
        beforeEach(() => {
            const mockRegions = {
                region1: {
                    detail1: "1100",
                    detail2: "1101",
                },
            };

            const mockGetState = getState as jest.MockedFunction<
                typeof getState
            >;
            mockGetState.mockReturnValue({
                favoriteBooks: [],
                libraries: {},
                regions: mockRegions,
            });

            mockedFetch.fetch.mockResolvedValue({
                libraries: [
                    {
                        address: "address",
                        homepage: "https://example.com",
                        libCode: "001",
                        libName: "Test Library A",
                        telephone: "010300030303",
                    },
                ],
            });

            if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
                customElements.define(
                    CUSTOM_ELEMENT_NAME,
                    TestLibrarySearchByBook
                );
            }

            instance = new TestLibrarySearchByBook();

            document.body.innerHTML = bookHtml;
        });

        test("loanAvailable sets available data attribute when isAvailable is true", async () => {
            const mockLibCode = "001111";
            const fetchSpy = jest.spyOn(CustomFetch, "fetch");
            fetchSpy.mockResolvedValue({ loanAvailable: "Y" });
            const el = document.createElement("li");
            const childEl = document.createElement("span");
            childEl.className = "loanAvailable";

            el.appendChild(childEl);

            await instance.testLoanAvailable(mockIsbn, mockLibCode, el);
            expect(fetchSpy).toHaveBeenCalled();
            expect(el.dataset.available).toEqual("true");
            fetchSpy.mockRestore();
        });

        test("fetchLibrarySearchByBoook handles fetch error correctly", async () => {
            const mockError = new Error("Fail to get library search by book.");
            mockedFetch.fetch.mockRejectedValue(new Error("Some fetch error"));

            const consoleErrorSpy = jest.spyOn(console, "error");
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            consoleErrorSpy.mockImplementation(() => {});

            try {
                await instance.testFetchLibrarySearchByBook(
                    mockIsbn,
                    "region",
                    "12345"
                );
            } catch (error) {
                expect(mockedFetch.fetch).toHaveBeenCalled();
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    new Error("Some fetch error")
                );
                expect(error).toEqual(mockError);
            } finally {
                consoleErrorSpy.mockRestore();
            }
        });

        test("fetchLoadnAvailabilty handles fetch error correctly", async () => {
            const mockError = new Error("Fail to get book exist.");
            mockedFetch.fetch.mockRejectedValue(new Error("Some fetch error"));

            const consoleErrorSpy = jest.spyOn(console, "error");
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            consoleErrorSpy.mockImplementation(() => {});

            try {
                await instance.testFetchLoadnAvailabilty(mockIsbn, "12345");
            } catch (error) {
                expect(mockedFetch.fetch).toHaveBeenCalled();
                expect(consoleErrorSpy).toHaveBeenCalledWith(
                    new Error("Some fetch error")
                );
                expect(error).toEqual(mockError);
            } finally {
                consoleErrorSpy.mockRestore();
            }
        });

        test("createLibrarySearchResultItem", () => {
            const homepage = "https://example.com/";
            const libCode = "123";
            const libName = "Example Library";
            const element = instance.testCreateLibrarySearchResultItem(
                mockIsbn,
                homepage,
                libCode,
                libName
            );
            expect(element?.dataset.code).toBe(libCode);
            const link = element?.querySelector("a");
            expect(link?.textContent).toBe(libName);
            expect(link?.href).toBe(homepage);
        });
    });
});
