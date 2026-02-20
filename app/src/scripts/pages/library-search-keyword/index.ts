import { NavGnb } from "../../components/index";
import LibrarySearchKeyword from "./LibrarySearchKeyword";
import LibrarySearchStored from "../library-search/LibrarySearchStored";
import LibrarySearchItem from "../library-search/LibrarySearchItem";

// Register custom elements
if (!customElements.get("nav-gnb")) {
    customElements.define("nav-gnb", NavGnb);
}
if (!customElements.get("app-library-search-keyword")) {
    customElements.define("app-library-search-keyword", LibrarySearchKeyword);
}
// We reuse components from library-search
if (!customElements.get("library-search-stored")) {
    customElements.define("library-search-stored", LibrarySearchStored);
}
// library-search-item is registered here as well to ensure it works
if (!customElements.get("library-search-item")) {
    customElements.define("library-search-item", LibrarySearchItem);
}
