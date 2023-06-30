/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomEventEmitter } from "../../../scripts/utils/index";
import {
    getState,
    addRegion,
    addDetailRegion,
    removeDetailRegion,
} from "../../../scripts/modules/model.js";
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

    let setDetailRegion: SetDetailRegion;
    let instance: any;

    const element = getElementFromHtml(
        readHtmlFile(MARKUP_FILE_PATH),
        CUSTOM_ELEMENT_NAME
    ) as HTMLElement;
    beforeEach(() => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, SetDetailRegion);
        }

        setDetailRegion = new SetDetailRegion();
        setDetailRegion.innerHTML = element.innerHTML;

        instance = setDetailRegion as any;

        document.body.appendChild(instance);
    });

    afterEach(() => {
        instance.innerHTML = "";
        document.body.removeChild(instance);
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    test("test", () => {
        console.log("test");
    });
});
