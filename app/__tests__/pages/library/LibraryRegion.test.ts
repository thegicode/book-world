/* eslint-disable @typescript-eslint/no-explicit-any */
// import necessary dependencies and modules
import { CustomEventEmitter } from "../../../scripts/utils/index";
import { getState } from "../../../scripts/modules/model";

import LibraryRegion from "../../../scripts/pages/library/LibraryRegion";

import { readHtmlFile, getElementFromHtml } from "../../helpers";

// mock necessary modules
jest.mock("../../../scripts/utils/index", () => ({
    CustomEventEmitter: {
        dispatch: jest.fn(),
    },
}));

jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

describe("LibraryRegion", () => {
    const CUSTOM_ELEMENT_NAME = "library-region";
    let libraryRegionInstance: LibraryRegion;

    const libraryHtml = readHtmlFile("../../markup/library.html");

    const element = getElementFromHtml(
        libraryHtml,
        "library-region"
    ) as LibraryRegion;

    const template = getElementFromHtml(
        libraryHtml,
        "#tp-region"
    ) as HTMLTemplateElement;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, LibraryRegion);
        }

        (getState as jest.Mock).mockReturnValue({
            regions: {
                Seoul: {
                    Gangnam: "12345",
                },
            },
        });

        libraryRegionInstance = new LibraryRegion();
        libraryRegionInstance.innerHTML = element.innerHTML;

        document.body.appendChild(template);
        document.body.appendChild(libraryRegionInstance);
    });

    afterEach(() => {
        libraryRegionInstance.innerHTML = "";
        document.body.innerHTML = "";
        jest.clearAllMocks();
    });

    test("should initialize selectElement on connectedCallback", () => {
        // libraryRegionInstance.connectedCallback();

        // Here, we directly access the selectElement property of the instance.
        // This is not a good practice generally, but we can do this for testing purposes.
        const selectElement = (libraryRegionInstance as any).selectElement;

        expect(selectElement).toBeDefined();
    });

    test("should dispatch 'set-detail-region' event on onChangeDetail", () => {
        // libraryRegionInstance.connectedCallback();

        // Here, we directly access the selectElement property of the instance.
        const selectElement = (libraryRegionInstance as any).selectElement;

        selectElement.dispatchEvent(new Event("change"));

        expect(CustomEventEmitter.dispatch).toHaveBeenCalledWith(
            "set-detail-region",
            {
                detailRegionCode: selectElement.value,
            }
        );
    });

    test("should render region correctly", () => {
        // libraryRegionInstance.connectedCallback();

        // Since the function renderRegion is private, it is called internally by connectedCallback.
        // So we verify its effect after calling connectedCallback.
        const regionContainer = libraryRegionInstance.querySelector(".region");
        expect(regionContainer).toBeDefined();

        // Check the presence of the expected region radio button.
        const seoulRadioButton =
            libraryRegionInstance.querySelector<HTMLInputElement>(
                "[value='Seoul']"
            );
        expect(seoulRadioButton).toBeDefined();
    });

    test("should handle region change correctly", () => {
        // libraryRegionInstance.connectedCallback();

        const seoulRadioButton =
            libraryRegionInstance.querySelector<HTMLInputElement>(
                "[value='Seoul']"
            );

        if (seoulRadioButton === null) return;

        seoulRadioButton.checked = true;
        seoulRadioButton.dispatchEvent(new Event("change"));

        // Since renderDetailRegion is called internally in changeRegion,
        // we can verify its effect to check if changeRegion worked correctly.
        const detailRegionOption = (
            libraryRegionInstance as any
        ).selectElement.querySelector("option");
        expect(detailRegionOption.value).toBe("12345");
    });

    test("should return early if favoriteRegions is empty", () => {
        // Setup: mock getState to return an empty object for favoriteRegions
        (getState as jest.Mock).mockReturnValue({ regions: {} });

        libraryRegionInstance.innerHTML = element.innerHTML;

        // Call connectedCallback to trigger renderRegion()
        libraryRegionInstance.connectedCallback();

        // Verify: .region container should be empty because renderRegion() should have returned early
        const regionContainer = libraryRegionInstance.querySelector(".region");
        expect(regionContainer?.children.length).toBe(0);
    });
});
