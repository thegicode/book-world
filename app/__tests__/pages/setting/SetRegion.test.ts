/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter, CustomFetch } from "../../../scripts/utils/index";
import {
    getState,
    addRegion,
    removeRegion,
} from "../../../scripts/modules/model";
import { readHtmlFile, getElementFromHtml } from "../../helpers";
import SetRegion from "../../../scripts/pages/setting/SetRegion";

jest.mock("../../../scripts/utils/index");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
    addRegion: jest.fn(),
    removeRegion: jest.fn(),
}));

describe("SetRegion", () => {
    const CUSTOM_ELEMENT_NAME = "set-region";
    const MARKUP_FILE_PATH = "../../markup/setting.html";

    const FETCH_REGION_DATA_EVENT = "fetch-region-data";
    const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
    const REGION_TEMPLATE_NAME = "#tp-region";

    let setRegion: SetRegion;
    let instance: any;

    const mockCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;
    const mockGetState = getState as jest.MockedFunction<typeof getState>;

    const mockRegionData = {
        region: {
            서울: "11",
            제주: "39",
        },
        detailRegion: {
            서울: {
                종로구: "11010",
                중구: "11020",
            },
            제주: {
                제주시: "39010",
                서귀포시: "39020",
            },
        },
    };

    const mockRegions = Object.keys(mockRegionData.region);
    const mockRegionDataLength = mockRegions.length;

    const mockFavoriteRegions = {
        서울: {
            강동구: "11250",
        },
        제주: {},
    };

    const html = readHtmlFile(MARKUP_FILE_PATH);

    const element = getElementFromHtml(
        html,
        CUSTOM_ELEMENT_NAME
    ) as HTMLElement;

    const regionTemplate = getElementFromHtml(
        html,
        REGION_TEMPLATE_NAME
    ) as HTMLElement;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, SetRegion);
        }

        mockCustomFetch.fetch.mockResolvedValue(mockRegionData);

        mockGetState.mockReturnValue({
            favoriteBooks: [],
            libraries: {},
            regions: mockFavoriteRegions,
        });

        setRegion = new SetRegion();
        setRegion.innerHTML = element.innerHTML;

        instance = setRegion as any;

        document.body.appendChild(instance);
        document.body.appendChild(regionTemplate);
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.innerHTML = "";

        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    describe("initializeRegionDataAndRender", () => {
        test("should properly initialize region data and render the component", async () => {
            const mockRenderRegion = jest.spyOn(instance, "renderRegion");
            const mockAddCheckboxChangeListeners = jest.spyOn(
                instance,
                "addCheckboxChangeListeners"
            );
            const mockCustmEventEmitter = jest.spyOn(
                CustomEventEmitter,
                "dispatch"
            );

            await instance.initializeRegionDataAndRender();

            expect(instance.regionData).toEqual(mockRegionData);
            expect(mockRenderRegion).toHaveBeenCalled();
            expect(mockAddCheckboxChangeListeners).toHaveBeenCalled();
            expect(mockCustmEventEmitter).toHaveBeenCalledWith(
                FETCH_REGION_DATA_EVENT,
                { regionData: instance.regionData }
            );
        });

        test("should handle fetch error", async () => {
            const testError = new Error("Test error");
            mockCustomFetch.fetch.mockRejectedValueOnce(testError);

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(
                instance.initializeRegionDataAndRender()
            ).rejects.toThrow("Fail to get region data.");

            expect(consoleErrorSpy).toHaveBeenCalledWith(testError);

            consoleErrorSpy.mockRestore();
        });
    });

    describe("renderRegion", () => {
        let createRegionElementsFragmentSpy: jest.SpyInstance;

        beforeEach(() => {
            createRegionElementsFragmentSpy = jest.spyOn(
                instance,
                "createRegionElementsFragment"
            );
        });

        afterEach(() => {
            createRegionElementsFragmentSpy.mockRestore();
        });

        test("sholuld call createRegionElementsFragment", () => {
            const createRegionElementsFragmentSpy = jest.spyOn(
                instance,
                "createRegionElementsFragment"
            );

            instance.renderRegion();

            expect(createRegionElementsFragmentSpy).toHaveBeenCalled();
        });

        test("should not append the region elements fragment if template does not exist", () => {
            document.querySelector(REGION_TEMPLATE_NAME)?.remove();

            instance.renderRegion();

            expect(createRegionElementsFragmentSpy).not.toHaveBeenCalled();
        });
    });

    describe("createRegionElementsFragment", () => {
        let template: Element | null;

        beforeEach(() => {
            const templateElement = document.querySelector(
                REGION_TEMPLATE_NAME
            ) as HTMLTemplateElement;
            template = templateElement?.content.firstElementChild;
        });

        test("shoud create and return a DocumentFragment", async () => {
            const createRegionElementSpy = jest.spyOn(
                instance,
                "createRegionElement"
            );

            const result = instance.createRegionElementsFragment(template);

            expect(result).toBeInstanceOf(DocumentFragment);
            expect(createRegionElementSpy).toHaveBeenCalledTimes(
                mockRegionDataLength
            );
            expect(result.children).toHaveLength(mockRegionDataLength);

            createRegionElementSpy.mockRestore();
        });

        test("should throw an error when regionData is null", () => {
            instance.regionData = null;

            expect(() =>
                instance.createRegionElementsFragment(template)
            ).toThrowError("regionData is null.");
        });
    });

    describe("createCheckboxChangeListener", () => {
        let checkbox: HTMLInputElement;
        let eventHandler: () => void;
        let mockDispatch: jest.SpyInstance;
        let mockKey: string;

        beforeEach(() => {
            checkbox = instance.querySelector("[name=region]");

            eventHandler = instance.createCheckboxChangeListener(checkbox);

            mockDispatch = jest.spyOn(CustomEventEmitter, "dispatch");

            mockKey = mockRegions[0];
        });

        test("should call addRegion and dispatch event when checkbox is checked", () => {
            checkbox.checked = true;

            eventHandler();

            expect(addRegion).toHaveBeenCalledWith(mockKey);
            expect(mockDispatch).toHaveBeenCalledWith(
                SET_FAVORITE_REGIONS_EVENT,
                {}
            );
        });

        test("should call removeRegion and dispatch event when checkbox is not checked", () => {
            checkbox.checked = false;

            eventHandler();

            expect(removeRegion).toHaveBeenCalledWith(mockKey);
            expect(mockDispatch).toHaveBeenCalledWith(
                SET_FAVORITE_REGIONS_EVENT,
                {}
            );
        });

        test("should handle situation when key is an empty string", () => {
            checkbox.nextElementSibling?.remove();

            expect(eventHandler).toThrowError(
                "Invalid checkbox element: No sibling element or missing text content."
            );
        });
    });
});
