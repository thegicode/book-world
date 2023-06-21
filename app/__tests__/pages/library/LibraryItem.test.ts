// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../type.d.ts" />
import { readHtmlFile, getElementFromHtml } from "../../helpers";

import LibraryItem from "../../../scripts/pages/library/LibraryItem";
import {
    addLibrary,
    removeLibrary,
    hasLibrary,
} from "../../../scripts/modules/model";

jest.mock("../../../scripts/modules/model", () => ({
    hasLibrary: jest.fn(),
    addLibrary: jest.fn(),
    removeLibrary: jest.fn(),
}));

class LibraryItemForTest extends LibraryItem {
    testRender() {
        this.render;
    }
    getDatasetObejct() {
        return this.dataset.object;
    }
    getCheckbox() {
        return this.checkbox;
    }
    testOnChange(event: MouseEvent) {
        this.onChange(event);
    }
}

describe("LibraryItem", () => {
    const CUSTOM_ELEMENT_NAME = "library-item";
    let instance: LibraryItemForTest;

    const template = getElementFromHtml(
        readHtmlFile("../../markup/library.html"),
        "#tp-item"
    ) as HTMLTemplateElement;
    const element = template.content.firstElementChild;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, LibraryItemForTest);
        }

        instance = new LibraryItemForTest();

        if (element !== null) {
            instance.innerHTML = element.innerHTML;
        }
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.removeChild(instance);
        jest.clearAllMocks();
    });

    test("should .libName is empty when dataset.object = undefined", () => {
        document.body.appendChild(instance);

        expect(instance.getDatasetObejct()).toBeUndefined();
        expect(instance.querySelector(".libName")?.textContent).toBe("");
    });

    describe("when LibraryItem has dataset.object", () => {
        const mockData = {
            libCode: "1234",
            libName: "Test Library",
        };

        beforeEach(() => {
            instance.dataset.object = JSON.stringify(mockData);
            (hasLibrary as jest.Mock).mockReturnValue(true);
            instance.connectedCallback();
            document.body.appendChild(instance);
        });

        afterEach(() => {
            delete instance.dataset.object;
        });

        test("should render correctly", () => {
            expect(instance.querySelector(".libCode")?.textContent).toBe(
                mockData.libCode
            );
            expect(instance.querySelector(".libName")?.textContent).toBe(
                mockData.libName
            );
            expect(instance.querySelector("input")?.checked).toBe(true);
        });

        // test("should add event listener on connectedCallback'", () => {
        //     const addEventListenerInput = jest.spyOn(
        //         HTMLInputElement.prototype,
        //         "addEventListener"
        //     );
        //     instance.connectedCallback();

        //     expect(addEventListenerInput).toHaveBeenCalled();

        //     addEventListenerInput.mockRestore();
        // });

        test("should add a library when checkbox is clicked", () => {
            const event = {
                target: { checked: true },
            } as unknown as MouseEvent;

            instance.testOnChange(event);

            expect(addLibrary).toHaveBeenCalled();
        });

        test("should remove a library when checkbox is unchecked", () => {
            const event = {
                target: { checked: false },
            } as unknown as MouseEvent;
            instance.testOnChange(event);
            expect(removeLibrary).toHaveBeenCalled();
        });
    });
});
