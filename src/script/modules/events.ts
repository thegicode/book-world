import { getState } from "./model.js";

export const updateFavoriteBooksSize = (length?: number) => {
  const navElement = document.querySelector("nav-gnb") as HTMLElement;
  const size = length || getState().favoriteBooks.length;
  (navElement.querySelector(".size") as HTMLElement).textContent = String(size);
};
