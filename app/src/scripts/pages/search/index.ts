import {
    NavGnb,
    BookDescription,
    CategorySelector,
    LibraryBookExist,
    BookImage,
} from "../../components/index";

import AppSearch from "./AppSearch";
import InputSearch from "./InputSearch";
import SearchResult from "./SearchResult";
import BookItem from "./BookItem";
import MonthlyKeywords from "./MonthlyKeywords";
// import TestElement from './TestElement'

customElements.define("book-image", BookImage);
customElements.define("nav-gnb", NavGnb);
customElements.define("search-result", SearchResult);
customElements.define("app-search", AppSearch);
customElements.define("input-search", InputSearch);
customElements.define("book-item", BookItem);
customElements.define("book-description", BookDescription);
customElements.define("library-book-exist", LibraryBookExist);
customElements.define("category-selector", CategorySelector);
customElements.define("monthly-keywords", MonthlyKeywords);

// customElements.define('test-element', TestElement)
