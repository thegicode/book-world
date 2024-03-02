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
class TestableCheckboxFavoriteBook extends CheckboxFavoriteBook {
    getInputElement() {
        return this.inputElement;
    }
    getIsbn() {
        return this.isbn;
    }
    reRender() {
        this.connectedCallback();
    }
}
describe("CheckboxFavoriteBook", () => {
    let element;
    beforeEach(() => {
        if (!customElements.get("checkbox-favorite-book")) {
            customElements.define("checkbox-favorite-book", TestableCheckboxFavoriteBook);
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
        const input = element.querySelector("input");
        input.checked = true;
        input.dispatchEvent(new Event("change"));
        expect(addFavoriteBook).toHaveBeenCalledWith("123");
        expect(removeFavoriteBook).not.toHaveBeenCalled();
        expect(updateFavoriteBooksSize).toHaveBeenCalled();
    });
    test("calls removeFavoriteBook when checkbox is unchecked", () => {
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input");
        input.checked = false;
        input.dispatchEvent(new Event("change"));
        expect(removeFavoriteBook).toHaveBeenCalledWith("123");
        expect(addFavoriteBook).not.toHaveBeenCalled();
        expect(updateFavoriteBooksSize).toHaveBeenCalled();
    });
    test("sets checked attribute if book is already favorite", () => {
        isFavoriteBook.mockReturnValue(true);
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input");
        expect(input.checked).toBe(true);
    });
    test("does not set checked attribute if book is not favorite", () => {
        isFavoriteBook.mockReturnValue(false);
        element.setAttribute("data-isbn", "123");
        element.reRender();
        const input = element.querySelector("input");
        expect(input.checked).toBe(false);
    });
});
//# sourceMappingURL=%E1%84%87%E1%85%A2%E1%86%A8%E1%84%87%E1%85%A2%E1%86%A8.js.map