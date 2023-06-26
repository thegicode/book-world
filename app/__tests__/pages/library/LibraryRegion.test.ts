/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter } from "../../../scripts/utils/index";
import { getState } from "../../../scripts/modules/model";

import { readHtmlFile, getElementFromHtml } from "../../helpers";

import LibraryRegion from "../../../scripts/pages/library/LibraryRegion";

jest.mock("../../../scripts/utils/index", () => ({
    CustomEventEmitter: {
        dispatch: jest.fn(),
    },
}));

jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

class LibraryRegionForTest extends LibraryRegion {
    getSelectElement() {
        return this.selectElement;
    }
    testChangeRegion() {
        this.changeRegion();
    }
    testRenderDetailRegion(name: string) {
        this.renderDetailRegion(name);
    }
}
describe("LibraryRegion", () => {
    const CUSTOM_ELEMENT_NAME = "library-region";
    let instance: LibraryRegionForTest;

    const libraryHtml = readHtmlFile("../../markup/library.html");

    const element = getElementFromHtml(
        libraryHtml,
        "library-region"
    ) as LibraryRegion;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, LibraryRegionForTest);
        }

        (getState as jest.Mock).mockReturnValue({
            regions: {
                Seoul: {
                    Gangnam: "12345",
                },
            },
        });

        instance = new LibraryRegionForTest();
        instance.innerHTML = element.innerHTML;
        document.body.innerHTML = libraryHtml;
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    test("should initialize selectElement on connectedCallback", () => {
        instance.connectedCallback();
        expect(instance.getSelectElement()).not.toBeUndefined();
    });

    test("should dispatch 'set-detail-region' event on onChangeDetail", () => {
        instance.connectedCallback();

        const selectElement = instance.getSelectElement();

        const event = new Event("change");
        selectElement.dispatchEvent(event);

        expect(CustomEventEmitter.dispatch).toHaveBeenCalledWith(
            "set-detail-region",
            {
                detailRegionCode: selectElement.value,
            }
        );
    });

    test("should render detail region when a region radio button is selected", () => {
        instance.connectedCallback();

        const radio = document.querySelector<HTMLInputElement>("[name=region]");

        if (!radio) {
            fail("Radio button is not found");
            return;
        }

        const changeRegionMock = jest.spyOn(instance as any, "changeRegion");
        const renderDetailRegionMock = jest.spyOn(
            instance as any,
            "renderDetailRegion"
        );

        radio.checked = true;

        instance.testChangeRegion();
        expect(changeRegionMock).toHaveBeenCalled();

        radio.dispatchEvent(new Event("change"));
        expect(renderDetailRegionMock).toHaveBeenCalled();

        changeRegionMock.mockClear();
        renderDetailRegionMock.mockClear();
    });
});
