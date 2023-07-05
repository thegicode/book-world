import "../../../scripts/pages/setting";

describe("pages setting index", () => {
    test("custom elements should be defined", () => {
        expect(customElements.get("nav-gnb")).toBeDefined();
        expect(customElements.get("app-setting")).toBeDefined();
        expect(customElements.get("set-region")).toBeDefined();
        expect(customElements.get("set-detail-region")).toBeDefined();
        expect(customElements.get("favorite-regions")).toBeDefined();
        expect(customElements.get("set-storage")).toBeDefined();
    });
});
