import { NavGnb, ErrorFallback } from "@/components/index";
import PageLibrarySearch from "./PageLibrarySearch";
import LibrarySearchFavoriteList from "./LibrarySearchFavoriteList";
import LibrarySearchItem from "./LibrarySearchItem";
import LibrarySearchForm from "./LibrarySearchForm";

function defineIfNeeded(name: string, constructor: CustomElementConstructor) {
    if (!customElements.get(name)) customElements.define(name, constructor);
}

defineIfNeeded("nav-gnb", NavGnb);
defineIfNeeded("error-fallback", ErrorFallback);
defineIfNeeded("library-search-form", LibrarySearchForm);
defineIfNeeded("page-library-search", PageLibrarySearch);
defineIfNeeded("library-search-favorite-list", LibrarySearchFavoriteList);
defineIfNeeded("library-search-item", LibrarySearchItem);
