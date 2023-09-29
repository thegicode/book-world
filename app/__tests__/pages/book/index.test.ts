import "../../../scripts/pages/book/index";

describe("Index", () => {
    test("custom elements should be defined", () => {
        expect(customElements.get("nav-gnb")).toBeDefined();
        expect(customElements.get("app-book")).toBeDefined();
        expect(customElements.get("library-search-by-book")).toBeDefined();
        expect(customElements.get("category-selector")).toBeDefined();
        expect(customElements.get("book-image")).toBeDefined();
    });
});
