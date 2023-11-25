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

  // dev/scripts/components/BookImage.js
  var BookImage = class extends HTMLElement {
    constructor() {
      super();
      this.imgElement = document.createElement("img");
      this.imgElement.className = "thumb";
      this.imgContainer = document.createElement("div");
      this.imgContainer.className = "book-image";
      this.imgElement.onerror = this.handleImageError.bind(this);
    }
    // 즐겨찾기, 상세
    set data(objectData) {
      const jsonData = JSON.stringify(objectData);
      if (this.dataset.object !== jsonData) {
        this.dataset.object = jsonData;
        this.render();
      }
    }
    connectedCallback() {
      if (!this.imgElement.src && this.dataset.object) {
        this.render();
      }
    }
    // search : dataset
    render() {
      const data = this.dataset.object ? JSON.parse(this.dataset.object) : null;
      if (data && "bookImageURL" in data && "bookname" in data) {
        const { bookImageURL, bookname } = data;
        this.imgElement.src = bookImageURL;
        this.imgElement.alt = bookname;
        this.imgContainer.appendChild(this.imgElement);
        this.appendChild(this.imgContainer);
      }
    }
    handleImageError() {
      this.dataset.fail = "true";
      console.error(`Failed to load image: ${this.imgElement.src}`);
      this.imgElement.remove();
      if (!this.imgContainer.hasChildNodes()) {
        this.imgContainer.remove();
      }
    }
  };

  // dev/scripts/model/constants.js
  var STORAGE_NAME = "BookWorld";

  // dev/scripts/utils/Publisher.js
  var Publisher = class {
    constructor() {
      this.subscribers = [];
    }
    subscribe(callback) {
      this.subscribers.push(callback);
    }
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter((subscriber) => subscriber !== callback);
    }
    notify(payload) {
      this.subscribers.forEach((callback) => callback(payload));
    }
  };

  // dev/scripts/model/FavoriteModel.js
  var FavoriteModel = class {
    constructor(categories, sortedKeys) {
      this.categoriesUpdatePublisher = new Publisher();
      this.bookUpdatePublisher = new Publisher();
      this._favorites = categories;
      this._sortedKeys = sortedKeys;
    }
    get favorites() {
      return Object.assign({}, this._favorites);
    }
    set favorites(newCategories) {
      this._favorites = newCategories;
    }
    get sortedKeys() {
      return [...this._sortedKeys];
    }
    set sortedKeys(newKeys) {
      this._sortedKeys = newKeys;
    }
    add(name) {
      this._favorites[name] = [];
      this.categoriesUpdatePublisher.notify({
        type: "add",
        payload: { name }
      });
    }
    addSortedKeys(name) {
      this._sortedKeys.push(name);
    }
    rename(prevName, newName) {
      if (prevName in this._favorites) {
        this._favorites[newName] = this._favorites[prevName];
        delete this._favorites[prevName];
        this.categoriesUpdatePublisher.notify({
          type: "rename",
          payload: { prevName, newName }
        });
      }
    }
    renameSortedKeys(prevName, newName) {
      const index = this._sortedKeys.indexOf(prevName);
      if (index !== -1) {
        this._sortedKeys[index] = newName;
      }
    }
    change(draggedKey, targetKey) {
      const draggedIndex = this._sortedKeys.indexOf(draggedKey);
      const targetIndex = this._sortedKeys.indexOf(targetKey);
      this._sortedKeys[targetIndex] = draggedKey;
      this._sortedKeys[draggedIndex] = targetKey;
      this.categoriesUpdatePublisher.notify({
        type: "change",
        payload: {
          targetIndex,
          draggedIndex
        }
      });
    }
    delete(name) {
      delete this._favorites[name];
      this.categoriesUpdatePublisher.notify({
        type: "delete",
        payload: { name }
      });
    }
    deleteSortedKeys(name) {
      const index = this._sortedKeys.indexOf(name);
      this._sortedKeys.splice(index, 1);
      return index;
    }
    has(name) {
      return name in this._favorites;
    }
    addBook(name, isbn) {
      if (name in this._favorites) {
        this._favorites[name].unshift(isbn);
      }
      this.bookUpdatePublisher.notify();
    }
    hasBook(name, isbn) {
      return name in this._favorites && this._favorites[name].includes(isbn);
    }
    removeBook(name, isbn) {
      if (name in this._favorites) {
        const index = this._favorites[name].indexOf(isbn);
        if (index != -1) {
          this._favorites[name].splice(index, 1);
        }
      }
      this.bookUpdatePublisher.notify();
    }
    subscribeFavoritesUpdate(subscriber) {
      this.categoriesUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeFavoritesUpdate(subscriber) {
      this.categoriesUpdatePublisher.unsubscribe(subscriber);
    }
    subscribeBookUpdate(subscriber) {
      this.bookUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
      this.bookUpdatePublisher.unsubscribe(subscriber);
    }
  };

  // dev/scripts/model/LibraryModel.js
  var LibraryModel = class {
    constructor(libraries) {
      this._libraries = libraries;
    }
    get libraries() {
      return Object.assign({}, this._libraries);
    }
    set libraries(newLibries) {
      this._libraries = newLibries;
    }
    add(code, name) {
      this._libraries[code] = name;
    }
    remove(code) {
      delete this._libraries[code];
    }
    has(code) {
      return code in this._libraries;
    }
  };

  // dev/scripts/model/RegionModel.js
  var RegionModel = class {
    constructor(regions) {
      this.updatePublisher = new Publisher();
      this.detailUpdatePublisher = new Publisher();
      this._regions = regions;
    }
    get regions() {
      return Object.assign({}, this._regions);
    }
    set regions(newRegions) {
      this._regions = newRegions;
    }
    add(name) {
      this._regions[name] = {};
      this.updatePublisher.notify();
    }
    remove(name) {
      delete this._regions[name];
      this.updatePublisher.notify();
    }
    addDetail(regionName, detailName, detailCode) {
      if (regionName in this._regions) {
        this._regions[regionName][detailName] = detailCode;
      }
      this.detailUpdatePublisher.notify();
    }
    removeDetail(regionName, detailName) {
      if (regionName in this._regions && detailName in this._regions[regionName]) {
        delete this._regions[regionName][detailName];
      }
      this.detailUpdatePublisher.notify();
    }
    subscribeToUpdatePublisher(subscriber) {
      this.updatePublisher.subscribe(subscriber);
    }
    unsubscribeToUpdatePublisher(subscriber) {
      this.updatePublisher.unsubscribe(subscriber);
    }
    subscribeToDetailUpdatePublisher(subscriber) {
      this.detailUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToDetailUpdatePublisher(subscriber) {
      this.detailUpdatePublisher.unsubscribe(subscriber);
    }
  };

  // dev/scripts/model/index.js
  var cloneDeep = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var initialState = {
    favorites: {},
    sortedFavoriteKeys: [],
    libraries: {},
    regions: {}
  };
  var BookModel = class {
    constructor() {
      this.bookStateUpdatePublisher = new Publisher();
      const state = this.loadStorage() || cloneDeep(initialState);
      const { favorites, sortedFavoriteKeys, libraries, regions } = state;
      this.favoriteModel = new FavoriteModel(favorites, sortedFavoriteKeys);
      this.libraryModel = new LibraryModel(libraries);
      this.regionModel = new RegionModel(regions);
    }
    // localStorage 관련
    loadStorage() {
      const storageData = localStorage.getItem(STORAGE_NAME);
      return storageData ? JSON.parse(storageData) : null;
    }
    setStorage(newState) {
      try {
        localStorage.setItem(STORAGE_NAME, JSON.stringify(newState));
      } catch (error) {
        console.error(error);
      }
    }
    // state 관련
    getState() {
      return this.loadStorage();
    }
    setState(newState) {
      this.setStorage(newState);
      const { favorites, sortedFavoriteKeys, libraries, regions } = newState;
      this.favoriteModel.favorites = favorites;
      this.favoriteModel.sortedKeys = sortedFavoriteKeys;
      this.libraryModel.libraries = libraries;
      this.regionModel.regions = regions;
      this.bookStateUpdatePublisher.notify();
    }
    resetState() {
      this.setState(initialState);
    }
    // favorites 관련 메서드
    getFavorites() {
      return this.favoriteModel.favorites;
    }
    getSortedFavoriteKeys() {
      return this.favoriteModel.sortedKeys;
    }
    setFavorites() {
      const newState = this.getState();
      newState.favorites = this.getFavorites();
      newState.sortedFavoriteKeys = this.getSortedFavoriteKeys();
      this.setStorage(newState);
    }
    addfavorite(name) {
      this.favoriteModel.add(name);
      this.favoriteModel.addSortedKeys(name);
      this.setFavorites();
    }
    renameFavorite(prevName, newName) {
      this.favoriteModel.rename(prevName, newName);
      this.setFavorites();
    }
    renameSortedFavoriteKey(prevName, newName) {
      this.favoriteModel.renameSortedKeys(prevName, newName);
      this.setFavorites();
    }
    deleteFavorite(name) {
      this.favoriteModel.delete(name);
      this.setFavorites();
    }
    deleteSortedFavoriteKey(name) {
      const index = this.favoriteModel.deleteSortedKeys(name);
      this.setFavorites();
      return index;
    }
    hasFavorite(name) {
      return this.favoriteModel.has(name);
    }
    changeFavorite(draggedKey, targetKey) {
      this.favoriteModel.change(draggedKey, targetKey);
      this.setFavorites();
    }
    addFavoriteBook(name, isbn) {
      this.favoriteModel.addBook(name, isbn);
      this.setFavorites();
    }
    hasFavoriteBook(name, isbn) {
      return this.favoriteModel.hasBook(name, isbn);
    }
    removeFavoriteBook(name, isbn) {
      this.favoriteModel.removeBook(name, isbn);
      this.setFavorites();
    }
    // Library 관련 메서드
    getLibraries() {
      return this.libraryModel.libraries;
    }
    setLibraries() {
      const newState = this.getState();
      newState.libraries = this.getLibraries();
      this.setStorage(newState);
    }
    addLibraries(code, name) {
      this.libraryModel.add(code, name);
      this.setLibraries();
    }
    removeLibraries(code) {
      this.libraryModel.remove(code);
      this.setLibraries();
    }
    hasLibrary(code) {
      return this.libraryModel.has(code);
    }
    // Region 관련 메서드
    getRegions() {
      return this.regionModel.regions;
    }
    setRegions() {
      const newState = this.getState();
      newState.regions = this.getRegions();
      this.setStorage(newState);
    }
    addRegion(name) {
      this.regionModel.add(name);
      this.setRegions();
    }
    removeRegion(name) {
      this.regionModel.remove(name);
      this.setRegions();
    }
    addDetailRegion(regionName, detailName, detailCode) {
      this.regionModel.addDetail(regionName, detailName, detailCode);
      this.setRegions();
    }
    removeDetailRegion(regionName, detailName) {
      this.regionModel.removeDetail(regionName, detailName);
      this.setRegions();
    }
    // subscribe
    subscribeToBookStateUpdate(subscriber) {
      this.bookStateUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToBookStateUpdate(subscriber) {
      this.bookStateUpdatePublisher.unsubscribe(subscriber);
    }
    subscribeToFavoritesUpdate(subscriber) {
      this.favoriteModel.subscribeFavoritesUpdate(subscriber);
    }
    unsubscribeToFavoritesUpdate(subscriber) {
      this.favoriteModel.unsubscribeFavoritesUpdate(subscriber);
    }
    subscribeBookUpdate(subscriber) {
      this.favoriteModel.subscribeBookUpdate(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
      this.favoriteModel.unsubscribeBookUpdate(subscriber);
    }
    subscribeToRegionUpdate(subscriber) {
      this.regionModel.subscribeToUpdatePublisher(subscriber);
    }
    unsubscribeToRegionUpdate(subscriber) {
      this.regionModel.unsubscribeToUpdatePublisher(subscriber);
    }
    subscribeToDetailRegionUpdate(subscriber) {
      this.regionModel.subscribeToDetailUpdatePublisher(subscriber);
    }
    unsubscribeToDetailRegionUpdate(subscriber) {
      this.regionModel.unsubscribeToDetailUpdatePublisher(subscriber);
    }
  };
  var bookModel = new BookModel();
  var model_default = bookModel;

  // dev/scripts/components/CategorySelector.js
  var CategorySelector = class extends HTMLElement {
    constructor() {
      super();
      this.createCategoryItem = (container, category, ISBN) => {
        const label = document.createElement("label");
        const checkbox = this.createCheckbox(category, ISBN);
        const span = document.createElement("span");
        span.textContent = category;
        label.appendChild(checkbox);
        label.appendChild(span);
        container.appendChild(label);
        return container;
      };
      this.isbn = this.getISBN();
      this.button = null;
      this.onClickCategory = this.onClickCategory.bind(this);
    }
    connectedCallback() {
      this.render();
    }
    render() {
      var _a;
      const button = this.createButton();
      const container = this.createContainer();
      this.button = button;
      this.appendChild(container);
      this.appendChild(button);
      (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickCategory);
    }
    createButton() {
      const button = document.createElement("button");
      button.className = "category-button";
      button.textContent = "Category";
      return button;
    }
    onClickCategory() {
      const el = this.querySelector(".category");
      el.hidden = !el.hidden;
    }
    getISBN() {
      const isbnElement = this.closest("[data-isbn]");
      return isbnElement && isbnElement.dataset.isbn ? isbnElement.dataset.isbn : null;
    }
    createContainer() {
      const container = document.createElement("div");
      container.className = "category";
      container.hidden = true;
      model_default.getSortedFavoriteKeys().forEach((category) => this.createCategoryItem(container, category, this.isbn || ""));
      return container;
    }
    createCheckbox(category, ISBN) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      if (model_default.hasFavoriteBook(category, ISBN)) {
        checkbox.checked = true;
      }
      checkbox.addEventListener("change", () => this.onChange(checkbox, category, ISBN));
      return checkbox;
    }
    onChange(checkbox, category, ISBN) {
      const isBookInCategory = model_default.hasFavoriteBook(category, ISBN);
      if (isBookInCategory) {
        model_default.removeFavoriteBook(category, ISBN);
      } else {
        model_default.addFavoriteBook(category, ISBN);
      }
      checkbox.checked = !isBookInCategory;
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

  // node_modules/intersection-observer/intersection-observer.js
  (function() {
    "use strict";
    if (typeof window !== "object") {
      return;
    }
    if ("IntersectionObserver" in window && "IntersectionObserverEntry" in window && "intersectionRatio" in window.IntersectionObserverEntry.prototype) {
      if (!("isIntersecting" in window.IntersectionObserverEntry.prototype)) {
        Object.defineProperty(
          window.IntersectionObserverEntry.prototype,
          "isIntersecting",
          {
            get: function() {
              return this.intersectionRatio > 0;
            }
          }
        );
      }
      return;
    }
    function getFrameElement(doc) {
      try {
        return doc.defaultView && doc.defaultView.frameElement || null;
      } catch (e) {
        return null;
      }
    }
    var document2 = function(startDoc) {
      var doc = startDoc;
      var frame = getFrameElement(doc);
      while (frame) {
        doc = frame.ownerDocument;
        frame = getFrameElement(doc);
      }
      return doc;
    }(window.document);
    var registry = [];
    var crossOriginUpdater = null;
    var crossOriginRect = null;
    function IntersectionObserverEntry(entry) {
      this.time = entry.time;
      this.target = entry.target;
      this.rootBounds = ensureDOMRect(entry.rootBounds);
      this.boundingClientRect = ensureDOMRect(entry.boundingClientRect);
      this.intersectionRect = ensureDOMRect(entry.intersectionRect || getEmptyRect());
      this.isIntersecting = !!entry.intersectionRect;
      var targetRect = this.boundingClientRect;
      var targetArea = targetRect.width * targetRect.height;
      var intersectionRect = this.intersectionRect;
      var intersectionArea = intersectionRect.width * intersectionRect.height;
      if (targetArea) {
        this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
      } else {
        this.intersectionRatio = this.isIntersecting ? 1 : 0;
      }
    }
    function IntersectionObserver2(callback, opt_options) {
      var options = opt_options || {};
      if (typeof callback != "function") {
        throw new Error("callback must be a function");
      }
      if (options.root && options.root.nodeType != 1 && options.root.nodeType != 9) {
        throw new Error("root must be a Document or Element");
      }
      this._checkForIntersections = throttle(
        this._checkForIntersections.bind(this),
        this.THROTTLE_TIMEOUT
      );
      this._callback = callback;
      this._observationTargets = [];
      this._queuedEntries = [];
      this._rootMarginValues = this._parseRootMargin(options.rootMargin);
      this.thresholds = this._initThresholds(options.threshold);
      this.root = options.root || null;
      this.rootMargin = this._rootMarginValues.map(function(margin) {
        return margin.value + margin.unit;
      }).join(" ");
      this._monitoringDocuments = [];
      this._monitoringUnsubscribes = [];
    }
    IntersectionObserver2.prototype.THROTTLE_TIMEOUT = 100;
    IntersectionObserver2.prototype.POLL_INTERVAL = null;
    IntersectionObserver2.prototype.USE_MUTATION_OBSERVER = true;
    IntersectionObserver2._setupCrossOriginUpdater = function() {
      if (!crossOriginUpdater) {
        crossOriginUpdater = function(boundingClientRect, intersectionRect) {
          if (!boundingClientRect || !intersectionRect) {
            crossOriginRect = getEmptyRect();
          } else {
            crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect);
          }
          registry.forEach(function(observer) {
            observer._checkForIntersections();
          });
        };
      }
      return crossOriginUpdater;
    };
    IntersectionObserver2._resetCrossOriginUpdater = function() {
      crossOriginUpdater = null;
      crossOriginRect = null;
    };
    IntersectionObserver2.prototype.observe = function(target) {
      var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
        return item.element == target;
      });
      if (isTargetAlreadyObserved) {
        return;
      }
      if (!(target && target.nodeType == 1)) {
        throw new Error("target must be an Element");
      }
      this._registerInstance();
      this._observationTargets.push({ element: target, entry: null });
      this._monitorIntersections(target.ownerDocument);
      this._checkForIntersections();
    };
    IntersectionObserver2.prototype.unobserve = function(target) {
      this._observationTargets = this._observationTargets.filter(function(item) {
        return item.element != target;
      });
      this._unmonitorIntersections(target.ownerDocument);
      if (this._observationTargets.length == 0) {
        this._unregisterInstance();
      }
    };
    IntersectionObserver2.prototype.disconnect = function() {
      this._observationTargets = [];
      this._unmonitorAllIntersections();
      this._unregisterInstance();
    };
    IntersectionObserver2.prototype.takeRecords = function() {
      var records = this._queuedEntries.slice();
      this._queuedEntries = [];
      return records;
    };
    IntersectionObserver2.prototype._initThresholds = function(opt_threshold) {
      var threshold = opt_threshold || [0];
      if (!Array.isArray(threshold))
        threshold = [threshold];
      return threshold.sort().filter(function(t, i, a) {
        if (typeof t != "number" || isNaN(t) || t < 0 || t > 1) {
          throw new Error("threshold must be a number between 0 and 1 inclusively");
        }
        return t !== a[i - 1];
      });
    };
    IntersectionObserver2.prototype._parseRootMargin = function(opt_rootMargin) {
      var marginString = opt_rootMargin || "0px";
      var margins = marginString.split(/\s+/).map(function(margin) {
        var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
          throw new Error("rootMargin must be specified in pixels or percent");
        }
        return { value: parseFloat(parts[1]), unit: parts[2] };
      });
      margins[1] = margins[1] || margins[0];
      margins[2] = margins[2] || margins[0];
      margins[3] = margins[3] || margins[1];
      return margins;
    };
    IntersectionObserver2.prototype._monitorIntersections = function(doc) {
      var win = doc.defaultView;
      if (!win) {
        return;
      }
      if (this._monitoringDocuments.indexOf(doc) != -1) {
        return;
      }
      var callback = this._checkForIntersections;
      var monitoringInterval = null;
      var domObserver = null;
      if (this.POLL_INTERVAL) {
        monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL);
      } else {
        addEvent(win, "resize", callback, true);
        addEvent(doc, "scroll", callback, true);
        if (this.USE_MUTATION_OBSERVER && "MutationObserver" in win) {
          domObserver = new win.MutationObserver(callback);
          domObserver.observe(doc, {
            attributes: true,
            childList: true,
            characterData: true,
            subtree: true
          });
        }
      }
      this._monitoringDocuments.push(doc);
      this._monitoringUnsubscribes.push(function() {
        var win2 = doc.defaultView;
        if (win2) {
          if (monitoringInterval) {
            win2.clearInterval(monitoringInterval);
          }
          removeEvent(win2, "resize", callback, true);
        }
        removeEvent(doc, "scroll", callback, true);
        if (domObserver) {
          domObserver.disconnect();
        }
      });
      var rootDoc = this.root && (this.root.ownerDocument || this.root) || document2;
      if (doc != rootDoc) {
        var frame = getFrameElement(doc);
        if (frame) {
          this._monitorIntersections(frame.ownerDocument);
        }
      }
    };
    IntersectionObserver2.prototype._unmonitorIntersections = function(doc) {
      var index = this._monitoringDocuments.indexOf(doc);
      if (index == -1) {
        return;
      }
      var rootDoc = this.root && (this.root.ownerDocument || this.root) || document2;
      var hasDependentTargets = this._observationTargets.some(function(item) {
        var itemDoc = item.element.ownerDocument;
        if (itemDoc == doc) {
          return true;
        }
        while (itemDoc && itemDoc != rootDoc) {
          var frame2 = getFrameElement(itemDoc);
          itemDoc = frame2 && frame2.ownerDocument;
          if (itemDoc == doc) {
            return true;
          }
        }
        return false;
      });
      if (hasDependentTargets) {
        return;
      }
      var unsubscribe = this._monitoringUnsubscribes[index];
      this._monitoringDocuments.splice(index, 1);
      this._monitoringUnsubscribes.splice(index, 1);
      unsubscribe();
      if (doc != rootDoc) {
        var frame = getFrameElement(doc);
        if (frame) {
          this._unmonitorIntersections(frame.ownerDocument);
        }
      }
    };
    IntersectionObserver2.prototype._unmonitorAllIntersections = function() {
      var unsubscribes = this._monitoringUnsubscribes.slice(0);
      this._monitoringDocuments.length = 0;
      this._monitoringUnsubscribes.length = 0;
      for (var i = 0; i < unsubscribes.length; i++) {
        unsubscribes[i]();
      }
    };
    IntersectionObserver2.prototype._checkForIntersections = function() {
      if (!this.root && crossOriginUpdater && !crossOriginRect) {
        return;
      }
      var rootIsInDom = this._rootIsInDom();
      var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();
      this._observationTargets.forEach(function(item) {
        var target = item.element;
        var targetRect = getBoundingClientRect(target);
        var rootContainsTarget = this._rootContainsTarget(target);
        var oldEntry = item.entry;
        var intersectionRect = rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect);
        var rootBounds = null;
        if (!this._rootContainsTarget(target)) {
          rootBounds = getEmptyRect();
        } else if (!crossOriginUpdater || this.root) {
          rootBounds = rootRect;
        }
        var newEntry = item.entry = new IntersectionObserverEntry({
          time: now(),
          target,
          boundingClientRect: targetRect,
          rootBounds,
          intersectionRect
        });
        if (!oldEntry) {
          this._queuedEntries.push(newEntry);
        } else if (rootIsInDom && rootContainsTarget) {
          if (this._hasCrossedThreshold(oldEntry, newEntry)) {
            this._queuedEntries.push(newEntry);
          }
        } else {
          if (oldEntry && oldEntry.isIntersecting) {
            this._queuedEntries.push(newEntry);
          }
        }
      }, this);
      if (this._queuedEntries.length) {
        this._callback(this.takeRecords(), this);
      }
    };
    IntersectionObserver2.prototype._computeTargetAndRootIntersection = function(target, targetRect, rootRect) {
      if (window.getComputedStyle(target).display == "none")
        return;
      var intersectionRect = targetRect;
      var parent = getParentNode(target);
      var atRoot = false;
      while (!atRoot && parent) {
        var parentRect = null;
        var parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {};
        if (parentComputedStyle.display == "none")
          return null;
        if (parent == this.root || parent.nodeType == /* DOCUMENT */
        9) {
          atRoot = true;
          if (parent == this.root || parent == document2) {
            if (crossOriginUpdater && !this.root) {
              if (!crossOriginRect || crossOriginRect.width == 0 && crossOriginRect.height == 0) {
                parent = null;
                parentRect = null;
                intersectionRect = null;
              } else {
                parentRect = crossOriginRect;
              }
            } else {
              parentRect = rootRect;
            }
          } else {
            var frame = getParentNode(parent);
            var frameRect = frame && getBoundingClientRect(frame);
            var frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect);
            if (frameRect && frameIntersect) {
              parent = frame;
              parentRect = convertFromParentRect(frameRect, frameIntersect);
            } else {
              parent = null;
              intersectionRect = null;
            }
          }
        } else {
          var doc = parent.ownerDocument;
          if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != "visible") {
            parentRect = getBoundingClientRect(parent);
          }
        }
        if (parentRect) {
          intersectionRect = computeRectIntersection(parentRect, intersectionRect);
        }
        if (!intersectionRect)
          break;
        parent = parent && getParentNode(parent);
      }
      return intersectionRect;
    };
    IntersectionObserver2.prototype._getRootRect = function() {
      var rootRect;
      if (this.root && !isDoc(this.root)) {
        rootRect = getBoundingClientRect(this.root);
      } else {
        var doc = isDoc(this.root) ? this.root : document2;
        var html = doc.documentElement;
        var body = doc.body;
        rootRect = {
          top: 0,
          left: 0,
          right: html.clientWidth || body.clientWidth,
          width: html.clientWidth || body.clientWidth,
          bottom: html.clientHeight || body.clientHeight,
          height: html.clientHeight || body.clientHeight
        };
      }
      return this._expandRectByRootMargin(rootRect);
    };
    IntersectionObserver2.prototype._expandRectByRootMargin = function(rect) {
      var margins = this._rootMarginValues.map(function(margin, i) {
        return margin.unit == "px" ? margin.value : margin.value * (i % 2 ? rect.width : rect.height) / 100;
      });
      var newRect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3]
      };
      newRect.width = newRect.right - newRect.left;
      newRect.height = newRect.bottom - newRect.top;
      return newRect;
    };
    IntersectionObserver2.prototype._hasCrossedThreshold = function(oldEntry, newEntry) {
      var oldRatio = oldEntry && oldEntry.isIntersecting ? oldEntry.intersectionRatio || 0 : -1;
      var newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1;
      if (oldRatio === newRatio)
        return;
      for (var i = 0; i < this.thresholds.length; i++) {
        var threshold = this.thresholds[i];
        if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
          return true;
        }
      }
    };
    IntersectionObserver2.prototype._rootIsInDom = function() {
      return !this.root || containsDeep(document2, this.root);
    };
    IntersectionObserver2.prototype._rootContainsTarget = function(target) {
      var rootDoc = this.root && (this.root.ownerDocument || this.root) || document2;
      return containsDeep(rootDoc, target) && (!this.root || rootDoc == target.ownerDocument);
    };
    IntersectionObserver2.prototype._registerInstance = function() {
      if (registry.indexOf(this) < 0) {
        registry.push(this);
      }
    };
    IntersectionObserver2.prototype._unregisterInstance = function() {
      var index = registry.indexOf(this);
      if (index != -1)
        registry.splice(index, 1);
    };
    function now() {
      return window.performance && performance.now && performance.now();
    }
    function throttle(fn, timeout) {
      var timer = null;
      return function() {
        if (!timer) {
          timer = setTimeout(function() {
            fn();
            timer = null;
          }, timeout);
        }
      };
    }
    function addEvent(node, event, fn, opt_useCapture) {
      if (typeof node.addEventListener == "function") {
        node.addEventListener(event, fn, opt_useCapture || false);
      } else if (typeof node.attachEvent == "function") {
        node.attachEvent("on" + event, fn);
      }
    }
    function removeEvent(node, event, fn, opt_useCapture) {
      if (typeof node.removeEventListener == "function") {
        node.removeEventListener(event, fn, opt_useCapture || false);
      } else if (typeof node.detachEvent == "function") {
        node.detachEvent("on" + event, fn);
      }
    }
    function computeRectIntersection(rect1, rect2) {
      var top = Math.max(rect1.top, rect2.top);
      var bottom = Math.min(rect1.bottom, rect2.bottom);
      var left = Math.max(rect1.left, rect2.left);
      var right = Math.min(rect1.right, rect2.right);
      var width = right - left;
      var height = bottom - top;
      return width >= 0 && height >= 0 && {
        top,
        bottom,
        left,
        right,
        width,
        height
      } || null;
    }
    function getBoundingClientRect(el) {
      var rect;
      try {
        rect = el.getBoundingClientRect();
      } catch (err) {
      }
      if (!rect)
        return getEmptyRect();
      if (!(rect.width && rect.height)) {
        rect = {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };
      }
      return rect;
    }
    function getEmptyRect() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    function ensureDOMRect(rect) {
      if (!rect || "x" in rect) {
        return rect;
      }
      return {
        top: rect.top,
        y: rect.top,
        bottom: rect.bottom,
        left: rect.left,
        x: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height
      };
    }
    function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
      var top = parentIntersectionRect.top - parentBoundingRect.top;
      var left = parentIntersectionRect.left - parentBoundingRect.left;
      return {
        top,
        left,
        height: parentIntersectionRect.height,
        width: parentIntersectionRect.width,
        bottom: top + parentIntersectionRect.height,
        right: left + parentIntersectionRect.width
      };
    }
    function containsDeep(parent, child) {
      var node = child;
      while (node) {
        if (node == parent)
          return true;
        node = getParentNode(node);
      }
      return false;
    }
    function getParentNode(node) {
      var parent = node.parentNode;
      if (node.nodeType == /* DOCUMENT */
      9 && node != document2) {
        return getFrameElement(node);
      }
      if (parent && parent.assignedSlot) {
        parent = parent.assignedSlot.parentNode;
      }
      if (parent && parent.nodeType == 11 && parent.host) {
        return parent.host;
      }
      return parent;
    }
    function isDoc(node) {
      return node && node.nodeType === 9;
    }
    window.IntersectionObserver = IntersectionObserver2;
    window.IntersectionObserverEntry = IntersectionObserverEntry;
  })();

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
      const _hasBook = hasBook === "Y" ? "\uC18C\uC7A5" : "\uBBF8\uC18C\uC7A5";
      let _loanAvailable = "";
      if (hasBook === "Y") {
        _loanAvailable = loanAvailable === "Y" ? "| \uB300\uCD9C\uAC00\uB2A5" : "| \uB300\uCD9C\uBD88\uAC00";
      }
      const el = this.querySelectorAll(".library-item")[index];
      const elName = el.querySelector(".name");
      if (elName) {
        elName.textContent = `\u2219 ${libName} : `;
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

  // dev/scripts/components/NavGnb.js
  var NavGnb = class extends HTMLElement {
    constructor() {
      super();
      this.PATHS = [
        "/search",
        "/favorite",
        "/popular",
        "/library",
        "/setting"
      ];
      this.renderBookSize = this.renderBookSize.bind(this);
    }
    connectedCallback() {
      this.render();
      this.setSelectedMenu();
      model_default.subscribeBookUpdate(this.renderBookSize);
    }
    disconnectedCallback() {
      model_default.unsubscribeBookUpdate(this.renderBookSize);
    }
    get bookSize() {
      return Object.values(model_default.getFavorites()).reduce((sum, currentArray) => sum + currentArray.length, 0);
    }
    render() {
      const paths = this.PATHS;
      this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${paths[0]}">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href=".${paths[1]}">\uB098\uC758 \uCC45 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${paths[2]}">\uC778\uAE30\uB300\uCD9C\uB3C4\uC11C</a>
                <a class="gnb-item" href=".${paths[3]}">\uB3C4\uC11C\uAD00 \uC870\uD68C</a>
                <a class="gnb-item" href=".${paths[4]}">\uC124\uC815</a>
            </nav>`;
    }
    setSelectedMenu() {
      const idx = this.PATHS.indexOf(document.location.pathname);
      if (idx >= 0)
        this.querySelectorAll("a")[idx].ariaSelected = "true";
    }
    renderBookSize() {
      const sizeEl = this.querySelector(".size");
      sizeEl.textContent = this.bookSize.toString();
    }
  };

  // dev/scripts/components/LoadingComponent.js
  var LoadingComponent = class extends HTMLElement {
    constructor() {
      super();
    }
    show() {
      this.removeAttribute("hidden");
    }
    hide() {
      this.setAttribute("hidden", "");
    }
  };
  customElements.define("loading-component", LoadingComponent);

  // dev/scripts/pages/search/selectors.js
  var bookList = document.querySelector("book-list");
  var searchInputElement = document.querySelector("input-search input[type='search']");

  // dev/scripts/pages/search/AppSearch.js
  var AppSearch = class extends HTMLElement {
    constructor() {
      super();
      this.boundPopStateHandler = null;
    }
    connectedCallback() {
      this.renderBookList();
      this.boundPopStateHandler = this.onPopState.bind(this);
      window.addEventListener("popstate", this.boundPopStateHandler);
    }
    disconnectedCallback() {
      if (this.boundPopStateHandler) {
        window.removeEventListener("popstate", this.boundPopStateHandler);
      }
    }
    onPopState() {
      this.renderBookList();
    }
    renderBookList() {
      const params = new URLSearchParams(location.search);
      const keyword = params.get("keyword");
      const sort = params.get("sort") || "sim";
      if (keyword && sort) {
        bookList === null || bookList === void 0 ? void 0 : bookList.initializeSearchPage(keyword, sort);
        searchInputElement.value = keyword;
      }
    }
  };

  // dev/scripts/pages/search/InputSearch.js
  var InputSearch = class extends HTMLElement {
    constructor() {
      super();
      this.form = null;
      this.input = null;
      this.handleRadioChange = () => {
        var _a;
        const submitEvent = new Event("submit");
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.dispatchEvent(submitEvent);
      };
      this.onSubmit = (event) => {
        var _a;
        event.preventDefault();
        if (!this.input)
          return;
        const keyword = this.input.value;
        const sort = (_a = this.form) === null || _a === void 0 ? void 0 : _a.sort.value;
        this.input.focus();
        if (keyword && sort) {
          const url = new URL(window.location.href);
          url.searchParams.set("keyword", keyword);
          url.searchParams.set("sort", sort);
          window.history.pushState({}, "", url.toString());
          bookList === null || bookList === void 0 ? void 0 : bookList.initializeSearchPage(keyword, sort);
        }
      };
      this.initialize();
    }
    connectedCallback() {
      var _a, _b;
      (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", this.onSubmit);
      const radios = (_b = this.form) === null || _b === void 0 ? void 0 : _b.sort;
      radios.forEach((radio) => {
        radio.addEventListener("change", this.handleRadioChange);
      });
    }
    disconnectedCallback() {
      var _a;
      (_a = this.form) === null || _a === void 0 ? void 0 : _a.removeEventListener("submit", this.onSubmit);
    }
    initialize() {
      this.form = this.querySelector("form");
      this.input = this.querySelector("input[type='search']");
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
      this.loadingComponent = this.querySelector("loading-component");
      this.retrieveBooks = this.retrieveBooks.bind(this);
      this.initializeSearchPage = this.initializeSearchPage.bind(this);
    }
    connectedCallback() {
      this.paginationElement = this.querySelector(".paging-info");
      this.bookContainer = this.querySelector(".books");
      this.setupObserver();
    }
    disconnectedCallback() {
      var _a;
      (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
    initializeSearchPage(keyword, sort) {
      this.keyword = keyword;
      this.sortingOrder = sort;
      this.itemCount = 0;
      this.keyword ? this.renderBooks() : this.showDefaultMessage();
    }
    // initializeSearchPage(
    //     event: ICustomEvent<{
    //         keyword: string;
    //         sort: string;
    //     }>
    // ) {
    //     const { keyword, sort } = event.detail;
    //     this.keyword = keyword;
    //     this.sortingOrder = sort;
    //     this.itemCount = 0;
    //     // renderBooks: onSubmit으로 들어온 경우와 브라우저
    //     // showDefaultMessage: keyword 없을 때 기본 화면 노출, 브라우저
    //     this.keyword ? this.renderBooks() : this.showDefaultMessage();
    // }
    setupObserver() {
      const target = this.querySelector(".observe");
      this.observer = new Observer(target, this.retrieveBooks);
    }
    renderBooks() {
      this.bookContainer.innerHTML = "";
      this.retrieveBooks();
    }
    showDefaultMessage() {
      this.paginationElement.hidden = true;
      this.renderMessage("message");
    }
    retrieveBooks() {
      var _a, _b;
      return __awaiter3(this, void 0, void 0, function* () {
        if (!this.keyword || !this.sortingOrder)
          return;
        (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.show();
        const encodedKeyword = encodeURIComponent(this.keyword);
        const searchUrl = `/search-naver-book?keyword=${encodedKeyword}&display=${10}&start=${this.itemCount + 1}&sort=${this.sortingOrder}`;
        try {
          const data = yield CustomFetch_default.fetch(searchUrl);
          this.renderBookList(data);
        } catch (error) {
          if (error instanceof Error) {
            console.error(`Error fetching books: ${error.message}`);
          } else {
            console.error("An unexpected error occurred");
          }
        }
        (_b = this.loadingComponent) === null || _b === void 0 ? void 0 : _b.hide();
      });
    }
    renderBookList(data) {
      var _a;
      const { total, display, items } = data;
      if (total === 0) {
        this.renderMessage("notFound");
        return;
      }
      this.itemCount += display;
      this.refreshPagingData(total, display);
      this.appendBookItems(items);
      this.paginationElement.hidden = false;
      if (total !== this.itemCount)
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observe();
    }
    refreshPagingData(total, display) {
      const obj = {
        keyword: `${this.keyword}`,
        length: `${this.itemCount.toLocaleString()}`,
        total: `${total.toLocaleString()}`,
        display: `${display}\uAC1C\uC529`
      };
      for (const [key, value] of Object.entries(obj)) {
        const element = this.paginationElement.querySelector(`.__${key}`);
        element.textContent = value;
      }
    }
    appendBookItems(items) {
      const fragment = new DocumentFragment();
      const template = document.querySelector("#tp-book-item");
      items.forEach((item, index) => {
        const clonedNode = template.content.cloneNode(true);
        const bookItem = clonedNode.querySelector("book-item");
        bookItem.bookData = item;
        bookItem.dataset.index = (this.itemCount + index).toString();
        fragment.appendChild(clonedNode);
      });
      this.bookContainer.appendChild(fragment);
    }
    renderMessage(type) {
      const messageTemplate = document.querySelector(`#tp-${type}`);
      if (!messageTemplate)
        return;
      this.bookContainer.innerHTML = "";
      this.bookContainer.appendChild(messageTemplate.content.cloneNode(true));
    }
  };

  // dev/scripts/pages/search/BookItem.js
  var __rest = function(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  };
  var BookItem = class extends HTMLElement {
    constructor() {
      super();
      this.bookLibraryButton = null;
      this.onLibraryButtonClick = () => {
        const isbn = this.dataset.isbn || "";
        const libraryBookNode = this.querySelector("library-book-exist");
        libraryBookNode === null || libraryBookNode === void 0 ? void 0 : libraryBookNode.onLibraryBookExist(this.bookLibraryButton, isbn, model_default.getLibraries());
      };
    }
    connectedCallback() {
      var _a;
      this.bookLibraryButton = this.querySelector(".library-button");
      (_a = this.bookLibraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibraryButtonClick);
      this.populateBookData();
    }
    disconnectedCallback() {
      var _a;
      this.bookLibraryButton = this.querySelector(".library-button");
      (_a = this.bookLibraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibraryButtonClick);
    }
    populateBookData() {
      if (!this.bookData) {
        console.error("Book data is not provided");
        return;
      }
      this.updateBookElements(this.bookData);
    }
    updateBookElements(bookData) {
      const { image, isbn, link, pubdate } = bookData, otherData = __rest(bookData, ["image", "isbn", "link", "pubdate"]);
      const title = bookData.title;
      const imageNode = this.querySelector("book-image");
      if (imageNode) {
        imageNode.dataset.object = JSON.stringify({
          bookImageURL: image,
          bookname: title
        });
      }
      const linkNode = this.querySelector(".link");
      if (linkNode)
        linkNode.href = link;
      const date = `${pubdate.substring(0, 4)}.${pubdate.substring(4, 6)}.${pubdate.substring(6)}`;
      const pubdateNode = this.querySelector(".pubdate");
      if (pubdateNode)
        pubdateNode.textContent = date;
      Object.entries(otherData).forEach(([key, value]) => {
        if (key === "description") {
          const descNode = this.querySelector("book-description");
          if (descNode)
            descNode.data = value;
        } else {
          const element = this.querySelector(`.${key}`);
          if (element)
            element.textContent = value;
        }
      });
      const anchorEl = this.querySelector("a");
      if (anchorEl)
        anchorEl.href = `/book?isbn=${isbn}`;
      this.dataset.isbn = isbn;
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
  customElements.define("category-selector", CategorySelector);
  customElements.define("book-image", BookImage);
})();
//# sourceMappingURL=index.js.map
