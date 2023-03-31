(() => {
  // dev/src/utils/CustomEventEmitter.js
  var CustomEventEmitter = class {
    constructor() {
      this._bus = document.createElement("div");
    }
    add(event, callback) {
      this._bus.addEventListener(event, callback);
    }
    remove(event, callback) {
      this._bus.removeEventListener(event, callback);
    }
    dispatch(event, detail = {}) {
      this._bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
  };
  var CustomEventEmitter_default = new CustomEventEmitter();

  // dev/src/utils/CustomFetch.js
  var __awaiter = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var CustomFetch = class {
    constructor(baseOptions = {}) {
      this.defaultOptions = Object.assign({ method: "GET", headers: {
        "Content-Type": "application/json"
        // 'Authorization': `Bearer ${getToken()}`
      } }, baseOptions);
    }
    fetch(url, options) {
      return __awaiter(this, void 0, void 0, function* () {
        const finalOptions = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), options), { timeout: 5e3 });
        try {
          const response = yield fetch(url, finalOptions);
          if (!response.ok) {
            throw new Error(`Http error! status: ${response.status}, message: ${response.statusText}`);
          }
          const data = yield response.json();
          return data;
        } catch (error) {
          console.error(`Error fetching data: ${error}`);
          throw new Error(`Error fetching data: ${error}`);
        }
      });
    }
  };
  var CustomFetch_default = new CustomFetch();

  // dev/src/modules/model.js
  var cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var initialState = {
    favoriteBooks: [],
    libraries: {},
    regions: {}
  };
  var storageKey = "BookWorld";
  var setState = (newState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(newState));
    } catch (error) {
      console.error(error);
    }
  };
  var getState = () => {
    try {
      const storedState = localStorage.getItem(storageKey);
      if (storedState == null) {
        setState(initialState);
        return initialState;
      }
      return cloneDeep(JSON.parse(storedState));
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get state from localStrage.");
    }
  };
  var state = getState();
  var addRegion = (regionName) => {
    state.regions[regionName] = {};
    setState(state);
  };
  var removeRegion = (regionName) => {
    delete state.regions[regionName];
    setState(state);
  };
  var addDetailRegion = (regionName, detailName, detailCode) => {
    state.regions[regionName][detailName] = detailCode;
    setState(state);
  };
  var removeDetailRegion = (regionName, detailName) => {
    delete state.regions[regionName][detailName];
    setState(state);
  };

  // dev/src/components/NavGnb.js
  var NavGnb = class extends HTMLElement {
    constructor() {
      super();
      this.favoriteBooksSize = this.getFavoriteBooksSize();
    }
    connectedCallback() {
      this.render();
      this.setSelectedMenu();
    }
    disconnectedCallback() {
    }
    getFavoriteBooksSize() {
      return getState().favoriteBooks.length;
    }
    render() {
      this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href="./favorite">\uB098\uC758 \uCC45 (<span class="size">${this.favoriteBooksSize}</span>)</a>
                <a class="gnb-item" href="./library">\uB3C4\uC11C\uAD00 \uC870\uD68C</a>
                <a class="gnb-item" href="./setting">\uC124\uC815</a>
            </nav>`;
    }
    setSelectedMenu() {
      const PATHS = ["/search", "/favorite", "/library", "/setting"];
      const idx = PATHS.indexOf(document.location.pathname);
      if (idx >= 0)
        this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
  };

  // dev/src/pages/setting/AppSetting.js
  var AppSetting = class extends HTMLElement {
    constructor() {
      super();
    }
  };

  // dev/src/pages/setting/SetRegion.js
  var __awaiter2 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var SetRegion = class extends HTMLElement {
    constructor() {
      super();
      this.regionData = null;
    }
    connectedCallback() {
      this.fetchRegion();
    }
    fetchRegion() {
      return __awaiter2(this, void 0, void 0, function* () {
        const url = "../../../assets/json/region.json";
        try {
          this.regionData = yield CustomFetch_default.fetch(url);
          this.render();
          CustomEventEmitter_default.dispatch("fetch-region-data", {
            regionData: this.regionData
          });
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get region data.");
        }
      });
    }
    render() {
      if (!this.regionData) {
        throw new Error("regionData is null.");
      }
      const template = document.querySelector("#tp-region").content.firstElementChild;
      const container = this.querySelector(".regions");
      const regionData = this.regionData["region"];
      const fragment = new DocumentFragment();
      const stateRegions = Object.keys(getState().regions);
      for (const [key, value] of Object.entries(regionData)) {
        if (!template)
          return;
        const element = template.cloneNode(true);
        const checkbox = element.querySelector("input");
        checkbox.value = value;
        if (stateRegions.includes(key)) {
          checkbox.checked = true;
        }
        const spanElement = element.querySelector("span");
        if (spanElement)
          spanElement.textContent = key;
        fragment.appendChild(element);
      }
      container.appendChild(fragment);
      this.changeRegion();
    }
    changeRegion() {
      const checkboxes = this.querySelectorAll("[name=region]");
      checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
          const key = checkbox.nextElementSibling.textContent || "";
          if (checkbox.checked) {
            addRegion(key);
          } else {
            removeRegion(key);
          }
          CustomEventEmitter_default.dispatch("set-favorite-regions", {});
        });
      });
    }
  };

  // dev/src/pages/setting/SetDetailRegion.js
  var SetDetailRegion = class extends HTMLElement {
    constructor() {
      super();
      this.regionData = null;
      this.region = "";
    }
    connectedCallback() {
      CustomEventEmitter_default.add("fetch-region-data", this.setRegionData.bind(this));
      CustomEventEmitter_default.add("set-favorite-regions", this.renderRegion.bind(this));
    }
    disconnectedCallback() {
      CustomEventEmitter_default.remove("fetch-region-data", this.setRegionData);
      CustomEventEmitter_default.remove("set-favorite-regions", this.renderRegion);
    }
    setRegionData(event) {
      const customEvent = event;
      this.regionData = customEvent.detail.regionData;
      this.renderRegion();
    }
    renderRegion() {
      const favoriteRegions = Object.keys(getState().regions);
      if (favoriteRegions.length < 1)
        return;
      const fragment = new DocumentFragment();
      const template = document.querySelector("#tp-favorite-region").content.firstElementChild;
      const container = this.querySelector(".regions");
      container.innerHTML = "";
      favoriteRegions.forEach((key) => {
        if (!template)
          return;
        const element = template.cloneNode(true);
        const spanElement = element.querySelector("span");
        if (spanElement)
          spanElement.textContent = key;
        fragment.appendChild(element);
      });
      container.appendChild(fragment);
      const firstInput = container.querySelector("input");
      if (firstInput) {
        firstInput.checked = true;
        const label = firstInput.nextElementSibling.textContent || "";
        this.renderDetailRegions(label);
        this.changeRegion();
      }
    }
    renderDetailRegions(regionName) {
      const detailRegionsElement = this.querySelector(".detailRegions");
      if (!this.regionData)
        return;
      const regionObj = getState().regions[regionName];
      const regionCodes = regionObj ? Object.values(regionObj) : [];
      const template = document.querySelector("#tp-detail-region").content.firstElementChild;
      detailRegionsElement.innerHTML = "";
      const fragment = new DocumentFragment();
      const detailRegionData = this.regionData.detailRegion[regionName];
      if (!detailRegionData)
        return;
      for (const [key, value] of Object.entries(detailRegionData)) {
        if (!template)
          return;
        const element = template.cloneNode(true);
        const spanElement = element.querySelector("span");
        if (spanElement)
          spanElement.textContent = key;
        const input = element.querySelector("input");
        if (input) {
          input.value = value;
          if (regionCodes.includes(value)) {
            input.checked = true;
            fragment.insertBefore(element, fragment.firstChild);
          } else {
            fragment.appendChild(element);
          }
        }
      }
      detailRegionsElement.appendChild(fragment);
      this.region = regionName;
      this.onChangeDetail();
    }
    changeRegion() {
      const regionRadios = this.querySelectorAll("[name=favorite-region]");
      Array.from(regionRadios).forEach((radio) => {
        const inputRadio = radio;
        inputRadio.addEventListener("change", () => {
          if (inputRadio.checked) {
            const label = inputRadio.nextElementSibling.textContent || "";
            this.renderDetailRegions(label);
          }
        });
      });
    }
    onChangeDetail() {
      const region = this.region;
      if (!getState().regions[region]) {
        addRegion(region);
      }
      const checkboxes = document.querySelectorAll("[name=detailRegion]");
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox;
        inputCheckbox.addEventListener("change", () => {
          const { value } = inputCheckbox;
          const label = inputCheckbox.nextElementSibling.textContent || "";
          if (inputCheckbox.checked) {
            addDetailRegion(region, label, value);
          } else {
            removeDetailRegion(region, label);
          }
          CustomEventEmitter_default.dispatch("set-detail-regions", {});
        });
      });
    }
  };

  // dev/src/pages/setting/FavoriteRegions.js
  var FavoriteRegions = class extends HTMLElement {
    constructor() {
      super();
      this.container = this.querySelector(".favorites");
    }
    connectedCallback() {
      this.render();
      CustomEventEmitter_default.add("set-detail-regions", this.render.bind(this));
    }
    disconnectedCallback() {
      CustomEventEmitter_default.remove("set-detail-regions", this.render);
    }
    render() {
      this.container.innerHTML = "";
      const { regions } = getState();
      for (const regionName in regions) {
        const detaioRegions = Object.keys(regions[regionName]);
        if (detaioRegions.length > 0) {
          const titleElement = document.createElement("h3");
          titleElement.textContent = regionName;
          this.container.appendChild(titleElement);
          this.renderDetail(detaioRegions);
        }
      }
    }
    renderDetail(detaioRegions) {
      const fragment = new DocumentFragment();
      detaioRegions.forEach((name) => {
        const element = document.createElement("p");
        element.textContent = name;
        fragment.appendChild(element);
      });
      this.container.appendChild(fragment);
    }
  };

  // dev/src/pages/setting/SetStorage.js
  var __awaiter3 = function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
  var SetStorage = class extends HTMLElement {
    constructor() {
      super();
      this.storageButton = this.querySelector(".localStorage button");
      this.resetButton = this.querySelector(".resetStorage button");
    }
    connectedCallback() {
      this.storageButton.addEventListener("click", this.setLocalStorageToBase.bind(this));
      this.resetButton.addEventListener("click", this.resetStorage.bind(this));
    }
    disconnectedCallback() {
      this.storageButton.removeEventListener("click", this.setLocalStorageToBase);
      this.resetButton.removeEventListener("click", this.resetStorage);
    }
    setLocalStorageToBase() {
      return __awaiter3(this, void 0, void 0, function* () {
        const url = `../../../assets/json/storage-sample.json`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          setState(data);
          console.log("Saved local stronage by base data!");
          location.reload();
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get storage sample data.");
        }
      });
    }
    resetStorage() {
      localStorage.removeItem("BookWorld");
      location.reload();
    }
  };

  // dev/src/pages/setting/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-setting", AppSetting);
  customElements.define("set-region", SetRegion);
  customElements.define("set-detail-region", SetDetailRegion);
  customElements.define("favorite-regions", FavoriteRegions);
  customElements.define("set-storage", SetStorage);
})();
//# sourceMappingURL=index.js.map
