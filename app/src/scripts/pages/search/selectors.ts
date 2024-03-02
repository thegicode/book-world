import BookList from "./BookList";

export const bookList = document.querySelector<BookList>("book-list");
export const searchForm = document.querySelector(
    "input-search form"
) as HTMLFormElement;
export const searchInputElement = document.querySelector(
    "input-search input[type='search']"
) as HTMLInputElement;
