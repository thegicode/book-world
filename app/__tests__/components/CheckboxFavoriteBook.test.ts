import CheckboxFavoriteBook from "../../scripts/components/CheckboxFavoriteBook";
import * as model from "../../scripts/modules/model";
import { updateFavoriteBooksSize } from "../../scripts/modules/events";

// jest.mock("../../scripts/modules/events");

jest.mock("../../scripts/modules/events", () => ({
    updateFavoriteBooksSize: jest.fn(),
}));

let isFavoriteBookSpy: jest.SpyInstance<boolean, [isbn: string]>;
let addFavoriteBookSpy: jest.SpyInstance<void, [isbn: string]>;
let removeFavoriteBookSpy: jest.SpyInstance<void, [isbn: string]>;

class TestableCheckboxFavoriteBook extends CheckboxFavoriteBook {
    public getInputElement() {
        return this.inputElement;
    }
    public getIsbn() {
        return this.isbn;
    }
}

describe("CheckboxFavoriteBook", () => {
    let checkboxFavoriteBook: TestableCheckboxFavoriteBook;
    let parentElement: HTMLElement;

    beforeEach(() => {
        parentElement = document.createElement("div");
    });

    afterEach(() => {
        if (document.body.contains(parentElement)) {
            document.body.removeChild(parentElement);
        }
        jest.restoreAllMocks();
    });

    test("it should render input element with checkbox type and it should set checkbox to unchecked if the book is not a favorite", () => {
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define(
                "checkbox-favorite-book",
                TestableCheckboxFavoriteBook
            );
        }
        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);

        const inputElement = checkboxFavoriteBook.getInputElement();

        expect(inputElement).not.toBeNull();
        expect(checkboxFavoriteBook.getIsbn()).toBeNull();
        expect(inputElement?.checked).toBe(false);
    });

    test("it should set checkbox to checked if the book is a favorite", () => {
        isFavoriteBookSpy = jest.spyOn(model, "isFavoriteBook");
        isFavoriteBookSpy.mockReturnValue(true);

        // const mockIsFavoriteBook = jest.fn().mockReturnValue(true);
        // jest.spyOn(model, "isFavoriteBook").mockImplementation(() =>
        //     mockIsFavoriteBook()
        // );

        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define(
                "checkbox-favorite-book",
                TestableCheckboxFavoriteBook
            );
        }

        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);

        const inputElement = checkboxFavoriteBook.getInputElement();

        expect(checkboxFavoriteBook.getIsbn()).toBe(isbnCode);
        expect(inputElement?.checked).toBe(true);
    });

    test("add favoritebook", () => {
        addFavoriteBookSpy = jest.spyOn(model, "addFavoriteBook");

        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define(
                "checkbox-favorite-book",
                TestableCheckboxFavoriteBook
            );
        }

        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);

        const inputElement = checkboxFavoriteBook.getInputElement();
        if (inputElement) {
            inputElement.checked = true;
            inputElement.dispatchEvent(new Event("change"));
            expect(addFavoriteBookSpy).toHaveBeenCalledWith(isbnCode);
            expect(updateFavoriteBooksSize).toHaveBeenCalled();
        }
    });

    test("remove favoritebook", () => {
        isFavoriteBookSpy = jest.spyOn(model, "isFavoriteBook");
        isFavoriteBookSpy.mockReturnValue(true);
        removeFavoriteBookSpy = jest.spyOn(model, "removeFavoriteBook");

        const isbnCode = "123";
        parentElement.dataset.isbn = isbnCode;
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define(
                "checkbox-favorite-book",
                TestableCheckboxFavoriteBook
            );
        }

        checkboxFavoriteBook = new TestableCheckboxFavoriteBook();
        parentElement.appendChild(checkboxFavoriteBook);
        document.body.appendChild(parentElement);

        const inputElement = checkboxFavoriteBook.getInputElement();
        if (inputElement) {
            inputElement.checked = false;
            inputElement.dispatchEvent(new Event("change"));
            expect(removeFavoriteBookSpy).toHaveBeenCalledWith(isbnCode);
            expect(updateFavoriteBooksSize).toHaveBeenCalled();
        }
    });
});
