"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // app/src/scripts/model/constants.ts
  var STORAGE_NAME = "BookWorld";

  // app/src/scripts/utils/Publisher.ts
  var Publisher = class {
    constructor() {
      this.subscribers = [];
    }
    subscribe(callback) {
      this.subscribers.push(callback);
    }
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(
        (subscriber) => subscriber !== callback
      );
    }
    notify(payload) {
      this.subscribers.forEach((callback) => callback(payload));
    }
  };

  // app/src/scripts/model/FavoriteModel.ts
  var FavoriteModel = class {
    constructor(categories, sortedKeys) {
      this.categoriesUpdatePublisher = new Publisher();
      this.bookUpdatePublisher = new Publisher();
      this._favorites = categories || {};
      this._sortedKeys = sortedKeys || [];
    }
    get favorites() {
      return __spreadValues({}, this._favorites);
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
    subscribeCategoriesUpdate(subscriber) {
      this.categoriesUpdatePublisher.subscribe(
        subscriber
      );
    }
    unsubscribeCategoriesUpdate(subscriber) {
      this.categoriesUpdatePublisher.unsubscribe(
        subscriber
      );
    }
    subscribeBookUpdate(subscriber) {
      this.bookUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
      this.bookUpdatePublisher.unsubscribe(subscriber);
    }
  };

  // app/src/scripts/model/LibraryModel.ts
  var LibraryModel = class {
    constructor(libraries) {
      this.publisher = new Publisher();
      this._libraries = libraries;
    }
    get libraries() {
      return __spreadValues({}, this._libraries);
    }
    set libraries(newLibries) {
      this._libraries = newLibries;
    }
    add(code, data) {
      this._libraries[code] = data;
      this.publisher.notify({
        type: "add",
        payload: {
          code,
          // name,
          data
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
      this.publisher.subscribe(
        subscriber
      );
    }
    unsubscribeUpdate(subscriber) {
      this.publisher.subscribe(
        subscriber
      );
    }
  };

  // app/src/scripts/model/RegionModel.ts
  var RegionModel = class {
    constructor(regions) {
      this.updatePublisher = new Publisher();
      this.detailUpdatePublisher = new Publisher();
      this._regions = regions;
    }
    get regions() {
      return __spreadValues({}, this._regions);
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
    subscribeUpdatePublisher(subscriber) {
      this.updatePublisher.subscribe(subscriber);
    }
    unsubscribeUpdatePublisher(subscriber) {
      this.updatePublisher.unsubscribe(subscriber);
    }
    subscribeDetailUpdatePublisher(subscriber) {
      this.detailUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeDetailUpdatePublisher(subscriber) {
      this.detailUpdatePublisher.unsubscribe(subscriber);
    }
  };

  // app/src/scripts/model/index.ts
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
      console.log("set state");
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
    addLibraries(code, data) {
      this.libraryModel.add(code, data);
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
    subscribeFavoriteCategoriesUpdate(subscriber) {
      this.favoriteModel.subscribeCategoriesUpdate(subscriber);
    }
    unsubscribeFavoriteCategoriesUpdate(subscriber) {
      this.favoriteModel.unsubscribeCategoriesUpdate(subscriber);
    }
    subscribeFavoriteBookUpdate(subscriber) {
      this.favoriteModel.subscribeBookUpdate(subscriber);
    }
    unsubscribeFavoriteBookUpdate(subscriber) {
      this.favoriteModel.unsubscribeBookUpdate(subscriber);
    }
    subscribeLibraryUpdate(subscriber) {
      this.libraryModel.subscribeUpdate(subscriber);
    }
    unsubscribeLibraryUpdate(subscriber) {
      this.libraryModel.unsubscribeUpdate(subscriber);
    }
    subscribeRegionUpdate(subscriber) {
      this.regionModel.subscribeUpdatePublisher(subscriber);
    }
    unsubscribeRegionUpdate(subscriber) {
      this.regionModel.unsubscribeUpdatePublisher(subscriber);
    }
    subscribeDetailRegionUpdate(subscriber) {
      this.regionModel.subscribeDetailUpdatePublisher(subscriber);
    }
    unsubscribeDetailRegionUpdate(subscriber) {
      this.regionModel.unsubscribeDetailUpdatePublisher(subscriber);
    }
  };
  var bookModel = new BookModel();
  var model_default = bookModel;

  // app/src/scripts/utils/CustomEventEmitter.ts
  var CustomEventEmitter = class {
    constructor() {
      this._bus = document.createElement("div");
    }
    add(event, callback) {
      this._bus.addEventListener(
        event,
        callback
      );
    }
    remove(event, callback) {
      this._bus.removeEventListener(
        event,
        callback
      );
    }
    dispatch(event, detail = {}) {
      this._bus.dispatchEvent(new CustomEvent(event, { detail }));
    }
  };
  var CustomEventEmitter_default = new CustomEventEmitter();

  // app/src/scripts/utils/CustomFetch.ts
  var CustomFetch = class {
    constructor(baseOptions = {}) {
      this.defaultOptions = __spreadValues({
        method: "GET",
        headers: {
          "Content-Type": "application/json"
          // 'Authorization': `Bearer ${getToken()}`
        }
      }, baseOptions);
    }
    fetch(url, options) {
      return __async(this, null, function* () {
        const finalOptions = __spreadProps(__spreadValues(__spreadValues({}, this.defaultOptions), options), {
          timeout: 5e3
        });
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

  // app/src/scripts/components/NavGnb.ts
  var NavGnb = class extends HTMLElement {
    constructor() {
      super();
      this.sizeElement = null;
      this.PATHS = [
        "/search",
        "/favorite",
        "/popular",
        "/library",
        "/setting"
      ];
      this.sizeElement = null;
      this.renderBookSize = this.renderBookSize.bind(this);
    }
    connectedCallback() {
      this.render();
      this.setSelectedMenu();
      this.sizeElement = this.querySelector(".size");
      model_default.subscribeFavoriteBookUpdate(this.renderBookSize);
      model_default.subscribeToBookStateUpdate(this.renderBookSize);
    }
    disconnectedCallback() {
      model_default.unsubscribeFavoriteBookUpdate(this.renderBookSize);
      model_default.unsubscribeFavoriteBookUpdate(this.renderBookSize);
    }
    get bookSize() {
      return Object.values(model_default.favorites).reduce(
        (sum, currentArray) => sum + currentArray.length,
        0
      );
    }
    render() {
      this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href=".${this.PATHS[0]}">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href=".${this.PATHS[1]}">\uB098\uC758 \uCC45 (<span class="size">${this.bookSize}</span>)</a>
                <a class="gnb-item" href=".${this.PATHS[2]}">\uC778\uAE30\uB300\uCD9C\uB3C4\uC11C</a>
                <a class="gnb-item" href=".${this.PATHS[3]}">\uB3C4\uC11C\uAD00 \uC870\uD68C</a>
                <a class="gnb-item" href=".${this.PATHS[4]}">\uC124\uC815</a>
            </nav>`;
    }
    setSelectedMenu() {
      const index = this.PATHS.indexOf(document.location.pathname);
      if (index >= 0)
        this.querySelectorAll("a")[index].ariaSelected = "true";
    }
    renderBookSize() {
      if (this.sizeElement)
        this.sizeElement.textContent = this.bookSize.toString();
    }
  };

  // app/src/scripts/components/LoadingComponent.ts
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

  // app/src/scripts/pages/setting/AppSetting.ts
  var AppSetting = class extends HTMLElement {
    constructor() {
      super();
    }
  };

  // app/src/scripts/utils/helpers.ts
  function cloneTemplate(template) {
    const content = template.content.firstElementChild;
    if (!content) {
      throw new Error("Template content is empty");
    }
    return content.cloneNode(true);
  }

  // app/src/scripts/pages/setting/constants.ts
  var FETCH_REGION_DATA_EVENT = "fetch-region-data";

  // app/src/scripts/pages/setting/SetRegion.ts
  var SetRegion = class extends HTMLElement {
    constructor() {
      super();
      this.regionData = null;
      this.template = document.querySelector(
        "#tp-region"
      );
      this.fetchAndRender = this.fetchAndRender.bind(this);
    }
    connectedCallback() {
      this.fetchAndRender();
      model_default.subscribeToBookStateUpdate(this.fetchAndRender);
    }
    discinnectedCallback() {
      model_default.unsubscribeToBookStateUpdate(this.fetchAndRender);
    }
    fetchAndRender() {
      return __async(this, null, function* () {
        try {
          this.regionData = yield yield CustomFetch_default.fetch(
            "../../../assets/json/region.json"
          );
          this.render();
          CustomEventEmitter_default.dispatch(FETCH_REGION_DATA_EVENT, {
            regionData: this.regionData
          });
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get region data.");
        }
      });
    }
    render() {
      const regionElementsFragment = this.createRegionElementsFragment();
      const container = this.querySelector(".regions");
      container.innerHTML = "";
      container.appendChild(regionElementsFragment);
    }
    createRegionElementsFragment() {
      if (!this.regionData) {
        throw new Error("regionData is null.");
      }
      const fragment = new DocumentFragment();
      const regionData = this.regionData["region"];
      const favoriteRegions = Object.keys(model_default.regions);
      for (const [key, value] of Object.entries(regionData)) {
        const regionElement = this.createRegionElement(
          this.template,
          key,
          value,
          favoriteRegions
        );
        fragment.appendChild(regionElement);
      }
      return fragment;
    }
    createRegionElement(template, key, value, favoriteRegions) {
      const regionElement = cloneTemplate(template);
      const checkbox = regionElement.querySelector(
        "input"
      );
      checkbox.value = value;
      checkbox.checked = favoriteRegions.includes(key);
      checkbox.addEventListener(
        "change",
        this.createCheckboxChangeListener(checkbox)
      );
      const spanElement = regionElement.querySelector("span");
      if (spanElement)
        spanElement.textContent = key;
      return regionElement;
    }
    createCheckboxChangeListener(checkbox) {
      return () => {
        const spanElement = checkbox.nextElementSibling;
        if (!spanElement || typeof spanElement.textContent !== "string") {
          throw new Error(
            "Invalid checkbox element: No sibling element or missing text content."
          );
        }
        const key = spanElement.textContent;
        if (checkbox.checked) {
          model_default.addRegion(key);
        } else {
          model_default.removeRegion(key);
        }
      };
    }
  };

  // app/src/scripts/pages/setting/SetDetailRegion.ts
  var SetDetailRegion = class extends HTMLElement {
    constructor() {
      super();
      this.regionData = null;
      this.region = "";
      this.setRegionData = this.setRegionData.bind(this);
      this.renderRegion = this.renderRegion.bind(this);
    }
    connectedCallback() {
      model_default.subscribeRegionUpdate(this.renderRegion);
      CustomEventEmitter_default.add(FETCH_REGION_DATA_EVENT, this.setRegionData);
    }
    disconnectedCallback() {
      model_default.unsubscribeRegionUpdate(this.renderRegion);
      CustomEventEmitter_default.remove(FETCH_REGION_DATA_EVENT, this.setRegionData);
    }
    setRegionData(event) {
      const customEvent = event;
      this.regionData = customEvent.detail.regionData;
      this.renderRegion();
    }
    renderRegion() {
      const favoriteRegions = Object.keys(model_default.regions);
      const container = this.querySelector(".regions");
      if (!container)
        return;
      container.innerHTML = "";
      if (favoriteRegions.length > 0) {
        const regionElements = this.createRegions(favoriteRegions);
        container.appendChild(regionElements);
      }
      this.initializeFirstRegion(container);
    }
    createRegions(favoriteRegions) {
      const template = document.querySelector(
        "#tp-favorite-region"
      );
      const fragment = new DocumentFragment();
      favoriteRegions.forEach((region) => {
        if (region === "")
          return null;
        const element = cloneTemplate(template);
        const spanElement = element.querySelector("span");
        if (spanElement)
          spanElement.textContent = region;
        fragment.appendChild(element);
      });
      return fragment;
    }
    initializeFirstRegion(container) {
      const firstInput = container.querySelector(
        "input"
      );
      if (!firstInput) {
        this.renderDetailRegions("");
        return;
      }
      firstInput.checked = true;
      const labelEl = firstInput.nextElementSibling;
      const label = (labelEl == null ? void 0 : labelEl.textContent) || "";
      this.renderDetailRegions(label);
      this.changeRegion();
    }
    renderDetailRegions(regionName) {
      var _a;
      const detailRegionsElement = this.querySelector(
        ".detailRegions"
      );
      if (!detailRegionsElement)
        return;
      const regionObj = model_default.regions[regionName];
      const regionCodes = regionObj ? Object.values(regionObj) : [];
      const template = document.querySelector(
        "#tp-detail-region"
      );
      if (!template)
        return;
      detailRegionsElement.innerHTML = "";
      const detailRegionData = ((_a = this.regionData) == null ? void 0 : _a.detailRegion[regionName]) || {};
      const fragment = this.createDetailRegionElements(
        detailRegionData,
        template,
        regionCodes
      );
      detailRegionsElement.appendChild(fragment);
      this.region = regionName;
      this.onChangeDetail();
    }
    createDetailRegionElements(detailRegionData, template, regionCodes) {
      const fragment = new DocumentFragment();
      for (const [key, value] of Object.entries(detailRegionData)) {
        const element = cloneTemplate(template);
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
      return fragment;
    }
    changeRegion() {
      const regionRadios = this.querySelectorAll("[name=favorite-region]");
      Array.from(regionRadios).forEach((radio) => {
        const inputRadio = radio;
        inputRadio.addEventListener("change", () => {
          if (inputRadio.checked) {
            const labelElement = inputRadio.nextElementSibling;
            const label = (labelElement == null ? void 0 : labelElement.textContent) || "";
            this.renderDetailRegions(label);
          }
        });
      });
    }
    onChangeDetail() {
      const region = this.region;
      if (!model_default.regions[region]) {
        model_default.addRegion(region);
      }
      const checkboxes = document.querySelectorAll("[name=detailRegion]");
      checkboxes.forEach((checkbox) => {
        const inputCheckbox = checkbox;
        inputCheckbox.addEventListener("change", () => {
          const { value } = inputCheckbox;
          const labelElement = inputCheckbox.nextElementSibling;
          const label = (labelElement == null ? void 0 : labelElement.textContent) || "";
          if (inputCheckbox.checked) {
            model_default.addDetailRegion(region, label, value);
          } else {
            model_default.removeDetailRegion(region, label);
          }
        });
      });
    }
  };

  // app/src/scripts/pages/setting/FavoriteRegions.ts
  var FavoriteRegions = class extends HTMLElement {
    constructor() {
      super();
      this.container = null;
      this.template = null;
      this.render = this.render.bind(this);
    }
    connectedCallback() {
      this.container = this.querySelector(".favorites");
      this.template = this.querySelector("#tp-favorites-stored");
      this.render();
      model_default.subscribeToBookStateUpdate(this.render);
      model_default.subscribeDetailRegionUpdate(this.render);
      model_default.subscribeRegionUpdate(this.render);
    }
    disconnectedCallback() {
      model_default.unsubscribeToBookStateUpdate(this.render);
      model_default.unsubscribeDetailRegionUpdate(this.render);
      model_default.unsubscribeDetailRegionUpdate(this.render);
    }
    render() {
      if (!this.container)
        return;
      this.container.innerHTML = "";
      const regions = model_default.regions;
      const fragment = new DocumentFragment();
      for (const [name, detailRegions] of Object.entries(regions)) {
        const itemElement = this.createElement(
          name,
          detailRegions
        );
        fragment.appendChild(itemElement);
      }
      this.container.appendChild(fragment);
    }
    createElement(name, detailRegions) {
      var _a;
      if (!this.template)
        return;
      const itemElement = cloneTemplate(this.template);
      const titleElement = itemElement.querySelector(
        ".subTitle"
      );
      titleElement.textContent = name;
      const regions = this.renderDetail(detailRegions);
      (_a = itemElement.querySelector(".regions")) == null ? void 0 : _a.appendChild(regions);
      return itemElement;
    }
    renderDetail(detailRegions) {
      const fragment = new DocumentFragment();
      for (const [region, code] of Object.entries(detailRegions)) {
        const element = document.createElement("span");
        element.textContent = region;
        element.dataset.code = code;
        fragment.appendChild(element);
      }
      return fragment;
    }
  };

  // app/src/scripts/pages/setting/SetStorage.ts
  var SAMPLE_JSON_URL = `../../../assets/json/storage-sample.json`;
  var SetStorage = class extends HTMLElement {
    constructor() {
      super();
      this.saveStorage = () => {
        const blob = new Blob([JSON.stringify(model_default.state)], {
          type: "application/json"
        });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "storage-sample.json";
        a.click();
        URL.revokeObjectURL(a.href);
      };
      this.setDefaultState = () => __async(this, null, function* () {
        try {
          const data = yield CustomFetch_default.fetch(SAMPLE_JSON_URL);
          model_default.state = data;
          console.log("Saved local stronage by base data!");
        } catch (error) {
          console.error(error);
          throw new Error("Fail to get storage sample data.");
        }
      });
      this.resetStorage = () => {
        model_default.resetState();
      };
      this.regisKey = () => __async(this, null, function* () {
        const keyString = this.regisKeyTextarea.value;
        if (!this.validateKey(keyString))
          return;
        const key = keyString.replace(/\n/g, "aaaaa");
        const response = yield CustomFetch_default.fetch(`/regis-key?key=${key}`);
        if (response) {
          console.log("success");
        }
      });
      this.saveButton = this.querySelector(
        ".saveStorage button"
      );
      this.defaultButton = this.querySelector(
        ".localStorage button"
      );
      this.resetButton = this.querySelector(
        ".resetStorage button"
      );
      this.regisKeyTextarea = this.querySelector(
        ".regisKey textarea"
      );
      this.regisButton = this.querySelector(
        ".regisKey button"
      );
    }
    connectedCallback() {
      this.saveButton.addEventListener("click", this.saveStorage);
      this.defaultButton.addEventListener("click", this.setDefaultState);
      this.resetButton.addEventListener("click", this.resetStorage);
      this.regisButton.addEventListener("click", this.regisKey);
    }
    disconnectedCallback() {
      this.saveButton.removeEventListener("click", this.saveStorage);
      this.defaultButton.removeEventListener("click", this.setDefaultState);
      this.regisButton.removeEventListener("click", this.resetStorage);
      this.regisButton.removeEventListener("click", this.regisKey);
    }
    validateKey(keyString) {
      if (keyString.length > 0) {
        const names = [
          "LIBRARY_KEY",
          "NAVER_CLIENT_ID",
          "NAVER_SECRET_KEY"
        ];
        return names.every((n) => keyString.includes(n));
      } else
        return false;
    }
  };

  // app/src/scripts/pages/setting/index.ts
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-setting", AppSetting);
  customElements.define("set-region", SetRegion);
  customElements.define("set-detail-region", SetDetailRegion);
  customElements.define("favorite-regions", FavoriteRegions);
  customElements.define("set-storage", SetStorage);
})();
//# sourceMappingURL=index.js.map
