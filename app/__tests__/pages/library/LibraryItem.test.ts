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
    getDatasetObject() {
        return this.dataset.object;
    }
    testOnChange(event: MouseEvent) {
        this.onChange(event);
    }
    getCheckbox() {
        return this.checkbox;
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
        jest.clearAllMocks();
    });

    test("should be empty when dataset.object = undefined", () => {
        expect(instance.getDatasetObject()).toBeUndefined();
        expect(instance.querySelector(".libName")?.textContent).toBe("");
    });

    describe("when LibraryItem has dataset.object", () => {
        const mockData = {
            libCode: "1234",
            libName: "Test Library",
        };
        let clickEventWithCheckedTarget: MouseEvent;

        beforeEach(() => {
            instance.dataset.object = JSON.stringify(mockData);
            (hasLibrary as jest.Mock).mockReturnValue(true);
            instance.connectedCallback();
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

        test("should not throw an error when input element is missing", () => {
            instance.querySelector("input")?.remove();
            expect(() => instance.connectedCallback()).not.toThrow();
            expect(() => instance.disconnectedCallback()).not.toThrow();
        });

        test("should remove event listener when disconnected", () => {
            const input = instance.getCheckbox() as HTMLInputElement;
            const removeEventListenerSpy = jest.spyOn(
                input,
                "removeEventListener"
            );
            instance.disconnectedCallback();
            expect(removeEventListenerSpy).toHaveBeenCalledWith(
                "click",
                expect.any(Function)
            );

            removeEventListenerSpy.mockRestore();
        });

        test("should add a library when checkbox is clicked", () => {
            clickEventWithCheckedTarget = {
                target: { checked: true },
            } as unknown as MouseEvent;

            instance.testOnChange(clickEventWithCheckedTarget);

            expect(addLibrary).toHaveBeenCalled();
        });

        test("should not call addLibrary or removeLibrary if event target is null or undefined", () => {
            clickEventWithCheckedTarget = new MouseEvent("click");

            Object.defineProperty(clickEventWithCheckedTarget, "target", {
                get() {
                    return null;
                },
            });

            instance.testOnChange(clickEventWithCheckedTarget);
            expect(addLibrary).not.toHaveBeenCalled();
            expect(removeLibrary).not.toHaveBeenCalled();
        });

        test("should remove a library when checkbox is unchecked", () => {
            clickEventWithCheckedTarget = {
                target: { checked: false },
            } as unknown as MouseEvent;

            instance.testOnChange(clickEventWithCheckedTarget);
            expect(removeLibrary).toHaveBeenCalled();
        });
    });
});
