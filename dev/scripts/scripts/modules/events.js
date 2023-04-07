import { getState } from "./model";
export const updateFavoriteBooksSize = (size = getState().favoriteBooks.length) => {
    const navElement = document.querySelector("nav-gnb");
    navElement.querySelector(".size").textContent =
        String(size);
};
//# sourceMappingURL=events.js.map