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
    constructor(url, name) {
      super();
      this.image = null;
      this.render(url, name);
    }
    // connectedCallback() {}
    render(url, name) {
      const imagge = document.createElement("img");
      imagge.className = "thumb";
      imagge.src = url;
      imagge.alt = name;
      imagge.onerror = this.onError.bind(this);
      this.image = imagge;
      this.appendChild(imagge);
    }
    onError() {
      var _a;
      this.dataset.fail = "true";
      console.error(`Failed to load image`);
      (_a = this.image) === null || _a === void 0 ? void 0 : _a.remove();
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
      this.publisher = new Publisher();
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
      this.publisher.notify({
        type: "add",
        payload: {
          code,
          name
        }
      });
    }
    remove(code) {
      delete this._libraries[code];
      this.publisher.notify({
        type: "delete",
        payload: {
          code
        }
      });
    }
    has(code) {
      return code in this._libraries;
    }
    subscribeUpdate(subscriber) {
      this.publisher.subscribe(subscriber);
    }
    unsubscribeUpdate(subscriber) {
      this.publisher.subscribe(subscriber);
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
    get state() {
      return this.loadStorage();
    }
    set state(newState) {
      this.setStorage(newState);
      const { favorites, sortedFavoriteKeys, libraries, regions } = newState;
      this.favoriteModel.favorites = favorites;
      this.favoriteModel.sortedKeys = sortedFavoriteKeys;
      this.libraryModel.libraries = libraries;
      this.regionModel.regions = regions;
      this.bookStateUpdatePublisher.notify();
    }
    get favorites() {
      return this.favoriteModel.favorites;
    }
    get sortedFavoriteKeys() {
      return this.favoriteModel.sortedKeys;
    }
    get libraries() {
      return this.libraryModel.libraries;
    }
    get regions() {
      return this.regionModel.regions;
    }
    resetState() {
      this.state = initialState;
    }
    // favorites 관련 메서드
    setFavorites() {
      const newState = this.state;
      newState.favorites = this.favorites;
      newState.sortedFavoriteKeys = this.sortedFavoriteKeys;
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
    setLibraries() {
      const newState = this.state;
      newState.libraries = this.libraries;
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
    setRegions() {
      const newState = this.state;
      newState.regions = this.regions;
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
    subscribeLibraryUpdate(subscriber) {
      this.libraryModel.subscribeUpdate(subscriber);
    }
    unsubscribeLibraryUpdate(subscriber) {
      this.libraryModel.unsubscribeUpdate(subscriber);
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
      this.button = this.createButton();
      this.appendChild(this.createContainer());
      this.appendChild(this.button);
      (_a = this.button) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onClickCategory);
    }
    createButton() {
      const button = document.createElement("button");
      button.className = "category-button";
      button.textContent = "Category";
      return button;
    }
    createContainer() {
      const container = document.createElement("div");
      container.className = "category";
      container.hidden = true;
      model_default.sortedFavoriteKeys.forEach((category) => this.createCategoryItem(container, category, this.isbn || ""));
      return container;
    }
    onClickCategory() {
      const el = this.querySelector(".category");
      el.hidden = !el.hidden;
    }
    getISBN() {
      const isbnElement = this.closest("[data-isbn]");
      return isbnElement && isbnElement.dataset.isbn ? isbnElement.dataset.isbn : null;
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
      return Object.values(model_default.favorites).reduce((sum, currentArray) => sum + currentArray.length, 0);
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

  // dev/scripts/utils/helpers.js
  function cloneTemplate(template) {
    const content = template.content.firstElementChild;
    if (!content) {
      throw new Error("Template content is empty");
    }
    return content.cloneNode(true);
  }
  function fillElementsWithData(data, container) {
    Object.entries(data).forEach(([key, value]) => {
      const element = container.querySelector(`.${key}`);
      element.textContent = String(value);
    });
  }

  // dev/scripts/pages/favorite/FavoriteItemUI.js
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
  var FavoriteItemUI = class {
    constructor(component) {
      this.component = component;
    }
    render(_a) {
      var { bookImageURL, bookname, description, isbn13 } = _a, otherData = __rest(_a, ["bookImageURL", "bookname", "description", "isbn13"]);
      const linkElement = this.component.querySelector(".book-summary a");
      linkElement.appendChild(new BookImage(bookImageURL, bookname));
      const descNode = this.component.querySelector("book-description");
      descNode.data = description;
      const anchorEl = this.component.querySelector("a");
      anchorEl.href = `/book?isbn=${isbn13}`;
      const others = Object.assign(Object.assign({}, otherData), {
        bookname,
        isbn13
      });
      fillElementsWithData(others, this.component);
      if (this.component.libraryButton && Object.keys(model_default.libraries).length === 0) {
        this.component.libraryButton.hidden = true;
      }
    }
    renderError() {
      this.component.dataset.fail = "true";
      this.component.querySelector(".bookname").textContent = `ISBN : ${this.component.isbn}`;
      this.component.querySelector(".authors").textContent = "\uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.";
    }
    updateOnLibrary() {
      if (this.component.libraryButton)
        this.component.libraryButton.hidden = true;
      if (this.component.hideButton) {
        this.component.hideButton.hidden = false;
      }
    }
    updateOnHideLibrary() {
      if (this.component.libraryButton) {
        this.component.libraryButton.disabled = false;
        this.component.libraryButton.hidden = false;
      }
      if (this.component.hideButton) {
        this.component.hideButton.hidden = true;
      }
    }
  };

  // dev/scripts/pages/favorite/FavoriteItem.js
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
  var FavoriteItem = class extends HTMLElement {
    constructor(isbn) {
      super();
      this.loadingComponent = null;
      this._isbn = null;
      this.libraryButton = null;
      this._isbn = isbn;
      this.ui = new FavoriteItemUI(this);
    }
    connectedCallback() {
      this.loadingComponent = this.querySelector("loading-component");
      this.libraryButton = this.querySelector(".library-button");
      this.hideButton = this.querySelector(".hide-button");
      this.libraryBookExist = this.querySelector("library-book-exist");
      this.addEvents();
      this.fetchData();
    }
    disconnectedCallback() {
      this.removeEvents();
    }
    get isbn() {
      return this._isbn;
    }
    addEvents() {
      var _a, _b;
      (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.onLibrary.bind(this));
      (_b = this.hideButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.onHideLibrary.bind(this));
    }
    removeEvents() {
      var _a, _b;
      (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onLibrary);
      (_b = this.hideButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.onHideLibrary);
    }
    fetchData() {
      var _a;
      return __awaiter3(this, void 0, void 0, function* () {
        const url = `/usage-analysis-list?isbn13=${this._isbn}`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          this.renderUI(data.book);
        } catch (error) {
          this.ui.renderError();
          console.error(error);
          throw new Error(`Fail to get usage analysis list.`);
        }
        (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.hide();
      });
    }
    renderUI(book) {
      delete book.vol;
      this.ui.render(book);
    }
    onLibrary() {
      if (this.libraryBookExist && this.libraryButton) {
        this.libraryBookExist.onLibraryBookExist(this.libraryButton, this._isbn, model_default.libraries);
        this.ui.updateOnLibrary();
      }
    }
    onHideLibrary() {
      var _a;
      const list = (_a = this.libraryBookExist) === null || _a === void 0 ? void 0 : _a.querySelector("ul");
      list.innerHTML = "";
      this.ui.updateOnHideLibrary();
    }
  };

  // dev/scripts/pages/favorite/Favorite.js
  var Favorite = class extends HTMLElement {
    constructor() {
      super();
      this.currentCategory = new URLSearchParams(location.search).get("category");
      this.listElement = this.querySelector(".favorite-books");
      this.itemTemplate = document.querySelector("#tp-favorite-item");
      this.messageTemplate = document.querySelector("#tp-message");
    }
    connectedCallback() {
      const isbnsOfCategory = this.getIsbnsOfCategory();
      if (isbnsOfCategory)
        this.render(isbnsOfCategory);
    }
    disconnectedCallback() {
    }
    getIsbnsOfCategory() {
      const categoryKeys = model_default.sortedFavoriteKeys;
      if (categoryKeys.length === 0) {
        this.renderMessage("\uAD00\uC2EC \uCE74\uD14C\uACE0\uB9AC\uB97C \uB4F1\uB85D\uD574\uC8FC\uC138\uC694.");
        return;
      }
      const isbnsOfCategory = model_default.favorites[this.currentCategory || categoryKeys[0]];
      if (isbnsOfCategory.length === 0) {
        this.renderMessage("\uB4F1\uB85D\uB41C \uAD00\uC2EC\uCC45\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.");
        return;
      }
      return isbnsOfCategory;
    }
    render(isbnsOfCategory) {
      if (!this.listElement)
        return;
      const fragment = new DocumentFragment();
      isbnsOfCategory.map((isbn) => this.createItem(isbn)).forEach((element) => fragment.appendChild(element));
      this.listElement.innerHTML = "";
      this.listElement.appendChild(fragment);
    }
    createItem(isbn) {
      const favoriteItem = new FavoriteItem(isbn);
      favoriteItem.appendChild(this.itemTemplate.content.cloneNode(true));
      favoriteItem.dataset.isbn = isbn;
      return favoriteItem;
    }
    renderMessage(message) {
      if (!this.messageTemplate || !this.listElement)
        return;
      const messageElement = cloneTemplate(this.messageTemplate);
      messageElement.textContent = message;
      this.listElement.appendChild(messageElement);
    }
  };

  // dev/scripts/pages/favorite/FavoriteNav.js
  var FavoriteNav = class extends HTMLElement {
    constructor() {
      super();
      this.nav = this.querySelector(".favorite-category");
      this.overlayCategory = document.querySelector("overlay-category");
      this.changButton = this.querySelector(".favorite-changeButton");
      this.category = null;
      this.handleOverlayCatalog = this.handleOverlayCatalog.bind(this);
      this.subscribeCategoryChange = this.subscribeCategoryChange.bind(this);
    }
    connectedCallback() {
      this.intialize();
      this.render();
      this.changButton.addEventListener("click", this.handleOverlayCatalog);
      model_default.subscribeToFavoritesUpdate(this.subscribeCategoryChange);
    }
    disconnectedCallback() {
      this.changButton.removeEventListener("click", this.handleOverlayCatalog);
      model_default.unsubscribeToFavoritesUpdate(this.subscribeCategoryChange);
    }
    intialize() {
      this.category = new URLSearchParams(location.search).get("category") || model_default.sortedFavoriteKeys[0];
    }
    render() {
      const fragment = new DocumentFragment();
      model_default.sortedFavoriteKeys.map((category) => this.createItem(category)).forEach((element) => fragment.appendChild(element));
      this.nav.innerHTML = "";
      this.nav.appendChild(fragment);
      this.hidden = false;
    }
    createItem(category) {
      const element = document.createElement("a");
      element.ariaSelected = (category === this.category).toString();
      this.updateItem(element, category);
      return element;
    }
    updateItem(element, name) {
      element.textContent = name;
      element.href = `?${this.getUrl(name)}`;
    }
    handleOverlayCatalog() {
      this.overlayCategory.hidden = Boolean(!this.overlayCategory.hidden);
    }
    getUrl(category) {
      return `category=${encodeURIComponent(category)}`;
    }
    subscribeCategoryChange({ type, payload }) {
      const actions = {
        add: () => this.handlAdd(payload.name),
        rename: () => this.handlRename(payload.prevName, payload.newName),
        delete: () => this.handlDelete(payload.name),
        change: () => this.handlChange(payload.targetIndex, payload.draggedIndex)
      };
      if (actions[type]) {
        actions[type]();
      } else {
        console.error("No subscribe type");
      }
    }
    handlAdd(name) {
      this.nav.appendChild(this.createItem(name));
    }
    handlRename(prevName, newName) {
      this.updateItem(this.nav.querySelectorAll("a")[model_default.sortedFavoriteKeys.indexOf(prevName)], newName);
      model_default.renameSortedFavoriteKey(prevName, newName);
      if (this.category === prevName) {
        location.search = this.getUrl(newName);
      }
    }
    handlDelete(name) {
      const deletedIndex = model_default.deleteSortedFavoriteKey(name);
      this.nav.querySelectorAll("a")[deletedIndex].remove();
    }
    handlChange(targetIndex, draggedIndex) {
      const navs = this.nav.querySelectorAll("a");
      const dragged = navs[draggedIndex];
      const targeted = navs[targetIndex];
      dragged.replaceWith(targeted.cloneNode(true));
      targeted.replaceWith(dragged.cloneNode(true));
    }
  };

  // dev/scripts/pages/favorite/OverlayCategory.js
  var OverlayCategory = class extends HTMLElement {
    constructor() {
      super();
      this.draggedItem = null;
      this.handleClickAdd = () => {
        var _a;
        if (!this.addInput)
          return;
        const favorite = this.addInput.value;
        if (!favorite)
          return;
        if (model_default.hasFavorite(favorite)) {
          alert("\uC911\uBCF5\uB41C \uC774\uB984\uC785\uB2C8\uB2E4.");
          this.addInput.value = "";
          return;
        }
        model_default.addfavorite(favorite);
        const index = model_default.sortedFavoriteKeys.length;
        const cloned = this.createItem(favorite, index);
        (_a = this.list) === null || _a === void 0 ? void 0 : _a.appendChild(cloned);
        this.addInput.value = "";
      };
      this.handleSubmit = (event) => {
        event.preventDefault();
        this.handleClickAdd();
      };
      this.handleClose = () => {
        this.hidden = true;
      };
      this.form = this.querySelector("form");
      this.list = this.querySelector(".category-list");
      this.template = document.querySelector("#tp-category-item");
      this.renameButton = this.querySelector(".rename");
      this.addButton = this.querySelector(".addButton");
      this.addInput = this.querySelector("input[name='add']");
      this.closeButton = this.querySelector(".closeButton");
      this.draggedItem = null;
      this.handleRename = this.handleRename.bind(this);
    }
    static get observedAttributes() {
      return ["hidden"];
    }
    connectedCallback() {
      var _a, _b, _c;
      this.render();
      (_a = this.addButton) === null || _a === void 0 ? void 0 : _a.addEventListener("click", this.handleClickAdd);
      (_b = this.form) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", this.handleSubmit);
      (_c = this.closeButton) === null || _c === void 0 ? void 0 : _c.addEventListener("click", this.handleClose);
    }
    disconnectedCallback() {
      var _a, _b, _c;
      (_a = this.addButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.handleClickAdd);
      (_b = this.form) === null || _b === void 0 ? void 0 : _b.removeEventListener("submit", this.handleSubmit);
      (_c = this.closeButton) === null || _c === void 0 ? void 0 : _c.removeEventListener("click", this.handleClose);
    }
    attributeChangedCallback(name) {
      if (name === "hidden" && !this.hasAttribute("hidden")) {
        this.initial();
      }
    }
    initial() {
      if (this.list) {
        this.list.innerHTML = "";
        this.render();
      }
    }
    render() {
      if (!this.list)
        return;
      const fragment = new DocumentFragment();
      model_default.sortedFavoriteKeys.forEach((favorite, index) => {
        const cloned = this.createItem(favorite, index);
        fragment.appendChild(cloned);
      });
      this.list.appendChild(fragment);
    }
    createItem(favorite, index) {
      if (this.template === null) {
        throw new Error("Template is null");
      }
      const cloned = cloneTemplate(this.template);
      cloned.dataset.index = index.toString();
      cloned.dataset.favorite = favorite;
      const input = cloned.querySelector("input[name='category']");
      if (input) {
        input.value = favorite;
      }
      this.handleItemEvent(cloned, input, favorite);
      this.changeItem(cloned);
      return cloned;
    }
    handleItemEvent(cloned, input, favorite) {
      var _a, _b;
      (_a = cloned.querySelector(".renameButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        const favorite2 = cloned.dataset.favorite;
        this.handleRename(input, favorite2, cloned);
      });
      (_b = cloned.querySelector(".deleteButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.handleDelete(cloned, favorite));
      cloned.addEventListener("keydown", (event) => {
        const input2 = event.target;
        if (event.key === "Enter" && input2.name === "category") {
          this.handleRename(input2, favorite);
        }
      });
    }
    handleRename(input, favorite, cloned) {
      const value = input.value;
      if (!value || favorite === value || !cloned)
        return;
      cloned.dataset.favorite = value;
      model_default.renameFavorite(favorite, value);
    }
    handleDelete(cloned, favorite) {
      cloned.remove();
      model_default.deleteFavorite(favorite);
    }
    changeItem(cloned) {
      const dragggerButton = cloned.querySelector(".dragger");
      dragggerButton.addEventListener("mousedown", () => {
        cloned.draggable = true;
      });
      dragggerButton.addEventListener("mouseup", () => {
        cloned.removeAttribute("draggable");
      });
      cloned.addEventListener("dragstart", () => {
        this.draggedItem = cloned;
        cloned.draggable = true;
      });
      cloned.addEventListener("dragend", () => {
        if (this.draggedItem === cloned) {
          this.draggedItem = null;
          cloned.removeAttribute("draggable");
        }
      });
      cloned.addEventListener("dragover", (event) => {
        event.preventDefault();
      });
      cloned.addEventListener("dragenter", () => {
        if (this.draggedItem === cloned)
          return;
        cloned.dataset.drag = "dragenter";
      });
      cloned.addEventListener("drop", () => {
        if (!this.draggedItem || !this.list)
          return;
        this.list.insertBefore(this.draggedItem, cloned);
        const draggedKey = this.draggedItem.dataset.favorite;
        const targetKey = cloned.dataset.favorite;
        if (draggedKey && targetKey) {
          model_default.changeFavorite(draggedKey, targetKey);
        }
        delete cloned.dataset.drag;
      });
    }
  };

  // dev/scripts/pages/favorite/index.js
  customElements.define("book-image", BookImage);
  customElements.define("nav-gnb", NavGnb);
  customElements.define("favorite-item", FavoriteItem);
  customElements.define("app-favorite", Favorite);
  customElements.define("favorite-nav", FavoriteNav);
  customElements.define("book-description", BookDescription);
  customElements.define("library-book-exist", LibraryBookExist);
  customElements.define("category-selector", CategorySelector);
  customElements.define("overlay-category", OverlayCategory);
})();
//# sourceMappingURL=index.js.map
