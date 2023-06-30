import {
    BookDescription,
    LibraryBookExist,
    NavGnb,
    CheckboxFavoriteBook,
    BookImage,
} from "../../scripts/components/index";

describe("components index", () => {
    test("BookDescription is defined", () => {
        expect(BookDescription).toBeDefined();
    });

    test("LibraryBookExist is defined", () => {
        expect(LibraryBookExist).toBeDefined();
    });

    test("NavGnb is defined", () => {
        expect(NavGnb).toBeDefined();
    });

    test("CheckboxFavoriteBook is defined", () => {
        expect(CheckboxFavoriteBook).toBeDefined();
    });

    test("BookImage is defined", () => {
        expect(BookImage).toBeDefined();
    });
});
