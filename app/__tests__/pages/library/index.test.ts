import "../../../scripts/pages/library";

describe("pages favorite index", () => {
    test("custom elements should be defined", () => {
        expect(customElements.get("nav-gnb")).toBeDefined();
        expect(customElements.get("app-library")).toBeDefined();
        expect(customElements.get("library-region")).toBeDefined();
        expect(customElements.get("library-item")).toBeDefined();
    });
});
