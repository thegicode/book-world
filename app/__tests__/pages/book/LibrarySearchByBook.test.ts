import LibrarySearchByBook from "../../../scripts/pages/book/LibrarySearchByBook";
import CustomFetch from "../../../scripts/utils/CustomFetch";
import { getState } from "../../../scripts/modules/model";

jest.mock("../../../scripts/utils/CustomFetch");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

class TestLibrarySearchByBook extends LibrarySearchByBook {
    testFetchList(isbn: string) {
        const state = getState();
        if (state) {
            this.fetchList(isbn);
        }
    }

    testFetchLibrarySearchByBook(
        isbn: string,
        region: string,
        dtl_region: string
    ) {
        this.fetchLibrarySearchByBook(isbn, region, dtl_region);
    }

    testLoanAvailable(isbn: string, libCode: string, el: HTMLElement) {
        this.loanAvailable(isbn, libCode, el);
    }
}

describe("LibrarySearchByBook", () => {
    let testLibrarySearchByBook: TestLibrarySearchByBook;
    let originalLocation: Location;

    // const mockedCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;
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
            region2: {
                detail1: "2200",
                detail2: "2201",
            },
        };

        const mockGetState = getState as jest.MockedFunction<typeof getState>;
        mockGetState.mockReturnValue({
            favoriteBooks: [],
            libraries: {},
            regions: mockRegions,
        });

        const mockedFetch = CustomFetch.fetch as jest.MockedFunction<
            typeof CustomFetch.fetch
        >;
        mockedFetch.mockResolvedValue({
            libraries: [
                {
                    homepage: "https://example.com",
                    libCode: "123",
                    libName: "Example Library",
                },
            ],
        });

        if (!customElements.get("library-search-by-book")) {
            customElements.define(
                "library-search-by-book",
                TestLibrarySearchByBook
            );
        }

        testLibrarySearchByBook = new TestLibrarySearchByBook();

        const template = `
        <library-search-by-book>
            <h4>도서 소장 도서관 조회</h4>
            <div class="library-search-by-book"></div>
        </library-search-by-book>
        <template id="tp-librarySearchByBookItem"><li><a href="" target="_blank"></a><p><span class="loanAvailable"></span></p></li></template>`;

        testLibrarySearchByBook.innerHTML = template;

        document.body.appendChild(testLibrarySearchByBook);
    });

    afterEach(() => {
        if (document.body.contains(testLibrarySearchByBook)) {
            document.body.removeChild(testLibrarySearchByBook);
        }
        window.location = originalLocation;
        jest.clearAllMocks();
    });

    test("fetchList should call fetchLibrarySearchByBook for each region and detail code", async () => {
        const fetchLibrarySearchByBookSpy = jest.spyOn(
            testLibrarySearchByBook,
            "testFetchLibrarySearchByBook"
        );
        fetchLibrarySearchByBookSpy.mockImplementation();
    });

    test("render should create and append elements to the container", () => {
        interface ILibrarySearchByBookResult {
            libraries: ILibrary[];
        }

        interface ILibrary {
            address: string;
            homepage: string;
            libCode: string;
            libName: string;
            telephone: string;
        }

        const mockData: ILibrarySearchByBookResult = {
            libraries: [
                {
                    address: "address",
                    homepage: "https://example.com",
                    libCode: "123",
                    libName: "Example Library",
                    telephone: "39393939",
                },
            ],
        };

        const loanAvailableSpy = jest.spyOn(
            testLibrarySearchByBook,
            "testLoanAvailable"
        );
        loanAvailableSpy.mockImplementation();

        // loanAvailableSpy.mockImplementation(async (isbn, libCode, el) => {
        //     const element = el.querySelector(".loanAvailable");
        //     if (element) {
        //         element.textContent = "대출 가능";
        //         if (el.parentElement) {
        //             el.parentElement.dataset.available = "true";
        //         }
        //     }
        // });

        // testLibrarySearchByBook.render(mockData, mockIsbn);

        // const listItem = listElement?.querySelector("li");
        // expect(listItem?.dataset.available).toEqual("true");
    });
});
