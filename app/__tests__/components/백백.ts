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
    public reRender() {
        this.connectedCallback();
    }
}

describe("CheckboxFavoriteBook", () => {
    let element: TestableCheckboxFavoriteBook;

    beforeEach(() => {
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define(
                "checkbox-favorite-book",
                TestableCheckboxFavoriteBook
            );
        }
        element = new TestableCheckboxFavoriteBook();
        document.body.appendChild(element);
    });

    afterEach(() => {
        element.remove();
        jest.clearAllMocks();
    });

    test("renders correctly", () => {
        element.setAttribute("data-isbn", "123");
        // element.render();
        expect(element.innerHTML).toContain("관심책");
    });

    test("calls addFavoriteBook when checkbox is checked", () => {
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input") as HTMLInputElement;
        input.checked = true;
        input.dispatchEvent(new Event("change"));
        expect(addFavoriteBook).toHaveBeenCalledWith("123");
        expect(removeFavoriteBook).not.toHaveBeenCalled();
        expect(updateFavoriteBooksSize).toHaveBeenCalled();
    });

    test("calls removeFavoriteBook when checkbox is unchecked", () => {
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input") as HTMLInputElement;
        input.checked = false;
        input.dispatchEvent(new Event("change"));
        expect(removeFavoriteBook).toHaveBeenCalledWith("123");
        expect(addFavoriteBook).not.toHaveBeenCalled();
        expect(updateFavoriteBooksSize).toHaveBeenCalled();
    });

    test("sets checked attribute if book is already favorite", () => {
        (isFavoriteBook as jest.Mock).mockReturnValue(true);
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input") as HTMLInputElement;
        expect(input.checked).toBe(true);
    });

    test("does not set checked attribute if book is not favorite", () => {
        (isFavoriteBook as jest.Mock).mockReturnValue(false);
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input") as HTMLInputElement;
        expect(input.checked).toBe(false);
    });
});
