import CheckboxFavoriteBook from "../../scripts/components/CheckboxFavoriteBook";
import {
    addFavoriteBook,
    removeFavoriteBook,
    isFavoriteBook,
} from "../../scripts/modules/model";
import { updateFavoriteBooksSize } from "../../scripts/modules/events";

jest.mock("../../scripts/modules/model", () => ({
    addFavoriteBook: jest.fn(),
    removeFavoriteBook: jest.fn(),
    isFavoriteBook: jest.fn(),
}));

jest.mock("../../scripts/modules/events", () => ({
    updateFavoriteBooksSize: jest.fn(),
}));

class TestableCheckboxFavoriteBook extends CheckboxFavoriteBook {
    public getInputElement() {
        return this.inputElement;
    }
    public getIsbn() {
        return this.isbn;
    }
    // onChange() {
    //     this.onChange();
    // }
}

describe("CheckboxFavoriteBook", () => {
    const CUSTOM_ELEMENT_NAME = "checkbox-favorite-book";
    let parentElement: HTMLElement;
    let checkboxFavoriteBook: TestableCheckboxFavoriteBook;
    let isbn: string | null;
    let inputElement: HTMLInputElement | null;
    const isbnCode = "123456";

    afterEach(() => {
        if (document.body.contains(parentElement)) {
            document.body.removeChild(parentElement);
        }
        jest.restoreAllMocks();
    });

    describe("event listner", () => {
        beforeEach(() => {
            parentElement = document.createElement("div");
            parentElement.dataset.isbn = isbnCode;
            if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
                customElements.define(
                    CUSTOM_ELEMENT_NAME,
                    TestableCheckboxFavoriteBook
                );
            }
            checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
            // parentElement.appendChild(checkboxFavoriteBook);
            // document.body.appendChild(parentElement);
            // isbn = checkboxFavoriteBook.getIsbn();
            // inputElement = checkboxFavoriteBook.getInputElement();
        });

        test("adds event listener to the input element", () => {
            checkboxFavoriteBook.connectedCallback();
            const input = checkboxFavoriteBook.getInputElement();
            expect(input?.onchange).toBeDefined();
        });

        // test("removes event listener when inputElement is present", () => {
        //     checkboxFavoriteBook.connectedCallback();
        //     const input = checkboxFavoriteBook.getInputElement();
        //     expect(input).toBeDefined();
        //     if (input) {
        //         expect(input?.onchange).toBeNull();
        //     } else {
        //         expect(input).toBeNull();
        //     }
        // });

        test("does not remove event listener when inputElement is null", () => {
            checkboxFavoriteBook.disconnectedCallback();
            const input = checkboxFavoriteBook.getInputElement();
            expect(input).toBeNull();
        });
    });

    describe("when parent element has not data-isbn", () => {
        beforeEach(() => {
            parentElement = document.createElement("div");
            if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
                customElements.define(
                    CUSTOM_ELEMENT_NAME,
                    TestableCheckboxFavoriteBook
                );
            }
            checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
            parentElement.appendChild(checkboxFavoriteBook);
            document.body.appendChild(parentElement);
            isbn = checkboxFavoriteBook.getIsbn();
            inputElement = checkboxFavoriteBook.getInputElement();
        });

        test("renders correctly'", () => {
            expect(isbn).toBeNull();
            expect(inputElement?.checked).toBe(false);
        });

        test("inputElement change event ", () => {
            if (inputElement) {
                inputElement.checked = false;
                inputElement.dispatchEvent(new Event("change"));
                expect(removeFavoriteBook).not.toHaveBeenCalled();
                expect(addFavoriteBook).not.toHaveBeenCalled();
                expect(updateFavoriteBooksSize).not.toHaveBeenCalled();
            }
        });
    });

    describe("when checkbox is checked", () => {
        beforeEach(() => {
            (isFavoriteBook as jest.Mock).mockReturnValue(true);

            parentElement = document.createElement("div");
            parentElement.dataset.isbn = isbnCode;
            if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
                customElements.define(
                    CUSTOM_ELEMENT_NAME,
                    TestableCheckboxFavoriteBook
                );
            }
            checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
            parentElement.appendChild(checkboxFavoriteBook);
            document.body.appendChild(parentElement);
            isbn = checkboxFavoriteBook.getIsbn();
            inputElement = checkboxFavoriteBook.getInputElement();
        });

        test("renders correctly'", () => {
            expect(isbn).toBe(isbnCode);
            expect(inputElement?.checked).toBe(true);
            expect(checkboxFavoriteBook.innerHTML).toContain("관심책");
        });

        test("checkbox checked'", () => {
            expect(inputElement?.checked).toBe(true);
            expect(checkboxFavoriteBook.innerHTML).toContain("관심책");
        });

        test("inputElement change event : removeFavoriteBook", () => {
            if (inputElement) {
                inputElement.checked = false;
                inputElement.dispatchEvent(new Event("change"));
                expect(removeFavoriteBook).toHaveBeenCalledWith(isbnCode);
                expect(addFavoriteBook).not.toHaveBeenCalled();
                expect(updateFavoriteBooksSize).toHaveBeenCalled();
            } else {
                expect(addFavoriteBook).not.toHaveBeenCalled();
                expect(removeFavoriteBook).not.toHaveBeenCalled();
                expect(updateFavoriteBooksSize).not.toHaveBeenCalled();
            }
        });
    });

    describe("when checkbox is unchecked", () => {
        beforeEach(() => {
            (isFavoriteBook as jest.Mock).mockReturnValue(false);

            parentElement = document.createElement("div");
            parentElement.dataset.isbn = isbnCode;
            if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
                customElements.define(
                    CUSTOM_ELEMENT_NAME,
                    TestableCheckboxFavoriteBook
                );
            }
            checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
            parentElement.appendChild(checkboxFavoriteBook);
            document.body.appendChild(parentElement);
            isbn = checkboxFavoriteBook.getIsbn();
            inputElement = checkboxFavoriteBook.getInputElement();
        });

        test("renders correctly and checkbox unchcekd'", () => {
            expect(inputElement?.checked).toBe(false);
            expect(checkboxFavoriteBook.innerHTML).toContain("관심책");
        });

        test("inputElement change event : addFavoriteBook", () => {
            if (inputElement) {
                inputElement.checked = true;
                inputElement.dispatchEvent(new Event("change"));
                expect(addFavoriteBook).toHaveBeenCalledWith(isbnCode);
                expect(removeFavoriteBook).not.toHaveBeenCalled();
                expect(updateFavoriteBooksSize).toHaveBeenCalled();
            } else {
                expect(addFavoriteBook).not.toHaveBeenCalled();
                expect(removeFavoriteBook).not.toHaveBeenCalled();
                expect(updateFavoriteBooksSize).not.toHaveBeenCalled();
            }
        });
    });
});
