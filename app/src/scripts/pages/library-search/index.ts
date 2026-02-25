import { NavGnb, ErrorFallback } from "@/components/index";
import PageLibrarySearch from "./PageLibrarySearch";
import LibrarySearchStored from "./LibrarySearchStored";
import LibrarySearchItem from "./LibrarySearchItem";

// Register custom elements
if (!customElements.get("nav-gnb")) {
    customElements.define("nav-gnb", NavGnb);
}
if (!customElements.get("error-fallback")) {
    customElements.define("error-fallback", ErrorFallback);
}
if (!customElements.get("page-library-search")) {
    customElements.define("page-library-search", PageLibrarySearch);
}
// We reuse components from library-search
if (!customElements.get("library-search-stored")) {
    customElements.define("library-search-stored", LibrarySearchStored);
}
// library-search-item is registered here as well to ensure it works
if (!customElements.get("library-search-item")) {
    customElements.define("library-search-item", LibrarySearchItem);
}
