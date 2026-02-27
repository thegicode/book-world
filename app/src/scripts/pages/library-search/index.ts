import { NavGnb, ErrorFallback } from "@/components/index";
import PageLibrarySearch from "./PageLibrarySearch";
import LibrarySearchFavoriteList from "./LibrarySearchFavoriteList";
import LibrarySearchItem from "./LibrarySearchItem";
import LibrarySearchForm from "./LibrarySearchForm";

// Register custom elements
if (!customElements.get("nav-gnb")) {
    customElements.define("nav-gnb", NavGnb);
}
if (!customElements.get("error-fallback")) {
    customElements.define("error-fallback", ErrorFallback);
}
if (!customElements.get("library-search-form")) {
    customElements.define("library-search-form", LibrarySearchForm);
}
if (!customElements.get("page-library-search")) {
    customElements.define("page-library-search", PageLibrarySearch);
}
// We reuse components from library-search
if (!customElements.get("library-search-favorite-list")) {
    customElements.define("library-search-favorite-list", LibrarySearchFavoriteList);
}
// library-search-item is registered here as well to ensure it works
if (!customElements.get("library-search-item")) {
    customElements.define("library-search-item", LibrarySearchItem);
}
