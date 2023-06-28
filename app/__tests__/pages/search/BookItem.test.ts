/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { state } from "../../../scripts/modules/model";
import {
    // BookDescription,
    // BookImage,
    LibraryBookExist,
} from "../../../scripts/components/index.js";
import { readHtmlFile, getElementFromHtml } from "../../helpers";
import BookItem from "../../../scripts/pages/search/BookItem";

jest.mock("../../../scripts/modules/model", () => ({
    state: jest.mock,
}));

describe("BookItem", () => {
    const CUSTOM_ELEMENT_NAME = "book-item";
    let bookItemInstance: BookItem;

    const searchHtml = readHtmlFile("../../markup/search.html");

    const template = getElementFromHtml(
        searchHtml,
        "#tp-book-item"
    ) as HTMLTemplateElement;
    const element = template.content.firstElementChild;

    const mockData = {
        author: "author test",
        description: "description test",
        image: "image_test.jpg",
        isbn: "9791155515952",
        link: "link test",
        pubdate: "20150406",
        publisher: "publisher test",
        title: "title test",
        price: "10000",
    };

    // const createBookItemInstance = () => {
    //     const bookItemInstance = new BookItem();
    //     bookItemInstance.bookData = mockData;
    //     if (element !== null) {
    //         bookItemInstance.innerHTML = element.innerHTML;
    //     }
    //     document.body.appendChild(bookItemInstance);
    //     return bookItemInstance;
    // };

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, BookItem);
        }

        bookItemInstance = new BookItem();
        bookItemInstance.bookData = mockData;
        if (element !== null) {
            bookItemInstance.innerHTML = element.innerHTML;
        }
        document.body.appendChild(bookItemInstance);
    });

    afterEach(() => {
        bookItemInstance.innerHTML = "";
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("Connected and disconnected life-cycle methods", () => {
        test("should initialize libraryButton, anchorElement on connectedCallback", () => {
            // bookItemInstance.connectedCallback();
            const libraryButton = (bookItemInstance as any).libraryButton;
            const anchorElement = (bookItemInstance as any).anchorElement;

            expect(libraryButton).toBeDefined();
            expect(libraryButton).toBeInstanceOf(HTMLButtonElement);
            expect(anchorElement).toBeDefined();
            expect(anchorElement).toBeInstanceOf(HTMLElement);
        });

        test("should removeEventListener when disconnected", () => {
            const instance = bookItemInstance as any;

            // instance.connectedCallback();

            const libraryButton = instance.libraryButton;
            const anchorElement = instance.anchorElement;

            instance.boundClickLibraryHandler = jest.fn();
            instance.boundClickLinkHandler = jest.fn();

            const removeEventListenerSpy1 = jest.spyOn(
                libraryButton,
                "removeEventListener"
            );
            const removeEventListenerSpy2 = jest.spyOn(
                anchorElement,
                "removeEventListener"
            );

            instance.disconnectedCallback();

            expect(removeEventListenerSpy1).toHaveBeenCalledWith(
                "click",
                instance.boundClickLibraryHandler
            );
            expect(removeEventListenerSpy2).toHaveBeenCalledWith(
                "click",
                instance.boundClickLinkHandler
            );
        });
    });

    test("should call console.error if render with bookData is null", () => {
        const instance = bookItemInstance as any;

        const consoleErrorSpy = jest.spyOn(console, "error");
        consoleErrorSpy.mockImplementation(() => {});
        instance.bookData = null;

        instance.connectedCallback();

        expect(consoleErrorSpy).toHaveBeenCalled();
    });

    test("should call libraryBookExist.onLibraryBookExist if trigger onClickLibraryButton", () => {
        const instance = bookItemInstance as any;
        instance.dataset.isbn = "111111";

        const libraryBookExist =
            bookItemInstance.querySelector<LibraryBookExist>(
                "library-book-exist"
            );
        if (!libraryBookExist) {
            throw new Error("LibraryBookExist element not found");
        }

        const onLibraryBookExistSpy = jest.fn();
        libraryBookExist.onLibraryBookExist = onLibraryBookExistSpy;

        instance.onClickLibraryButton();

        expect(onLibraryBookExistSpy).toHaveBeenCalledTimes(1);
    });

    test("should set location href if trigger onClickLink", () => {
        const event = {
            preventDefault: jest.fn(),
        } as unknown as MouseEvent;
        const orginalWindowLocation = window.location;

        delete (window as any).location;
        window.location = { ...orginalWindowLocation, href: "" } as any;

        const instance = bookItemInstance as any;
        instance.dataset.isbn = "111111";

        instance.onClickLink(event);

        expect(event.preventDefault).toHaveBeenCalled();
        expect(window.location.href).toBe(`book?isbn=${instance.dataset.isbn}`);

        window.location = orginalWindowLocation;
    });

    test("should not trigger error if isbn is empty", () => {
        const instance = bookItemInstance as any;
        instance.dataset.isbn = "";

        const libraryBookExist =
            bookItemInstance.querySelector<LibraryBookExist>(
                "library-book-exist"
            );
        const onLibraryBookExistSpy = jest.fn();

        if (libraryBookExist) {
            libraryBookExist.onLibraryBookExist = onLibraryBookExistSpy;
        }

        instance.onClickLibraryButton();

        expect(() => {
            instance.onClickLibraryButton();
        }).not.toThrowError();
    });
});
