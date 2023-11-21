import BookList from "./BookList";

export const bookList = document.querySelector<BookList>("book-list");
export const searchInputElement = document.querySelector(
    "input-search input[type='search']"
) as HTMLInputElement;
