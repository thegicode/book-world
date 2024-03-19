import SearchResult from "./SearchResult";

export const searchResult =
    document.querySelector<SearchResult>("search-result");
export const searchForm = document.querySelector(
    "input-search form"
) as HTMLFormElement;
export const searchInputElement = document.querySelector(
    "input-search input[type='search']"
) as HTMLInputElement;
