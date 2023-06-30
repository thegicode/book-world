import "../../../scripts/pages/favorite";

describe("pages favorite index", () => {
    test("custom elements should be defined", () => {
        expect(customElements.get("nav-gnb")).toBeDefined();
        expect(customElements.get("app-favorite")).toBeDefined();
        expect(customElements.get("favorite-item")).toBeDefined();
        expect(customElements.get("book-description")).toBeDefined();
        expect(customElements.get("library-book-exist")).toBeDefined();
        expect(customElements.get("checkbox-favorite-book")).toBeDefined();
        expect(customElements.get("book-image")).toBeDefined();
    });
});
