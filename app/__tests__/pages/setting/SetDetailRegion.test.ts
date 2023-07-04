/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter } from "../../../scripts/utils/index";
import {
    getState,
    addRegion,
    addDetailRegion,
    removeDetailRegion,
} from "../../../scripts/modules/model";
import { readHtmlFile, getElementFromHtml } from "../../helpers";
import SetDetailRegion from "../../../scripts/pages/setting/SetDetailRegion";

jest.mock("../../../scripts/utils/index");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
    addRegion: jest.fn(),
    addDetailRegion: jest.fn(),
    removeDetailRegion: jest.fn(),
}));

describe("SetDetailRegion", () => {
    const CUSTOM_ELEMENT_NAME = "set-detail-region";
    const MARKUP_FILE_PATH = "../../markup/setting.html";

    const FETCH_REGION_DATA_EVENT = "fetch-region-data";
    const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
    const SET_DETAIL_REGIONS_EVENT = "set-detail-regions";

    let setDetailRegion: SetDetailRegion;
    let instance: any;

    const mockGetState = getState as jest.MockedFunction<typeof getState>;

    const mockRegions = {
        서울: {
            강동구: "11111",
        },
        경기: {
            하남시: "22222",
        },
    };

    const mockRegionData = {
        region: {
            서울: "11",
        },
        detailRegion: {
            서울: {
                종로구: "11010",
            },
        },
    };

    const html = readHtmlFile(MARKUP_FILE_PATH);

    const element = getElementFromHtml(
        html,
        CUSTOM_ELEMENT_NAME
    ) as HTMLElement;

    const favoriteRegionTemplate = getElementFromHtml(
        html,
        "#tp-favorite-region"
    ) as HTMLTemplateElement;

    const detailRegionTemplate = getElementFromHtml(
        html,
        "#tp-detail-region"
    ) as HTMLTemplateElement;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, SetDetailRegion);
        }

        mockGetState.mockReturnValue({
            favoriteBooks: [],
            libraries: {},
            regions: mockRegions,
        });

        setDetailRegion = new SetDetailRegion();
        setDetailRegion.innerHTML = element.innerHTML;

        instance = setDetailRegion as any;

        document.body.appendChild(instance);
        document.body.appendChild(favoriteRegionTemplate);
        document.body.appendChild(detailRegionTemplate);
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.innerHTML = "";
        // document.body.removeChild(instance);
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("connectedCallback, disconnectedCallback", () => {
        test("CustomEventEmitter.add should be called during connectedCallback execution", () => {
            const instance = setDetailRegion as any;
            const customEventAddSpy = jest.spyOn(CustomEventEmitter, "add");
            expect(customEventAddSpy).toHaveBeenNthCalledWith(
                1,
                FETCH_REGION_DATA_EVENT,
                instance.setRegionData
            );
            expect(customEventAddSpy).toHaveBeenNthCalledWith(
                2,
                SET_FAVORITE_REGIONS_EVENT,
                instance.renderRegion
            );

            customEventAddSpy.mockRestore();
        });

        test("CustomEventEmitter.remove should be called during disconnectedCallback execution", () => {
            const instance = setDetailRegion as any;

            instance.disconnectedCallback();

            const customEventRemoveSpy = jest.spyOn(
                CustomEventEmitter,
                "remove"
            );
            expect(customEventRemoveSpy).toHaveBeenNthCalledWith(
                1,
                FETCH_REGION_DATA_EVENT,
                instance.setRegionData
            );
            expect(customEventRemoveSpy).toHaveBeenNthCalledWith(
                2,
                SET_FAVORITE_REGIONS_EVENT,
                instance.renderRegion
            );

            customEventRemoveSpy.mockRestore();
        });
    });

    test("setRegionData should set regionData and call renderRegion", () => {
        const instance = setDetailRegion as any;
        const mockRederRegion = jest.spyOn(instance, "renderRegion");

        instance.setRegionData(
            new CustomEvent(FETCH_REGION_DATA_EVENT, {
                detail: { regionData: mockRegionData },
            })
        );

        expect(instance.regionData).toEqual(mockRegionData);
        expect(mockRederRegion).toHaveBeenCalledTimes(1);

        mockRederRegion.mockRestore();
    });

    describe("renderRegion", () => {
        let instance: any;
        let mockInitializeFirstRegion: jest.SpyInstance;
        let mockCreateRegions: jest.SpyInstance;

        beforeEach(() => {
            instance = setDetailRegion as any;
            mockInitializeFirstRegion = jest.spyOn(
                instance,
                "initializeFirstRegion"
            );
            mockCreateRegions = jest
                .spyOn(instance, "createRegions")
                .mockReturnValue(document.createElement("div"));
        });

        afterEach(() => {
            mockInitializeFirstRegion.mockRestore();
            mockCreateRegions.mockRestore();
        });
        test("should render regions properly", () => {
            instance.renderRegion(mockCreateRegions);

            expect(mockCreateRegions).toHaveBeenCalledWith(
                Object.keys(mockRegions)
            );
            expect(mockInitializeFirstRegion).toHaveBeenCalled();
        });

        test("favoriteRegions.length < 1", () => {
            mockGetState.mockReturnValue({
                favoriteBooks: [],
                libraries: {},
                regions: {},
            });

            instance.renderRegion();

            expect(mockCreateRegions).not.toHaveBeenCalled();
            expect(mockInitializeFirstRegion).not.toHaveBeenCalled();

            mockGetState.mockRestore();
        });

        test("!container", () => {
            instance.querySelector(".regions").remove();
            instance.renderRegion();

            expect(mockCreateRegions).not.toHaveBeenCalled();
            expect(mockInitializeFirstRegion).not.toHaveBeenCalled();
        });

        test("!regionElements", () => {
            mockCreateRegions = jest
                .spyOn(instance, "createRegions")
                .mockReturnValue(null);

            instance.renderRegion();

            expect(mockInitializeFirstRegion).not.toHaveBeenCalled();
        });
    });

    describe("createRegions", () => {
        let instance: any;
        const mockRegions = ["서울", "부산"];

        beforeEach(() => {
            instance = setDetailRegion as any;
        });

        afterEach(() => {
            //
        });

        test("should create regions properly when called createRegions", () => {
            const fragment = instance.createRegions(mockRegions);

            const childNodes = fragment.childNodes;
            expect(childNodes).toHaveLength(mockRegions.length);
            childNodes.forEach((node: HTMLElement, index: number) => {
                const spanElement = node.querySelector("span");
                expect(spanElement?.textContent).toEqual(mockRegions[index]);
            });
        });

        test("!tempate", () => {
            document.querySelector("#tp-favorite-region")?.remove();

            const fragment = instance.createRegions(mockRegions);

            expect(fragment).toBeUndefined();
        });
    });

    describe("initializeFirstRegion", () => {
        let instance: any;
        let mockRenderDetailRegions: jest.SpyInstance;
        let mockChageRegion: jest.SpyInstance;

        beforeEach(() => {
            instance = setDetailRegion as any;

            mockRenderDetailRegions = jest.spyOn(
                instance,
                "renderDetailRegions"
            );
            mockChageRegion = jest.spyOn(instance, "changeRegion");
        });

        afterEach(() => {
            mockRenderDetailRegions.mockRestore();
            mockChageRegion.mockRestore();
        });

        test("should initialize the first region properly", () => {
            instance.renderRegion();

            expect(instance.querySelector("input").checked).toBeTruthy();
            expect(mockRenderDetailRegions).toHaveBeenCalledWith("서울");
            expect(mockChageRegion).toHaveBeenCalled();
        });

        test("labelEl.textContent = ''", () => {
            const container = document.createElement("div");
            const inputElement = document.createElement("input");
            container.appendChild(inputElement);

            instance.initializeFirstRegion(container);

            expect(mockRenderDetailRegions).toHaveBeenCalledWith("");
            expect(mockChageRegion).toHaveBeenCalled();
        });
    });

    describe("renderDetailRegions", () => {
        let instance: any;
        let mockCreateDEtailReginElement: jest.SpyInstance;
        let mockOnChangeDetail: jest.SpyInstance;
        const regionName = "서울";

        beforeEach(() => {
            instance = setDetailRegion as any;
            instance.regionData = mockRegionData;

            mockCreateDEtailReginElement = jest.spyOn(
                instance,
                "createDetailRegionElements"
            );
            mockOnChangeDetail = jest.spyOn(instance, "onChangeDetail");
        });

        afterEach(() => {
            mockCreateDEtailReginElement.mockRestore();
            mockCreateDEtailReginElement.mockRestore();
        });

        test("renderDetailRegions should render detail regions properly", () => {
            instance.renderDetailRegions(regionName);

            expect(mockCreateDEtailReginElement).toHaveBeenCalled();
            expect(mockOnChangeDetail).toHaveBeenCalled();
        });

        test("!detailRegionsElement", () => {
            instance.querySelector(".detailRegions").remove();

            instance.renderDetailRegions(regionName);

            expect(mockCreateDEtailReginElement).not.toHaveBeenCalled();
            expect(mockOnChangeDetail).not.toHaveBeenCalled();
        });

        test("regionObj is empty", () => {
            mockGetState.mockReturnValue({
                favoriteBooks: [],
                libraries: {},
                regions: {},
            });

            instance.renderDetailRegions(regionName);

            const detailRegionData =
                instance.regionData.detailRegion[regionName];

            const template = (
                document.querySelector(
                    "#tp-detail-region"
                ) as HTMLTemplateElement
            )?.content.firstElementChild;

            expect(mockCreateDEtailReginElement).toHaveBeenCalledWith(
                detailRegionData,
                template,
                []
            );
        });

        test("!template", () => {
            document.querySelector("#tp-detail-region")?.remove();

            instance.renderDetailRegions(regionName);

            expect(mockCreateDEtailReginElement).not.toHaveBeenCalled();
            expect(mockOnChangeDetail).not.toHaveBeenCalled();
        });

        test("!detailRegionData", () => {
            instance.renderDetailRegions("정의되지 않은 지역");

            expect(mockCreateDEtailReginElement).not.toHaveBeenCalled();
            expect(mockOnChangeDetail).not.toHaveBeenCalled();
        });
    });

    test("createDetailRegionElements should create detail region elements correctly", () => {
        const instance = setDetailRegion as any;
        instance.regionData = mockRegionData;

        const detailRegionData = instance.regionData.detailRegion["서울"];

        const template = (
            document.querySelector("#tp-detail-region") as HTMLTemplateElement
        )?.content.firstElementChild;
        const regionCodes = ["11010"];
        const fragment = instance.createDetailRegionElements(
            detailRegionData,
            template,
            regionCodes
        );

        fragment.childNodes.forEach((node: DocumentFragment) => {
            expect(node.querySelector("span")?.textContent).toBe("종로구");
            expect(
                node.querySelector<HTMLInputElement>("input")?.checked
            ).toBeTruthy();
        });
    });

    describe("changeRegion", () => {
        let instance: any;
        let mockRenderDetailRegions: jest.SpyInstance;

        beforeEach(() => {
            instance = setDetailRegion as any;

            instance.setRegionData(
                new CustomEvent(FETCH_REGION_DATA_EVENT, {
                    detail: { regionData: mockRegionData },
                })
            );

            mockRenderDetailRegions = jest.spyOn(
                instance,
                "renderDetailRegions"
            );
        });

        afterEach(() => {
            mockRenderDetailRegions.mockRestore();
        });

        test("should add change event listener to radio buttons and call renderDetailRegions on change'", () => {
            instance.changeRegion();

            const regionRadios = instance.querySelectorAll(
                "[name=favorite-region]"
            );
            const radio1 = regionRadios[0];
            radio1.dispatchEvent(new Event("change"));
            const label1 = Object.keys(mockRegions)[0];
            expect(mockRenderDetailRegions).toHaveBeenCalledWith(label1);
        });

        test("should call renderDetailRegions with empty string when textContent is null", () => {
            const radio = instance.querySelector("[name=favorite-region]");
            const labelElement = radio.nextElementSibling as HTMLElement;
            labelElement.remove();

            instance.changeRegion();

            radio.dispatchEvent(new Event("change"));

            expect(mockRenderDetailRegions).toHaveBeenCalledWith("");
        });
    });

    describe("onChangeDetail", () => {
        let instance: any;
        const regionName = "서울";

        beforeEach(() => {
            instance = setDetailRegion as any;
        });

        test("should add change event listener to checkboxes and handle detail region change", () => {
            const customEventSpy = jest.spyOn(CustomEventEmitter, "dispatch");
            instance.region = regionName;

            instance.setRegionData(
                new CustomEvent(FETCH_REGION_DATA_EVENT, {
                    detail: { regionData: mockRegionData },
                })
            );

            instance.onChangeDetail();

            const checkbox1 = instance.querySelectorAll(
                "[name=detailRegion]"
            )[0];
            const label =
                (checkbox1.nextElementSibling as HTMLElement).textContent || "";
            const value = checkbox1.value;

            checkbox1.dispatchEvent(new Event("change"));
            expect(removeDetailRegion).toHaveBeenCalledWith(regionName, label);

            checkbox1.checked = true;
            checkbox1.dispatchEvent(new Event("change"));
            expect(addDetailRegion).toHaveBeenCalledWith(
                regionName,
                label,
                value
            );
            expect(customEventSpy).toHaveBeenCalledWith(
                SET_DETAIL_REGIONS_EVENT,
                {}
            );

            customEventSpy.mockRestore();
        });

        test("shoud call addRegion", () => {
            const region = "";
            instance.region = region;

            instance.onChangeDetail();

            expect(addRegion).toHaveBeenCalledWith(region);
        });

        test("label is null", () => {
            const customEventSpy = jest.spyOn(CustomEventEmitter, "dispatch");
            instance.region = regionName;

            instance.setRegionData(
                new CustomEvent(FETCH_REGION_DATA_EVENT, {
                    detail: { regionData: mockRegionData },
                })
            );

            instance.onChangeDetail();

            const checkbox1 = instance.querySelectorAll(
                "[name=detailRegion]"
            )[0];
            const labelElement = checkbox1.nextElementSibling as HTMLElement;
            labelElement.remove();

            checkbox1.dispatchEvent(new Event("change"));

            expect(removeDetailRegion).toHaveBeenCalledWith(regionName, "");

            customEventSpy.mockRestore();
        });
    });
});
