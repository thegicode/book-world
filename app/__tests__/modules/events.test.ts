import { updateFavoriteBooksSize } from "../../scripts/modules/events";
import { getState } from "../../scripts/modules/model";

describe("updateFavoriteBooksSize", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <nav-gnb>
                <span class="size"></span>
            </nav-gnb>
        `;
    });

    test("should update the favorite books size with the given size", () => {
        const size = 5;
        updateFavoriteBooksSize(size);
        const sizeElement = document.querySelector(".size");
        expect(sizeElement?.textContent).toBe(String(size));
    });

    test("should update the favorite books size with the length of the favorite books array if no size is provided", () => {
        const size = getState().favoriteBooks.length;
        updateFavoriteBooksSize();
        const sizeElement = document.querySelector(".size");
        expect(sizeElement?.textContent).toBe(String(size));
    });
});
