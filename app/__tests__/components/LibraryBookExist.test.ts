// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../type.d.ts" />

import LibraryBookExist from "../../scripts/components/LibraryBookExist";
import CustomFetch from "../../scripts/utils/CustomFetch";

jest.mock("../../scripts/utils/CustomFetch");

class TestLibraryBookExist extends LibraryBookExist {
    public setContainer(container: Element) {
        this.container = container;
    }
    public getContainer() {
        return this.container;
    }
    public testRenderBookExist(
        data: IBookExist,
        libName: string,
        index: number
    ) {
        this.renderBookExist(data, libName, index);
    }
}

describe("LibraryBookExist", () => {
    let libraryBookExist: TestLibraryBookExist;
    const mockIsbn = "1234567890123";
    const mockLibrary = {
        111007: "서울특별시교육청고덕평생학습관",
        111125: "강동구립강일도서관",
        141622: "하남시 미사도서관",
    };
    const mockData = {
        hasBook: "Y",
        loanAvailable: "Y",
    };

    const mockedCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;

    beforeEach(() => {
        const container = document.createElement("div");
        container.className = "library-list";

        if (!customElements.get("library-book-exist")) {
            customElements.define("library-book-exist", TestLibraryBookExist);
        }

        libraryBookExist = new TestLibraryBookExist();
        libraryBookExist.appendChild(container);
        libraryBookExist.setContainer(container);
        document.body.appendChild(libraryBookExist);
    });

    afterEach(() => {
        if (document.body.contains(libraryBookExist)) {
            document.body.removeChild(libraryBookExist);
        }
        jest.restoreAllMocks();
    });

    test("onLibraryBookExist fetches data and renders it correctly", async () => {
        mockedCustomFetch.fetch.mockResolvedValue(mockData);
        const button = document.createElement("button");

        const promise = libraryBookExist.onLibraryBookExist(
            button,
            mockIsbn,
            mockLibrary
        );
        const container = libraryBookExist.getContainer();

        expect(button.disabled).toBe(true);
        await promise;

        expect(mockedCustomFetch.fetch).toHaveBeenCalledTimes(
            Object.keys(mockLibrary).length
        );

        const items =
            container.querySelectorAll<HTMLLIElement>(".library-item");
        expect(items.length).toBe(Object.keys(mockLibrary).length);
        items.forEach((item, index) => {
            const name = item.querySelector(".name") as HTMLElement;
            const hasBook = item.querySelector(".hasBook") as HTMLElement;
            const loanAvailable = item.querySelector(
                ".loanAvailable"
            ) as HTMLElement;

            expect(name.textContent).toBe(
                `☼ ${Object.values(mockLibrary)[index]} : `
            );
            expect(hasBook.textContent).toBe("소장, ");
            expect(loanAvailable.textContent).toBe("대출가능");
            expect(item.dataset.loading).toBeUndefined();
        });
    });

    test("onLibraryBookExist handles fetch error correctly", async () => {
        const library = {
            141622: "하남시 미사도서관",
        };
        const mockError = new Error("Fail to get usage analysis list.");
        mockedCustomFetch.fetch.mockRejectedValue(
            new Error("Some fetch error")
        );

        const consoleErrorSpy = jest.spyOn(console, "error");
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        consoleErrorSpy.mockImplementation(() => {});

        const button = document.createElement("button");

        try {
            await libraryBookExist.onLibraryBookExist(
                button,
                mockIsbn,
                library
            );
        } catch (error) {
            expect(mockedCustomFetch.fetch).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith(
                new Error("Some fetch error")
            );
            expect(error).toEqual(mockError);
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });

    test("renderBookExist correctly updates the DOM elements", async () => {
        mockedCustomFetch.fetch.mockResolvedValue(mockData);
        const button = document.createElement("button");

        const promise = libraryBookExist.onLibraryBookExist(
            button,
            mockIsbn,
            mockLibrary
        );

        await promise;

        const testCases = [
            {
                data: { hasBook: "Y", loanAvailable: "Y" },
                expectedHasBook: "소장, ",
                expectedLoanAvailable: "대출가능",
            },
            {
                data: { hasBook: "Y", loanAvailable: "N" },
                expectedHasBook: "소장, ",
                expectedLoanAvailable: "대출불가",
            },
            {
                data: { hasBook: "N", loanAvailable: "Y" },
                expectedHasBook: "미소장",
                expectedLoanAvailable: "",
            },
        ];

        testCases.forEach(
            ({ data, expectedHasBook, expectedLoanAvailable }, index) => {
                libraryBookExist.testRenderBookExist(
                    data,
                    "Test Library",
                    index
                );
                const el = libraryBookExist.querySelectorAll(".library-item")[
                    index
                ] as HTMLElement;
                const elName = el.querySelector(".name") as HTMLElement;
                const elHasBook = el.querySelector(".hasBook") as HTMLElement;
                const elLoanAvailable = el.querySelector(
                    ".loanAvailable"
                ) as HTMLElement;

                expect(elName.textContent).toBe("☼ Test Library : ");
                expect(elHasBook.textContent).toBe(expectedHasBook);
                expect(elLoanAvailable.textContent).toBe(expectedLoanAvailable);
            }
        );
    });
});
