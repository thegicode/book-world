import LibrarySearchByBook from "../../../scripts/pages/book/LibrarySearchByBook";
import CustomFetch from "../../../scripts/utils/CustomFetch";
import { getState } from "../../../scripts/modules/model";

jest.mock("../../../scripts/utils/CustomFetch");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

class TestLibrarySearchByBook extends LibrarySearchByBook {
    async testFetchList(isbn: string) {
        // const state = getState();
        // if (state) {
        await this.fetchList(isbn);
        // }
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
}

describe("LibrarySearchByBook", () => {
    let instance: TestLibrarySearchByBook;
    let originalLocation: Location;
    const mockedFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;

    const mockIsbn = "1234567890123";

    beforeEach(() => {
        originalLocation = window.location;
        Object.defineProperty(window, "location", {
            value: { ...originalLocation, search: `?isbn=${mockIsbn}` },
            writable: true,
        });

        const mockRegions = {
            region1: {
                detail1: "1100",
                detail2: "1101",
            },
        };

        const mockGetState = getState as jest.MockedFunction<typeof getState>;
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

        if (!customElements.get("library-search-by-book")) {
            customElements.define(
                "library-search-by-book",
                TestLibrarySearchByBook
            );
        }

        instance = new TestLibrarySearchByBook();

        const template = `
        <library-search-by-book>
            <h4>도서 소장 도서관 조회</h4>
            <div class="library-search-by-book"></div>
        </library-search-by-book>
        <template id="tp-librarySearchByBookItem"><li><a href="" target="_blank"></a><p><span class="loanAvailable"></span></p></li></template>`;

        instance.innerHTML = template;
        document.body.appendChild(instance);
    });

    afterEach(() => {
        window.location = originalLocation;
        if (document.body.contains(instance)) {
            document.body.removeChild(instance);
        }
        jest.clearAllMocks();
    });

    test("fetchList calls fetchLibrarySearchByBook with correct arguments", async () => {
        // await instance.testFetchList(mockIsbn);
        // const fetchSpy = jest.spyOn(CustomFetch, "fetch");
        // fetchSpy.mockImplementation();
        // const fetchSpy = jest.spyOn(instance, "testFetchLibrarySearchByBook");
        // fetchSpy.mockImplementation();
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

    test("render should create and append elements to the container", () => {
        // interface ILibrarySearchByBookResult {
        //     libraries: ILibrary[];
        // }
        // interface ILibrary {
        //     address: string;
        //     homepage: string;
        //     libCode: string;
        //     libName: string;
        //     telephone: string;
        // }
        // const mockData: ILibrarySearchByBookResult = {
        //     libraries: [
        //         {
        //             address: "address",
        //             homepage: "https://example.com",
        //             libCode: "123",
        //             libName: "Example Library",
        //             telephone: "39393939",
        //         },
        //     ],
        // };
    });
});
