import BookDescription from "../../scripts/components/BookDescription";

class TestableBookDescription extends BookDescription {
    setRootElement(value: HTMLElement | null) {
        this.el = value;
    }
    triggerOnButtonClick() {
        this.onButtonClick();
    }
}

describe("BookDescription", () => {
    let bookDescription: TestableBookDescription;
    const sampleDescription = "This is a sample book description.";

    beforeEach(() => {
        if (!customElements.get("book-description")) {
            customElements.define("book-description", TestableBookDescription);
        }
        bookDescription = new TestableBookDescription();
        document.body.appendChild(bookDescription);
        bookDescription.data = sampleDescription;
    });

    afterEach(() => {
        if (document.body.contains(bookDescription)) {
            document.body.removeChild(bookDescription);
        }
    });

    test("renders book description and 'more' button", () => {
        const descriptionElement =
            bookDescription.querySelector(".description");
        const moreButton = bookDescription.querySelector(
            ".more-description-button"
        );

        expect(descriptionElement).not.toBeNull();
        expect(descriptionElement?.textContent).toBe(sampleDescription);
        expect(moreButton).not.toBeNull();
        expect(moreButton?.textContent).toBe("설명 더보기");
    });

    test("toggles book description ellipsis on button click", () => {
        const descriptionElement = bookDescription.querySelector(
            ".description"
        ) as HTMLElement;
        const moreButton = bookDescription.querySelector(
            ".more-description-button"
        ) as HTMLButtonElement;
        if (!descriptionElement || !moreButton) {
            throw new Error("Description  element or more button not found.");
        }

        moreButton.click();
        expect(descriptionElement.dataset.ellipsis).toBe("false");
        expect(moreButton.textContent).toBe("설명 접기");
        moreButton.click();
        expect(descriptionElement.dataset.ellipsis).toBe("true");
        expect(moreButton.textContent).toBe("설명 더보기");
    });

    test("does not thorw an error when this.el is null", () => {
        const moreButton = bookDescription.querySelector(
            ".more-description-button"
        ) as HTMLButtonElement;

        if (!moreButton) {
            throw new Error("More button not found");
        }

        bookDescription.setRootElement(null);

        moreButton.click();
        expect(() => bookDescription.triggerOnButtonClick()).not.toThrow();
    });
});
