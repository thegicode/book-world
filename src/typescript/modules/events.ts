import { getState } from "./model";

export const updateFavoriteBooksSize = (
    size: number = getState().favoriteBooks.length
): void => {
    const navElement = document.querySelector("nav-gnb") as HTMLElement;
    (navElement.querySelector(".size") as HTMLElement).textContent =
        String(size);
};
