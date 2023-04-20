import {
    BookDescription,
    CheckboxFavoriteBook,
    LibraryBookExist,
    NavGnb,
    BookImage,
} from "../../../scripts/components/index";

import Favorite from "../../../scripts/pages/favorite/Favorite";
import FavoriteItem from "../../../scripts/pages/favorite/FavoriteItem";

describe("pages favorite index", () => {
    test("NavGnb is defined", () => {
        expect(NavGnb).toBeDefined();
    });
    test("Favorite is defined", () => {
        expect(Favorite).toBeDefined();
    });
    test("FavoriteItem is defined", () => {
        expect(FavoriteItem).toBeDefined();
    });
    test("BookDescription is defined", () => {
        expect(BookDescription).toBeDefined();
    });
    test("LibraryBookExist is defined", () => {
        expect(LibraryBookExist).toBeDefined();
    });
    test("CheckboxFavoriteBook is defined", () => {
        expect(CheckboxFavoriteBook).toBeDefined();
    });
    test("BookImage is defined", () => {
        expect(BookImage).toBeDefined();
    });
});
