import { NavGnb, CategorySelector, BookImage } from "@/components/index";

import Popular from "./Popular";
import PopularSearch from "./PopularSearch";
import PopularList from "./PopularList";
import PopularItem from "./PopularItem";

customElements.define("book-image", BookImage);
customElements.define("nav-gnb", NavGnb);
customElements.define("popular-list", PopularList);
customElements.define("popular-item", PopularItem);
customElements.define("app-popular", Popular);
customElements.define("popular-search", PopularSearch);
customElements.define("category-selector", CategorySelector);
