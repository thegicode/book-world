/* eslint-disable @typescript-eslint/no-explicit-any */
import { getState } from "../../../scripts/modules/model";
import { readHtmlFile, getElementFromHtml } from "../../helpers";
import FavoriteRegions from "../../../scripts/pages/setting/FavoriteRegions";

jest.mock("../../../scripts/utils/index");
jest.mock("../../../scripts/modules/model", () => ({
    getState: jest.fn(),
}));

describe("FavoriteRegions", () => {
    const CUSTOM_ELEMENT_NAME = "favorite-regions";
    const MARKUP_FILE_PATH = "../../markup/setting.html";

    const mockGetState = getState as jest.MockedFunction<typeof getState>;
    let favoriteRegions: FavoriteRegions;
    let instance: any;

    const mockRegions = {
        서울: {
            강동구: "11111",
        },
        경기: {
            하남시: "22222",
        },
    };
    const element = getElementFromHtml(
        readHtmlFile(MARKUP_FILE_PATH),
        CUSTOM_ELEMENT_NAME
    ) as HTMLElement;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, FavoriteRegions);
        }

        favoriteRegions = new FavoriteRegions();
        favoriteRegions.innerHTML = element.innerHTML;
        instance = favoriteRegions as any;
        mockGetState.mockReturnValue({
            favoriteBooks: [],
            libraries: {},
            regions: mockRegions,
        });

        document.body.appendChild(instance);
    });

    afterEach(() => {
        favoriteRegions.innerHTML = "";
        instance.innerHTML = "";
        document.body.removeChild(instance);
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("render", () => {
        test("render correctly", () => {
            const els = Array.from(instance.querySelectorAll("h3"));
            const regionNames = els.map((el) =>
                el instanceof HTMLElement ? el.textContent : null
            );
            const expectedRegionNames = Object.keys(mockRegions);
            expect(regionNames).toEqual(expectedRegionNames);
        });

        test("render does not throw an exception when container is null", () => {
            instance.container = null;
            expect(() => {
                instance.render();
            }).not.toThrow();
        });
    });

    describe("renderDetail", () => {
        test("renderDetail does not throw an exception when container is null", () => {
            instance.container = null;
            expect(() => {
                instance.renderDetail();
            }).not.toThrow();
        });
    });
});
