/* eslint-disable @typescript-eslint/no-explicit-any */
import AppSetting from "../../../scripts/pages/setting/AppSetting";

describe("AppSetting", () => {
    const CUSTOM_ELEMENT_NAME = "app-setting";

    let appSetting: AppSetting;
    let instance: any;

    test("test", () => {
        if (!customElements.get(CUSTOM_ELEMENT_NAME)) {
            customElements.define(CUSTOM_ELEMENT_NAME, AppSetting);
        }

        appSetting = new AppSetting();
        // inputSearch.innerHTML = element.innerHTML;

        instance = appSetting as any;
        document.body.appendChild(instance);

        document.body.removeChild(instance);
    });
});
