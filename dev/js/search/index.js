"use strict";
(() => {
  // dev/scripts/components/BookDescription.js
  var BookDescription = class extends HTMLElement {
    constructor() {
      super();
      this.el = null;
      this.button = null;
    }
    set data(value) {
      this.render(value);
    }
    connectedCallback() {
      this.render(this.data);
    }
    disconnectedCallback() {
      if (this.button)
        this.button.removeEventListener("click", this.onButtonClick.bind(this));
    }
    render(value) {
      const template = `
            <p class="description" data-ellipsis="true">${value}</p>
            <button type="button" class="more-description-button">\uC124\uBA85 \uB354\uBCF4\uAE30</button>`;
      this.innerHTML = template;
      this.el = this.querySelector(".description");
      this.button = this.querySelector(".more-description-button");
      if (this.button)
        this.button.addEventListener("click", this.onButtonClick.bind(this));
    }
    // isEllipsisActive(el) {
    //     return (el.offsetHeight < el.scrollHeight);
    // }
    onButtonClick() {
      if (!this.el)
        return;
      switch (this.el.dataset.ellipsis) {
        case "true":
          this.el.dataset.ellipsis = "false";
          if (this.button)
            this.button.textContent = "\uC124\uBA85 \uC811\uAE30";
          break;
        case "false":
          this.el.dataset.ellipsis = "true";
          if (this.button)
            this.button.textContent = "\uC124\uBA85 \uB354\uBCF4\uAE30";
          break;
      }
    }
  };

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

  // dev/scripts/utils/Observer.js
  var Observer = class {
    constructor(target, callback) {
      this.target = target;
      this.observer = new IntersectionObserver((changes) => {
        this.handleIntersection(changes, callback);
      });
    }
    observe() {
      this.observer.observe(this.target);
    }
    unobserve() {
      this.observer.unobserve(this.target);
    }
    disconnect() {
      this.observer.disconnect();
    }
    handleIntersection(changes, callback) {
      changes.forEach((change) => {
        if (change.isIntersecting) {
          this.unobserve();
          callback();
        }
      });
    }
  };

  // dev/scripts/components/LibraryBookExist.js
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
  var LibraryBookExist = class extends HTMLElement {
    constructor() {
      super();
      this.container = this.querySelector(".library-list");
      this.itemTemplate = "";
    }
    connectedCallback() {
      this.itemTemplate = this.template();
    }
    onLibraryBookExist(button, isbn13, library) {
      return __awaiter2(this, void 0, void 0, function* () {
        const entries = Object.entries(library);
        this.loading(entries.length);
        if (button) {
          button.disabled = true;
        }
        const promises = entries.map(([libCode, libName], index) => __awaiter2(this, void 0, void 0, function* () {
          try {
            const data = yield CustomFetch_default.fetch(`/book-exist?isbn13=${isbn13}&libCode=${libCode}`);
            this.renderBookExist(data, libName, index);
          } catch (error) {
            console.error(error);
            throw new Error(`Fail to get usage analysis list.`);
          }
        }));
        try {
          yield Promise.all(promises);
          this.removeLoading();
        } catch (error) {
          console.error("Failed to fetch data for some libraries");
        }
      });
    }
    renderBookExist(data, libName, index) {
      const { hasBook, loanAvailable } = data;
      const _hasBook = hasBook === "Y" ? "\uC18C\uC7A5, " : "\uBBF8\uC18C\uC7A5";
      let _loanAvailable = "";
      if (hasBook === "Y") {
        _loanAvailable = loanAvailable === "Y" ? "\uB300\uCD9C\uAC00\uB2A5" : "\uB300\uCD9C\uBD88\uAC00";
      }
      const el = this.querySelectorAll(".library-item")[index];
      const elName = el.querySelector(".name");
      if (elName) {
        elName.textContent = `\u263C ${libName} : `;
      }
      const elHasBook = el.querySelector(".hasBook");
      if (elHasBook) {
        elHasBook.textContent = _hasBook;
      }
      const elLoanAvailable = el.querySelector(".loanAvailable");
      if (elLoanAvailable) {
        elLoanAvailable.textContent = _loanAvailable;
      }
    }
    loading(size) {
      let tp = "";
      while (size > 0) {
        tp += this.itemTemplate;
        size--;
      }
      this.container.innerHTML = tp;
    }
    removeLoading() {
      const loadingItems = this.querySelectorAll(".library-item[data-loading=true]");
      loadingItems.forEach((el) => {
        delete el.dataset.loading;
      });
    }
    template() {
      return `<li class="library-item" data-loading="true">
            <span class="name"></span>
            <span class="hasBook"></span>
            <span class="loanAvailable"></span>
        </li>`;
    }
  };

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

  // dev/scripts/pages/search/AppSearch.js
  var AppSearch = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.renderBookList();
      window.addEventListener("popstate", this.onPopState.bind(this));
    }
    disconnectedCallback() {
      window.removeEventListener("popstate", this.onPopState);
    }
    onPopState() {
      this.renderBookList();
    }
    renderBookList() {
      const params = new URLSearchParams(location.search);
      const keyword = params.get("keyword");
      CustomEventEmitter_default.dispatch("search-page-init", { keyword });
    }
  };

  // dev/scripts/pages/search/InputSearch.js
  var InputSearch = class extends HTMLElement {
    constructor() {
      super();
      this.form = this.querySelector("form");
      this.input = this.querySelector("input");
    }
    connectedCallback() {
      this.form.addEventListener("submit", this.onSubmit.bind(this));
    }
    disconnectedCallback() {
      this.form.removeEventListener("submit", this.onSubmit);
    }
    onSubmit(event) {
      event.preventDefault();
      const keyword = this.input.value;
      if (!keyword)
        return;
      this.input.value = "";
      const url = new URL(window.location.href);
      url.searchParams.set("keyword", keyword);
      window.history.pushState({}, "", url);
      CustomEventEmitter_default.dispatch("search-page-init", { keyword });
      this.input.focus();
    }
  };

  // dev/scripts/pages/search/BookList.js
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
  var BookList = class extends HTMLElement {
    constructor() {
      super();
      this.initializeProperties();
      this.bindMethods();
    }
    initializeProperties() {
      this.pagingInfo = this.querySelector(".paging-info");
      this.books = this.querySelector(".books");
    }
    bindMethods() {
      this.fetchSearchNaverBook = this.fetchSearchNaverBook.bind(this);
    }
    connectedCallback() {
      this.setupObserver();
      CustomEventEmitter_default.add("search-page-init", this.onSearchPageInit.bind(this));
    }
    disconnectedCallback() {
      var _a;
      (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
      CustomEventEmitter_default.remove("search-page-init", this.onSearchPageInit);
    }
    setupObserver() {
      const target = this.querySelector(".observe");
      const callback = this.fetchSearchNaverBook;
      this.observer = new Observer(target, callback);
    }
    onSearchPageInit(event) {
      const customEvent = event;
      this.keyword = customEvent.detail.keyword;
      this.length = 0;
      if (this.keyword) {
        this.handleKeywordPresent();
        return;
      }
      this.handleKeywordAbsent();
    }
    handleKeywordPresent() {
      this.showMessage("loading");
      this.books.innerHTML = "";
      this.fetchSearchNaverBook();
    }
    handleKeywordAbsent() {
      this.pagingInfo.hidden = true;
      this.showMessage("message");
    }
    fetchSearchNaverBook() {
      return __awaiter3(this, void 0, void 0, function* () {
        if (!this.keyword)
          return;
        const url = `/search-naver-book?keyword=${encodeURIComponent(this.keyword)}&display=${10}&start=${this.length + 1}`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          this.render(data);
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get naver book.");
        }
      });
    }
    render(data) {
      var _a;
      const { total, display, items } = data;
      const prevLength = this.length;
      this.length += Number(display);
      this.updatePagingInfo({ total, display });
      this.pagingInfo.hidden = false;
      if (total === 0) {
        this.showMessage("notFound");
        return;
      }
      this.appendBookItems(items, prevLength);
      if (total !== this.length) {
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observe();
      }
    }
    updatePagingInfo({ total, display }) {
      const obj = {
        keyword: `${this.keyword}`,
        length: `${this.length.toLocaleString()}`,
        total: `${total.toLocaleString()}`,
        display: `${display}\uAC1C\uC529`
      };
      for (const [key, value] of Object.entries(obj)) {
        const element = this.pagingInfo.querySelector(`.__${key}`);
        element.textContent = value;
      }
    }
    appendBookItems(items, prevLength) {
      const fragment = new DocumentFragment();
      items.forEach((item, index) => {
        const template = document.querySelector("[data-template=book-item]").content.firstElementChild;
        if (!template)
          return;
        const el = template.cloneNode(true);
        el.bookData = item;
        el.dataset.index = (prevLength + index).toString();
        fragment.appendChild(el);
      });
      this.books.appendChild(fragment);
    }
    showMessage(type) {
      const template = document.querySelector(`#tp-${type}`).content.firstElementChild;
      if (!template)
        return;
      const el = template.cloneNode(true);
      this.books.innerHTML = "";
      this.books.appendChild(el);
    }
  };

  // dev/scripts/pages/search/BookItem.js
  var BookItem = class extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    connectedCallback() {
      this.libraryButton = this.querySelector(".library-button");
      this.anchorElement = this.querySelector(".book-summary");
      this.render();
      this.libraryButton.addEventListener("click", this.onClickLibraryButton.bind(this));
      this.anchorElement.addEventListener("click", this.onClickLink.bind(this));
    }
    disconnectedCallback() {
      this.libraryButton.removeEventListener("click", this.onClickLibraryButton);
      this.anchorElement.removeEventListener("click", this.onClickLink);
    }
    render() {
      const {
        author,
        description,
        image,
        isbn,
        link,
        pubdate,
        publisher,
        title
        // discount,
        // price,
      } = this.bookData;
      const formattedPubdate = `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
      const titleEl = this.querySelector(".title");
      if (titleEl)
        titleEl.textContent = title;
      const pubEl = this.querySelector(".publisher");
      if (pubEl)
        pubEl.textContent = publisher;
      const authorEl = this.querySelector(".author");
      if (authorEl)
        authorEl.textContent = author;
      const pubdateEl = this.querySelector(".pubdate");
      if (pubdateEl)
        pubdateEl.textContent = formattedPubdate;
      const isbnEl = this.querySelector(".isbn");
      if (isbnEl)
        isbnEl.textContent = `isbn : ${isbn.split(" ").join(", ")}`;
      const bookDespEl = this.querySelector("book-description");
      if (bookDespEl)
        bookDespEl.data = description;
      const linkEl = this.querySelector(".__link");
      if (linkEl)
        linkEl.href = link;
      const bookImageEl = this.querySelector("book-image");
      if (bookImageEl)
        bookImageEl.dataset.object = JSON.stringify({
          bookImageURL: image,
          bookname: title
        });
      this.dataset.isbn = isbn;
    }
    onClickLibraryButton() {
      const isbn = this.dataset.isbn || "";
      const libraryBookExist = this.querySelector("library-book-exist");
      if (libraryBookExist) {
        libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries);
      }
    }
    onClickLink(event) {
      event.preventDefault();
      location.href = `book?isbn=${this.dataset.isbn}`;
    }
  };

  // dev/scripts/pages/search/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("book-list", BookList);
  customElements.define("app-search", AppSearch);
  customElements.define("input-search", InputSearch);
  customElements.define("book-item", BookItem);
  customElements.define("book-description", BookDescription);
  customElements.define("library-book-exist", LibraryBookExist);
  customElements.define("checkbox-favorite-book", CheckboxFavoriteBook);
  customElements.define("book-image", BookImage);
})();
//# sourceMappingURL=index.js.map
