"use strict";
(() => {
  // src/script/utils/CustomEventEmitter.js
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

  // src/script/utils/CustomFetch.js
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

  // src/script/modules/model.js
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
  var addLibrary = (code, name) => {
    state.libraries[code] = name;
    setState(state);
  };
  var removeLibrary = (code) => {
    delete state.libraries[code];
    setState(state);
  };
  var hasLibrary = (code) => {
    return code in state.libraries;
  };

  // src/script/components/NavGnb.js
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

  // src/script/pages/library/Library.js
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
  var Library = class extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector("form");
    }
    connectedCallback() {
      CustomEventEmitter_default.add("set-detail-region", this.handleDetailRegion.bind(this));
    }
    disconnectedCallback() {
      CustomEventEmitter_default.remove("set-detail-region", this.handleDetailRegion);
    }
    fetchLibrarySearch(detailRegionCode) {
      return __awaiter2(this, void 0, void 0, function* () {
        try {
          const url = `/library-search?dtl_region=${detailRegionCode}&page=${1}&pageSize=${20}`;
          const data = yield CustomFetch_default.fetch(url);
          this.render(data);
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get library search data.");
        }
      });
    }
    render(data) {
      const {
        // pageNo, pageSize, numFound, resultNum,
        libraries
      } = data;
      if (libraries.length === 0) {
        this.showMessage("notFound");
        return;
      }
      const template = document.querySelector("#tp-item").content.firstElementChild;
      const fragment = libraries.reduce((fragment2, lib) => {
        if (template) {
          const libraryItem = template.cloneNode(true);
          libraryItem.dataset.object = JSON.stringify(lib);
          if (hasLibrary(lib.libCode)) {
            libraryItem.dataset.has = "true";
            fragment2.insertBefore(libraryItem, fragment2.firstChild);
          } else {
            fragment2.appendChild(libraryItem);
          }
        }
        return fragment2;
      }, new DocumentFragment());
      this.form.innerHTML = "";
      this.form.appendChild(fragment);
    }
    showMessage(type) {
      const template = document.querySelector(`#tp-${type}`).content.firstElementChild;
      if (template) {
        const element = template.cloneNode(true);
        this.form.innerHTML = "";
        this.form.appendChild(element);
      }
    }
    handleDetailRegion(evt) {
      this.showMessage("loading");
      this.fetchLibrarySearch(evt.detail.detailRegionCode);
    }
  };

  // src/script/pages/library/LibraryRegion.js
  var LibraryRegion = class extends HTMLElement {
    constructor() {
      super();
      this.selectElement = this.querySelector("select");
    }
    connectedCallback() {
      this.renderRegion();
      this.selectElement.addEventListener("change", this.onChangeDetail.bind(this));
    }
    disconnectedCallback() {
      this.selectElement.removeEventListener("change", this.onChangeDetail);
    }
    renderRegion() {
      const favoriteRegions = getState().regions;
      if (Object.values(favoriteRegions).length < 1)
        return;
      const template = document.querySelector("#tp-region").content.firstElementChild;
      const container = this.querySelector(".region");
      const fragment = new DocumentFragment();
      for (const regionName of Object.keys(favoriteRegions)) {
        const size = Object.keys(favoriteRegions[regionName]).length;
        if (template && size > 0) {
          const element = template.cloneNode(true);
          const inputElement = element.querySelector("input");
          if (inputElement)
            inputElement.value = regionName;
          const spanElement = element.querySelector("span");
          if (spanElement)
            spanElement.textContent = regionName;
          fragment.appendChild(element);
        }
      }
      container.appendChild(fragment);
      const firstInput = container.querySelector("input");
      firstInput.checked = true;
      this.renderDetailRegion(firstInput.value);
      this.changeRegion();
    }
    changeRegion() {
      const regionRadios = this.querySelectorAll("[name=region]");
      regionRadios.forEach((radio) => {
        radio.addEventListener("change", () => {
          if (radio.checked) {
            const value = radio.value;
            this.renderDetailRegion(value);
          }
        });
      });
    }
    renderDetailRegion(regionName) {
      this.selectElement.innerHTML = "";
      const detailRegionObject = getState().regions[regionName];
      for (const [key, value] of Object.entries(detailRegionObject)) {
        const optionEl = document.createElement("option");
        optionEl.textContent = key;
        optionEl.value = value;
        this.selectElement.appendChild(optionEl);
      }
      const firstInput = this.selectElement.querySelector("option");
      firstInput.selected = true;
      this.onChangeDetail();
    }
    onChangeDetail() {
      const { value } = this.selectElement;
      CustomEventEmitter_default.dispatch("set-detail-region", {
        detailRegionCode: value
      });
    }
  };

  // src/script/pages/library/LibraryItem.js
  var LibraryItem = class extends HTMLElement {
    constructor() {
      super();
      this.checkbox = null;
      this.libCode = "";
      this.libName = "";
      this.checkbox = this.querySelector("[name=myLibrary]");
    }
    connectedCallback() {
      var _a;
      this.render();
      (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onChange.bind(this));
    }
    disconnectedCallback() {
      var _a;
      (_a = this.checkbox) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onChange);
    }
    render() {
      const data = JSON.parse(this.dataset.object || "");
      const { libCode, libName } = data;
      Object.entries(data).forEach(([key, value]) => {
        const element = this.querySelector(`.${key}`);
        if (element) {
          element.innerHTML = value;
        }
      });
      const hoempageLink = this.querySelector(".homepage");
      if (hoempageLink)
        hoempageLink.href = data.homepage;
      this.libCode = libCode;
      this.libName = libName;
      if (this.checkbox)
        this.checkbox.checked = hasLibrary(this.libCode);
    }
    onChange(event) {
      const target = event.target;
      if (target.checked) {
        addLibrary(this.libCode, this.libName);
      } else {
        removeLibrary(this.libCode);
      }
    }
  };

  // src/script/pages/library/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-library", Library);
  customElements.define("library-region", LibraryRegion);
  customElements.define("library-item", LibraryItem);
})();
//# sourceMappingURL=index.js.map
