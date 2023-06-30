import { readHtmlFile } from "../../helpers";
import { getState } from "../../../scripts/modules/model";

jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

import Favorite from "../../../scripts/pages/favorite/Favorite";

describe("Favorite", () => {
    const CUSTOM_ELEMENT_NAME = "app-favorite";
    const mockGetState = getState as jest.MockedFunction<typeof getState>;
    const favoriteHtml = readHtmlFile("../../markup/favorite.html");

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, Favorite);
        }
    });

    afterEach(() => {
        document.body.innerHTML = "";
    });

    describe("when favoriteBooks length is 0", () => {
        beforeEach(() => {
            mockGetState.mockReturnValue({
                favoriteBooks: [],
                libraries: {},
                regions: {},
            });

            document.body.innerHTML = favoriteHtml;
        });

        test("displays a message to register favorite books", () => {
            const element = document.querySelector(CUSTOM_ELEMENT_NAME);

            expect(
                element?.querySelector(".favorite-message")?.textContent
            ).toBe("관심책을 등록해주세요.");
        });
    });

    describe("when favoriteBooks length is 3", () => {
        beforeEach(() => {
            mockGetState.mockReturnValue({
                favoriteBooks: [
                    "9791157062157",
                    "9788991799677",
                    "9788989824565",
                ],
                libraries: {},
                regions: {},
            });

            document.body.innerHTML = favoriteHtml;
        });

        test("displays 3 favorite-item elements", () => {
            const element = document.querySelector(CUSTOM_ELEMENT_NAME);

            expect(element?.querySelectorAll("favorite-item").length).toBe(3);
        });
    });
});
