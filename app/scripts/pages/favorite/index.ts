import {
    BookDescription,
    CategorySelector,
    LibraryBookExist,
    NavGnb,
    BookImage,
    // LoadingComponent,
} from "../../components/index";

import Favorite from "./Favorite";
import FavoriteNav from "./FavoriteNav";
import FavoriteItem from "./FavoriteItem";
import OverlayCategory from "./OverlayCategory";

customElements.define("nav-gnb", NavGnb);
customElements.define("app-favorite", Favorite);
customElements.define("favorite-nav", FavoriteNav);
customElements.define("favorite-item", FavoriteItem);
customElements.define("book-description", BookDescription);
customElements.define("library-book-exist", LibraryBookExist);
customElements.define("category-selector", CategorySelector);
customElements.define("book-image", BookImage);
customElements.define("overlay-category", OverlayCategory);
// customElements.define("loading-component", LoadingComponent);
