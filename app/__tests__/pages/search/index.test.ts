import "../../../scripts/pages/search";

describe("pages search index", () => {
    test("custom elements should be defined", () => {
        expect(customElements.get("nav-gnb")).toBeDefined();
        expect(customElements.get("book-list")).toBeDefined();
        expect(customElements.get("app-search")).toBeDefined();
        expect(customElements.get("input-search")).toBeDefined();
        expect(customElements.get("book-item")).toBeDefined();
        expect(customElements.get("book-description")).toBeDefined();
        expect(customElements.get("library-book-exist")).toBeDefined();
        expect(customElements.get("category-selector")).toBeDefined();
        expect(customElements.get("book-image")).toBeDefined();
    });
});
