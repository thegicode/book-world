import BookImage from "../../scripts/components/BookImage";

class TestableBookImage extends BookImage {
    setConnected(): void {
        this.connectedCallback();
    }
}

describe("BokkImage", () => {
    let bookImage: TestableBookImage;
    const sampleBookImageData = {
        bookImageURL: "http://sample.com/image_url.jpg",
        bookname: "Sample Book Title",
    };

    beforeEach(() => {
        if (!customElements.get("book-image")) {
            customElements.define("book-image", TestableBookImage);
        }
        bookImage = new TestableBookImage();
        document.body.appendChild(bookImage);
    });

    afterEach(() => {
        if (document.body.contains(bookImage)) {
            document.body.removeChild(bookImage);
        }
    });

    test("renders book image", () => {
        bookImage.data = sampleBookImageData;
        const imgElement = bookImage.querySelector("img");

        expect(imgElement).not.toBeNull();
        expect(imgElement?.getAttribute("src")).toBe(
            sampleBookImageData.bookImageURL
        );
        expect(imgElement?.getAttribute("alt")).toBe(
            sampleBookImageData.bookname
        );
    });

    test("connectedCallback renders book image", () => {
        bookImage.dataset.object = JSON.stringify(sampleBookImageData);
        bookImage.connectedCallback();
        const imgElement = bookImage.querySelector("img");

        expect(imgElement).not.toBeNull();
        expect(imgElement?.getAttribute("src")).toBe(
            sampleBookImageData.bookImageURL
        );
        expect(imgElement?.getAttribute("alt")).toBe(
            sampleBookImageData.bookname
        );
    });

    test("handles error when image fails to load", () => {
        bookImage.data = sampleBookImageData;
        const imgElement = bookImage.querySelector("img");

        if (!imgElement) {
            throw new Error("Image element not found");
        }

        const event = new Event("error");
        imgElement.dispatchEvent(event);

        expect(bookImage.dataset.fail).toBe("true");
        expect(bookImage.querySelector("img")).toBeNull();
    });
});
