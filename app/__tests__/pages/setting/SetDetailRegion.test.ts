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
    getState: () => ({
        regions: {
            서울: "11",
            부산: "21",
        },
    }),
    addRegion: jest.fn(),
    addDetailRegion: jest.fn(),
    removeDetailRegion: jest.fn(),
}));

describe("SetDetailRegion", () => {
    const CUSTOM_ELEMENT_NAME = "set-detail-region";
    const MARKUP_FILE_PATH = "../../markup/setting.html";

    let setDetailRegion: SetDetailRegion;
    let instance: any;

    const FETCH_REGION_DATA_EVENT = "fetch-region-data";
    const SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
    const SET_DETAIL_REGIONS_EVENT = "set-detail-regions";

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
        test("should render regions properly", () => {
            const instance = setDetailRegion as any;
            const mockCreateRegions = jest
                .spyOn(instance, "createRegions")
                .mockReturnValue(document.createElement("div"));
            const mockInitializeFirstRegion = jest.spyOn(
                instance,
                "initializeFirstRegion"
            );

            instance.renderRegion(mockCreateRegions);

            expect(mockCreateRegions).toHaveBeenCalledWith(["서울", "부산"]);
            expect(mockInitializeFirstRegion).toHaveBeenCalled();

            mockCreateRegions.mockRestore();
            mockInitializeFirstRegion.mockRestore();
        });

        // test("favoriteRegions.length < 1", () => {
        //     const instance = setDetailRegion as any;

        // const mockGetState = getState as jest.MockedFunction<
        //     typeof getState
        // >;
        // mockGetState.mockReturnValue({
        //     favoriteBooks: [],
        //     libraries: {},
        //     regions: {},
        // });

        //     const mockCreateRegions = jest
        //         .spyOn(instance, "createRegions")
        //         .mockReturnValue(document.createElement("div"));
        //     const mockInitializeFirstRegion = jest.spyOn(
        //         instance,
        //         "initializeFirstRegion"
        //     );

        //     instance.renderRegion(mockCreateRegions);

        //     expect(mockCreateRegions).not.toHaveBeenCalled();
        //     expect(mockInitializeFirstRegion).not.toHaveBeenCalled();

        //     mockCreateRegions.mockRestore();
        //     mockInitializeFirstRegion.mockRestore();
        // });
    });

    test("should create regions properly when called createRegions", () => {
        const instance = setDetailRegion as any;
        const mockRegions = ["서울", "부산"];

        const fragment = instance.createRegions(mockRegions);
        const childNodes = fragment.childNodes;
        expect(childNodes).toHaveLength(mockRegions.length);
        childNodes.forEach((node: HTMLElement, index: number) => {
            const spanElement = node.querySelector("span");
            expect(spanElement?.textContent).toEqual(mockRegions[index]);
        });
    });

    test("should initialize the first region properly", () => {
        const instance = setDetailRegion as any;

        const mockRenderDetailRegions = jest.spyOn(
            instance,
            "renderDetailRegions"
        );
        const mockChageRegion = jest.spyOn(instance, "changeRegion");

        instance.renderRegion();

        expect(instance.querySelector("input").checked).toBeTruthy();
        expect(mockRenderDetailRegions).toHaveBeenCalledWith("서울");
        expect(mockChageRegion).toHaveBeenCalled();

        mockRenderDetailRegions.mockRestore();
        mockChageRegion.mockRestore();
    });

    test("renderDetailRegions should render detail regions properly", () => {
        const instance = setDetailRegion as any;
        const mockCreateDEtailReginElement = jest.spyOn(
            instance,
            "createDetailRegionElements"
        );
        const mockOnChangeDetail = jest.spyOn(instance, "onChangeDetail");
        instance.regionData = mockRegionData;

        instance.renderDetailRegions("서울");

        expect(mockCreateDEtailReginElement).toHaveBeenCalled();
        expect(mockOnChangeDetail).toHaveBeenCalled();

        mockCreateDEtailReginElement.mockRestore();
        mockCreateDEtailReginElement.mockRestore();
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

    test("changeRegion: should add change event listener to radio buttons and call renderDetailRegions on change'", () => {
        const instance = setDetailRegion as any;

        instance.setRegionData(
            new CustomEvent(FETCH_REGION_DATA_EVENT, {
                detail: { regionData: mockRegionData },
            })
        );

        const mockRenderDetailRegions = jest.spyOn(
            instance,
            "renderDetailRegions"
        );

        instance.changeRegion();

        const regionRadios = instance.querySelectorAll(
            "[name=favorite-region]"
        );
        const radio1 = regionRadios[0];
        radio1.dispatchEvent(new Event("change"));
        expect(mockRenderDetailRegions).toHaveBeenCalledWith("서울");

        mockRenderDetailRegions.mockRestore();
    });

    describe("onChangeDetail", () => {
        let instance: any;

        beforeEach(() => {
            instance = setDetailRegion as any;
        });
        test("should add change event listener to checkboxes and handle detail region change", () => {
            const customEventSpy = jest.spyOn(CustomEventEmitter, "dispatch");
            const region = "서울";
            instance.region = region;

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
            expect(removeDetailRegion).toHaveBeenCalledWith(region, label);

            checkbox1.checked = true;
            checkbox1.dispatchEvent(new Event("change"));
            expect(addDetailRegion).toHaveBeenCalledWith(region, label, value);
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
    });
});
