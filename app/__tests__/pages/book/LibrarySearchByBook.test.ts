import LibrarySearchByBook from "../../../scripts/pages/book/LibrarySearchByBook";
import CustomFetch from "../../../scripts/utils/CustomFetch";
import { getState } from "../../../scripts/modules/model";

jest.mock("../../../scripts/utils/CustomFetch");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

class TestLibrarySearchByBook extends LibrarySearchByBook {
    testFetchList(isbn: string) {
        this.fetchList(isbn);
    }
    testFetchLibrarySearchByBook(isbn, region, dtl_region) {
        this.fetchLibrarySearchByBook(isbn, region, dtl_region);
    }
}

describe("LibrarySearchByBook", () => {
    let testLibrarySearchByBook: TestLibrarySearchByBook;
    let originalLocation: Location;

    const mockedCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;
    const mockIsbn = "1234567890123";

    beforeAll(() => {
        customElements.define(
            "library-search-by-book",
            TestLibrarySearchByBook
        );
    });

    beforeEach(() => {
        originalLocation = window.location;
        Object.defineProperty(window, "location", {
            value: { ...originalLocation, search: `?isbn=${mockIsbn}` },
            writable: true,
        });

        if (!customElements.get("library-search-by-book")) {
            customElements.define(
                "library-search-by-book",
                TestLibrarySearchByBook
            );
        }

        testLibrarySearchByBook = new TestLibrarySearchByBook();

        const template = `<library-search-by-book>
            <h4>도서 소장 도서관 조회</h4>
            <div class="library-search-by-book"></div>
        </library-search-by-book>`;

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
        mockGetState.mockReturnValue({ regions: mockRegions });

        const fetchLibrarySearchByBookSpy = jest.spyOn(
            testLibrarySearchByBook,
            "testFetchLibrarySearchByBook"
        );
        fetchLibrarySearchByBookSpy.mockImplementation();

        await testLibrarySearchByBook.testFetchList(mockIsbn);

        expect(fetchLibrarySearchByBookSpy).toHaveBeenCalledTimes(4);
        expect(fetchLibrarySearchByBookSpy).toHaveBeenCalledWith(
            mockIsbn,
            "11",
            "1100"
        );
        expect(fetchLibrarySearchByBookSpy).toHaveBeenCalledWith(
            mockIsbn,
            "11",
            "1101"
        );
        expect(fetchLibrarySearchByBookSpy).toHaveBeenCalledWith(
            mockIsbn,
            "22",
            "2200"
        );
        expect(fetchLibrarySearchByBookSpy).toHaveBeenCalledWith(
            mockIsbn,
            "22",
            "2201"
        );
    });
});
