/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { CustomFetch } from "../../../scripts/utils/index";
import { setState } from "../../../scripts/modules/model";
import { readHtmlFile, getElementFromHtml } from "../../helpers";
import SetStorage from "../../../scripts/pages/setting/SetStorage";

jest.mock("../../../scripts/utils/index");
jest.mock("../../../scripts/modules/model", () => ({
    setState: jest.fn(),
}));

describe("SetStorage", () => {
    const CUSTOM_ELEMENT_NAME = "set-storage";
    const MARKUP_FILE_PATH = "../../markup/setting.html";

    const LOCAL_STORAGE_NAME = "BookWorld";

    const mockStorageData = {
        favoriteBooks: ["1111111111111", "2222222222222"],
        libraries: {
            "33333": "서울특별시교육청고덕평생학습관",
            "444444": "하남시 미사도서관",
        },
        regions: {
            서울: {
                강동구: "55555",
            },
            경기: {
                하남시: "66666",
            },
        },
    };

    let setStorage: SetStorage;
    let instance: any;
    let originalLocation: Location;
    let consoleLogSpy: jest.SpyInstance;

    const mockCustomFetch = CustomFetch as jest.Mocked<typeof CustomFetch>;

    const html = readHtmlFile(MARKUP_FILE_PATH);
    const element = getElementFromHtml(
        html,
        CUSTOM_ELEMENT_NAME
    ) as HTMLElement;

    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, SetStorage);
        }

        originalLocation = window.location;
        Object.defineProperty(window, "location", {
            value: { ...originalLocation, reload: jest.fn() },
            writable: true,
        });

        mockCustomFetch.fetch.mockResolvedValue(mockStorageData);

        consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

        setStorage = new SetStorage();
        setStorage.innerHTML = element.innerHTML;

        instance = setStorage as any;

        document.body.appendChild(instance);
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.innerHTML = "";

        jest.clearAllMocks();
        jest.restoreAllMocks();
        jest.resetAllMocks();

        window.location = originalLocation;
        consoleLogSpy.mockRestore();
    });

    describe("addEventListeners", () => {
        let storageButtonSpy: jest.SpyInstance;
        let resetButtonSpy: jest.SpyInstance;

        beforeEach(() => {
            storageButtonSpy = jest.spyOn(
                instance.storageButton,
                "addEventListener"
            );
            resetButtonSpy = jest.spyOn(
                instance.resetButton,
                "addEventListener"
            );
        });

        afterEach(() => {
            storageButtonSpy.mockRestore();
            resetButtonSpy.mockRestore();
        });

        test("should add event listeners to the buttons", () => {
            instance.setSelectors();

            instance.addEventListeners();

            expect(storageButtonSpy).toHaveBeenCalledWith(
                "click",
                instance.setLocalStorageToBase
            );
            expect(resetButtonSpy).toHaveBeenCalledWith(
                "click",
                instance.resetStorage
            );
        });
        test("should add event listeners to the buttons", () => {
            instance.storageButton = null;
            instance.resetButton = null;

            instance.addEventListeners();

            expect(storageButtonSpy).not.toHaveBeenCalled();
            expect(resetButtonSpy).not.toHaveBeenCalled();
        });
    });

    describe("setLocalStorageToBase", () => {
        test("should fetch data, call setState, and update and reload when successful", async () => {
            const updateAndReloadSpy = jest.spyOn(instance, "updateAndReload");

            await instance.setLocalStorageToBase();

            expect(setState).toHaveBeenCalledWith(mockStorageData);
            expect(updateAndReloadSpy).toHaveBeenCalled();

            updateAndReloadSpy.mockRestore();
        });

        test("should log error and throw when fetch fails", async () => {
            const testError = new Error("Test error");
            mockCustomFetch.fetch.mockRejectedValueOnce(testError);

            const consoleErrorSpy = jest
                .spyOn(console, "error")
                .mockImplementation(() => {});

            await expect(instance.setLocalStorageToBase()).rejects.toThrow(
                "Fail to get storage sample data."
            );

            expect(consoleErrorSpy).toHaveBeenCalledWith(testError);

            consoleErrorSpy.mockRestore();
        });
    });

    describe("resetStorage", () => {
        test("should remove data from localStorage and call updateAndReload", () => {
            Object.defineProperty(window, "localStorage", {
                value: {
                    removeItem: jest.fn(),
                },
                writable: true,
            });

            const updateAndReloadSpy = jest.spyOn(instance, "updateAndReload");

            instance.resetStorage();

            expect(localStorage.removeItem).toHaveBeenCalledWith(
                LOCAL_STORAGE_NAME
            );
            expect(updateAndReloadSpy).toHaveBeenCalled();

            updateAndReloadSpy.mockRestore();
        });
    });
});
