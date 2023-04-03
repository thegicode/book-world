"use strict";
(() => {
  // dev/scripts/utils/CustomEventEmitter.js
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

  // dev/scripts/utils/CustomFetch.js
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

  // dev/scripts/modules/model.js
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
      throw new Error("Failed to get state from localStorage.");
    }
  };
  var state = getState();
  var addFavoriteBook = (isbn) => {
    state.favoriteBooks.push(isbn);
    setState(state);
  };
  var removeFavoriteBook = (isbn) => {
    const index = state.favoriteBooks.indexOf(isbn);
    if (index !== -1) {
      state.favoriteBooks.splice(index, 1);
      setState(state);
    }
  };
  var isFavoriteBook = (isbn) => {
    return state.favoriteBooks.includes(isbn);
  };

  // dev/scripts/components/NavGnb.js
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

  // dev/scripts/modules/events.js
  var updateFavoriteBooksSize = (size = getState().favoriteBooks.length) => {
    const navElement = document.querySelector("nav-gnb");
    navElement.querySelector(".size").textContent = String(size);
  };

  // dev/scripts/components/CheckboxFavoriteBook.js
  var CheckboxFavoriteBook = class extends HTMLElement {
    constructor() {
      super();
      this.inputElement = null;
      this.isbn = null;
    }
    connectedCallback() {
      var _a;
      const isbnElement = this.closest("[data-isbn]");
      this.isbn = isbnElement.dataset.isbn;
      this.render();
      (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.onChange.bind(this));
    }
    disconnectedCallback() {
      var _a;
      (_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.addEventListener("change", this.onChange);
    }
    render() {
      const isbn = this.isbn || "";
      const checked = isFavoriteBook(isbn) ? "checked" : "";
      this.innerHTML = `<label>
            <input type="checkbox" name="favorite" ${checked}>
            <span>\uAD00\uC2EC\uCC45</span>
        </label>`;
      this.inputElement = this.querySelector("input");
    }
    onChange() {
      var _a;
      const ISBN = this.isbn || "";
      if ((_a = this.inputElement) === null || _a === void 0 ? void 0 : _a.checked) {
        addFavoriteBook(ISBN);
      } else {
        removeFavoriteBook(ISBN);
      }
      updateFavoriteBooksSize();
    }
  };

  // dev/scripts/components/BookImage.js
  var BookImage = class extends HTMLElement {
    constructor() {
      super();
    }
    // 즐겨찾기, 상세
    set data(objectData) {
      this.dataset.object = JSON.stringify(objectData);
      const imgElement = this.querySelector("img");
      if (imgElement && imgElement.getAttribute("src") === "") {
        this.render();
      }
    }
    connectedCallback() {
      this.render();
    }
    // search : dataset
    render() {
      const data = this.dataset.object ? JSON.parse(this.dataset.object) : null;
      let imageSrc = "";
      let imageAlt = "";
      if (data) {
        const { bookImageURL, bookname } = data;
        imageSrc = bookImageURL;
        imageAlt = bookname;
      }
      this.innerHTML = `
            <div class="book-image">
                <img class="thumb" src="${imageSrc}" alt="${imageAlt}"></img>
            </div>`;
      const imgElement = this.querySelector("img");
      if (imgElement && imgElement.getAttribute("src")) {
        this.handleError(imgElement);
      }
    }
    handleError(imgElement) {
      if (imgElement) {
        imgElement.onerror = () => {
          this.dataset.fail = "true";
          imgElement.remove();
        };
      }
    }
  };

  // dev/scripts/pages/book/Book.js
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
  var Book = class extends HTMLElement {
    constructor() {
      super();
      this.loadingElement = this.querySelector(".loading");
      this.data = null;
    }
    connectedCallback() {
      const isbn = new URLSearchParams(location.search).get("isbn");
      this.dataset.isbn = isbn;
      this.fetchUsageAnalysisList(isbn);
    }
    fetchUsageAnalysisList(isbn) {
      return __awaiter2(this, void 0, void 0, function* () {
        try {
          const data = yield CustomFetch_default.fetch(`/usage-analysis-list?isbn13=${isbn}`);
          this.data = data;
          this.render();
        } catch (error) {
          this.renderError();
          console.error(error);
          throw new Error(`Fail to get usage analysis list.`);
        }
      });
    }
    render() {
      if (!this.data)
        return;
      const { book: { bookname, authors, bookImageURL, class_nm, class_no, description, isbn13, loanCnt, publication_year, publisher }, keywords, recBooks } = this.data;
      const bookNames = bookname.split(/[=/:]/).map((item) => `<p>${item}</p>`).join("");
      const keywordsString = keywords.map((item) => `<span>${item.word}</span>`).join("");
      const recBooksString = recBooks.map(({ bookname: bookname2, isbn13: isbn132 }) => `<li><a href=book?isbn=${isbn132}>${bookname2}</a></li>`).join("");
      this.querySelector(".bookname").innerHTML = bookNames;
      this.querySelector(".authors").textContent = authors;
      this.querySelector(".class_nm").textContent = class_nm;
      this.querySelector(".class_no").textContent = class_no;
      this.querySelector(".description").textContent = description;
      this.querySelector(".isbn13").textContent = isbn13;
      this.querySelector(".loanCnt").textContent = loanCnt.toLocaleString();
      this.querySelector(".publication_year").textContent = publication_year;
      this.querySelector(".publisher").textContent = publisher;
      this.querySelector(".keyword").innerHTML = keywordsString;
      this.querySelector(".recBooks").innerHTML = recBooksString;
      const bookImageElement = this.querySelector("book-image");
      if (bookImageElement) {
        bookImageElement.data = {
          bookImageURL,
          bookname
        };
      }
      this.loadingElement.remove();
    }
    renderError() {
      this.loadingElement.textContent = "\uC815\uBCF4\uB97C \uAC00\uC838\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.";
    }
  };

  // dev/scripts/pages/book/LibrarySearchByBook.js
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
  var LibrarySearchByBook = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      const isbn = new URLSearchParams(location.search).get("isbn");
      this.fetchList(isbn);
    }
    fetchList(isbn) {
      return __awaiter3(this, void 0, void 0, function* () {
        const favoriteLibraries = getState().regions;
        for (const regionName in favoriteLibraries) {
          const detailCodes = Object.values(favoriteLibraries[regionName]);
          if (detailCodes.length === 0)
            return;
          const regionCode = detailCodes[0].slice(0, 2);
          detailCodes.forEach((detailCode) => {
            this.fetchLibrarySearchByBook(isbn, regionCode, detailCode);
          });
        }
      });
    }
    fetchLibrarySearchByBook(isbn, region, dtl_region) {
      return __awaiter3(this, void 0, void 0, function* () {
        const searchParams = new URLSearchParams({
          isbn,
          region,
          dtl_region
        });
        const url = `/library-search-by-book?${searchParams}`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          this.render(data, isbn);
        } catch (error) {
          console.error(error);
          throw new Error(`Fail to get library search by book.`);
        }
      });
    }
    render({ libraries }, isbn) {
      if (libraries.length < 1)
        return;
      const container = document.querySelector(".library-search-by-book");
      if (!container)
        return;
      const listElement = document.createElement("ul");
      const fragment = new DocumentFragment();
      libraries.forEach(({ homepage, libCode, libName }) => {
        var _a;
        const template = document.querySelector("#tp-librarySearchByBookItem");
        if (!template)
          return;
        const cloned = (_a = template.content.firstElementChild) === null || _a === void 0 ? void 0 : _a.cloneNode(true);
        const link = cloned.querySelector("a");
        if (!link)
          return;
        cloned.dataset.code = libCode;
        link.textContent = libName;
        link.href = homepage;
        this.loanAvailable(isbn, libCode, cloned.querySelector("p"));
        fragment.appendChild(cloned);
      });
      listElement.appendChild(fragment);
      container.appendChild(listElement);
    }
    loanAvailable(isbn, libCode, el) {
      return __awaiter3(this, void 0, void 0, function* () {
        const isAvailable = yield this.fetchLoadnAvailabilty(isbn, libCode);
        const element = el.querySelector(".loanAvailable");
        if (element) {
          element.textContent = isAvailable ? "\uB300\uCD9C \uAC00\uB2A5" : "\uB300\uCD9C \uBD88\uAC00";
          if (isAvailable && el.parentElement) {
            el.parentElement.dataset.available = "true";
          }
        }
      });
    }
    fetchLoadnAvailabilty(isbn13, libCode) {
      return __awaiter3(this, void 0, void 0, function* () {
        const searchParams = new URLSearchParams({
          isbn13,
          libCode
        });
        const url = `/book-exist?${searchParams}`;
        try {
          const data = yield CustomFetch_default.fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
          });
          return data.loanAvailable === "Y";
        } catch (error) {
          console.error(error);
          throw new Error(`Fail to get book exist.`);
        }
      });
    }
  };

  // dev/scripts/pages/book/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-book", Book);
  customElements.define("library-search-by-book", LibrarySearchByBook);
  customElements.define("checkbox-favorite-book", CheckboxFavoriteBook);
  customElements.define("book-image", BookImage);
})();
//# sourceMappingURL=index.js.map
