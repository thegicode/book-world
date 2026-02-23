import { NavGnb } from "@/components/index";
import LibrarySearchKeyword from "./LibrarySearchKeyword";
import LibrarySearchStored from "./LibrarySearchStored";
import LibrarySearchItem from "./LibrarySearchItem";
import LibraryList from "./LibraryList";

// Register custom elements
if (!customElements.get("nav-gnb")) {
    customElements.define("nav-gnb", NavGnb);
}
if (!customElements.get("app-library-search")) {
    customElements.define("app-library-search", LibrarySearchKeyword);
}
// We reuse components from library-search
if (!customElements.get("library-search-stored")) {
    customElements.define("library-search-stored", LibrarySearchStored);
}
// library-search-item is registered here as well to ensure it works
if (!customElements.get("library-search-item")) {
    customElements.define("library-search-item", LibrarySearchItem);
}
if (!customElements.get("library-list")) {
    customElements.define("library-list", LibraryList);
}
