import {
    BookDescription,
    LibraryBookExist,
    NavGnb,
    CategorySelector,
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

    test("CategorySelector is defined", () => {
        expect(CategorySelector).toBeDefined();
    });

    test("BookImage is defined", () => {
        expect(BookImage).toBeDefined();
    });
});
