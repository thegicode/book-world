import CheckboxFavoriteBook from "../../scripts/components/CheckboxFavoriteBook";
import { addFavoriteBook, removeFavoriteBook, isFavoriteBook, } from "../../scripts/modules/model";
import { updateFavoriteBooksSize } from "../../scripts/modules/events";
jest.mock("../../scripts/modules/model", () => ({
    addFavoriteBook: jest.fn(),
    removeFavoriteBook: jest.fn(),
    isFavoriteBook: jest.fn(),
}));
jest.mock("../../scripts/modules/events", () => ({
    updateFavoriteBooksSize: jest.fn(),
}));
// let isFavoriteBookSpy: jest.SpyInstance<boolean, [isbn: string]>;
// let addFavoriteBookSpy: jest.SpyInstance<void, [isbn: string]>;
// let removeFavoriteBookSpy: jest.SpyInstance<void, [isbn: string]>;
class TestableCheckboxFavoriteBook extends CheckboxFavoriteBook {
    getInputElement() {
        return this.inputElement;
    }
    getIsbn() {
        return this.isbn;
    }
}
describe("CheckboxFavoriteBook", () => {
    let checkboxFavoriteBook;
    let parentElement;
    beforeEach(() => {
        parentElement = document.createElement("div");
    });
    afterEach(() => {
        if (document.body.contains(parentElement)) {
            document.body.removeChild(parentElement);
        }
        jest.restoreAllMocks();
    });
    test("renders correctly'", () => {
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define("checkbox-favorite-book", TestableCheckboxFavoriteBook);
        }
        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);
        parentElement.setAttribute("data-isbn", "123");
        expect(checkboxFavoriteBook.innerHTML).toContain("관심책");
    });
    test("calls addFavoriteBook when checkbox is checked'", () => {
        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define("checkbox-favorite-book", TestableCheckboxFavoriteBook);
        }
        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);
        const inputElement = checkboxFavoriteBook.getInputElement();
        if (inputElement) {
            inputElement.checked = true;
            inputElement.dispatchEvent(new Event("change"));
            expect(addFavoriteBook).toHaveBeenCalledWith("123");
            expect(removeFavoriteBook).not.toHaveBeenCalled();
            expect(updateFavoriteBooksSize).toHaveBeenCalled();
        }
    });
    test("calls removeFavoriteBook when checkbox is unchecked'", () => {
        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define("checkbox-favorite-book", TestableCheckboxFavoriteBook);
        }
        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);
        const inputElement = checkboxFavoriteBook.getInputElement();
        if (inputElement) {
            inputElement.checked = false;
            inputElement.dispatchEvent(new Event("change"));
            expect(removeFavoriteBook).toHaveBeenCalledWith("123");
            expect(addFavoriteBook).not.toHaveBeenCalled();
            expect(updateFavoriteBooksSize).toHaveBeenCalled();
        }
    });
    test("sets checked attribute if book is already favorite'", () => {
        isFavoriteBook.mockReturnValue(true);
        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define("checkbox-favorite-book", TestableCheckboxFavoriteBook);
        }
        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);
        const inputElement = checkboxFavoriteBook.getInputElement();
        if (inputElement) {
            expect(inputElement.checked).toBe(true);
        }
    });
    test("does not set checked attribute if book is not favorite''", () => {
        isFavoriteBook.mockReturnValue(false);
        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define("checkbox-favorite-book", TestableCheckboxFavoriteBook);
        }
        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);
        const inputElement = checkboxFavoriteBook.getInputElement();
        if (inputElement) {
            expect(inputElement.checked).toBe(false);
        }
    });
});
//# sourceMappingURL=CheckboxFavoriteBook.js.map