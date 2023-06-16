// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../type.d.ts" />

import { readHtmlFile, getElementFromHtml } from "../../helpers";
import { CustomFetch } from "../../../scripts/utils";
import { state } from "../../../scripts/modules/model";
import { LibraryBookExist } from "../../../scripts/components";
import FavoriteItem from "../../../scripts/pages/favorite/FavoriteItem";

jest.mock("../../../scripts/utils/CustomFetch");

class FavoriteItemForTest extends FavoriteItem {
    async testFetchData(isbn: string) {
        await this.fetchData(isbn);
    }
    testRender(data: IUsageAnalysisResult) {
        this.render(data);
    }
    getLibraryButton() {
        return this.libraryButton;
    }
}

describe("FavoriteItem", () => {
    const CUSTOM_ELEMENT_NAME = "favorite-item";
    const mockData: IUsageAnalysisResult = {
        book: {
            authors: "Author Test",
            bookImageURL: "image.png",
            bookname: "Book Test",
            class_nm: "Class Test",
            class_no: "1",
            isbn13: "1234567890",
            loanCnt: "5",
            publication_year: "2000",
            publisher: "Publisher Test",
            description: "Description Test",
        },
    };
    const mockIsbn = mockData.book.isbn13;
    const testCustomFetch = CustomFetch.fetch as jest.Mock;
    // const mockedCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;
    // const mockGetState = getState as jest.MockedFunction<typeof getState>;

    const favoriteHtml = readHtmlFile("../../markup/favorite.html");
    const template = getElementFromHtml(
        favoriteHtml,
        "#tp-favorite-item"
    ) as HTMLTemplateElement;
    let instance: FavoriteItemForTest;

    beforeEach(() => {
        testCustomFetch.mockResolvedValue(mockData);
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, FavoriteItemForTest);
        }

        const element = template.content.firstElementChild;
        instance = new FavoriteItemForTest(); // -> constructor

        instance.dataset.isbn = mockIsbn;

        if (element !== null) {
            instance.innerHTML = element.innerHTML;
        }
        document.body.appendChild(instance); // -> connectedCallback

        // console.log("beforeEach", document.body.innerHTML);
    });

    afterEach(() => {
        document.body.removeChild(instance);
        // testCustomFetch.mockClear();
        jest.clearAllMocks();
    });

    test("Should fetch data and render it", async () => {
        // testCustomFetch.mockResolvedValueOnce(mockData);
        await instance.testRender(mockData);
        expect(instance.dataset.loading).toBeUndefined();
    });

    test("fetchData handles fetch error correctly", async () => {
        const mockError = new Error("Fail to get usage analysis list.");
        testCustomFetch.mockRejectedValue(new Error("Some fetch error"));

        const consoleErrorSpy = jest.spyOn(console, "error");
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        consoleErrorSpy.mockImplementation(() => {});

        try {
            await instance.testFetchData(mockIsbn);
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

    test("onLibrary should call onLibraryBookExist method of libraryBookExist", () => {
        // Arrange
        const mockOnLibraryBookExist = jest.fn();
        const libraryBookExist =
            instance.querySelector<LibraryBookExist>("library-book-exist");
        if (libraryBookExist)
            libraryBookExist.onLibraryBookExist = mockOnLibraryBookExist;
        const libraryButton = instance.getLibraryButton();

        // Act
        libraryButton?.click();

        // Assert
        expect(mockOnLibraryBookExist).toHaveBeenCalled();
        expect(mockOnLibraryBookExist).toHaveBeenCalledWith(
            libraryButton,
            instance.dataset.isbn,
            state.libraries
        );
    });
});
