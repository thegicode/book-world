import {
    NavGnb,
    CheckboxFavoriteBook,
    BookImage,
} from "../../../scripts/components/index";

import Book from "../../../scripts/pages/book/Book";
import LibrarySearchByBook from "../../../scripts/pages/book/LibrarySearchByBook";

describe("pages book index", () => {
    test("NavGnb is defined", () => {
        expect(NavGnb).toBeDefined();
    });
    test("CheckboxFavoriteBook is defined", () => {
        expect(CheckboxFavoriteBook).toBeDefined();
    });
    test("BookImage is defined", () => {
        expect(BookImage).toBeDefined();
    });
    test("Book is defined", () => {
        expect(Book).toBeDefined();
    });
    test("LibrarySearchByBook is defined", () => {
        expect(LibrarySearchByBook).toBeDefined();
    });
});
