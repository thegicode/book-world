import BookWhereFavorite from "./BookWhereFavorite";
import BookWhereFavoriteNav from "./BookWhereFavoriteNav";
import BookWhereFavoriteItem from "./BookWhereFavoriteItem";

if (!customElements.get("book-where-favorite-nav")) {
    customElements.define("book-where-favorite-nav", BookWhereFavoriteNav);
}

if (!customElements.get("book-where-favorite-item")) {
    customElements.define("book-where-favorite-item", BookWhereFavoriteItem);
}

if (!customElements.get("app-book-where-favorite")) {
    customElements.define("app-book-where-favorite", BookWhereFavorite);
}
