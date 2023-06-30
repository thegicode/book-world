import NavGnb from "../../scripts/components/NavGnb";

class NavGnbTest extends NavGnb {
    public renderTest(): void {
        return this.render();
    }

    public setFavoriteBooksSize(size: number): void {
        this.favoriteBooksSize = size;
    }

    public setSelectedMenuTest() {
        this.setSelectedMenu();
    }
}

describe("NavGnb", () => {
    let navGnb: NavGnbTest;

    beforeEach(() => {
        if (!customElements.get("nav-gnb")) {
            customElements.define("nav-gnb", NavGnbTest);
        }
        navGnb = new NavGnbTest();
        document.body.appendChild(navGnb);
    });

    afterEach(() => {
        if (document.body.contains(navGnb)) {
            document.body.removeChild(navGnb);
        }
    });

    test("render sets the correct innerHTML", () => {
        navGnb.setFavoriteBooksSize(3);
        navGnb.renderTest();
        const navElement = navGnb.querySelector("nav");
        const sizeElement = navGnb.querySelector(".size");
        expect(navElement?.className).toBe("gnb");
        expect(sizeElement?.textContent).toBe("3");
    });

    test("setSelectedMenu sets the correct ariaSelected attribute", () => {
        window.history.pushState({}, "", "/favorite");

        navGnb.renderTest();
        navGnb.setSelectedMenuTest();
        const getItems = navGnb.querySelectorAll("a");
        expect(getItems[1].ariaSelected).toBe("true");
    });
});
