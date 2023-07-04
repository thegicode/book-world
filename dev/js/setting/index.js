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

  // dev/scripts/pages/setting/AppSetting.js
  var AppSetting = class extends HTMLElement {
    constructor() {
      super();
    }
  };

  // dev/scripts/pages/setting/SetRegion.js
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

  // dev/scripts/pages/setting/SetDetailRegion.js
  var FETCH_REGION_DATA_EVENT = "fetch-region-data";
  var SET_FAVORITE_REGIONS_EVENT = "set-favorite-regions";
  var SET_DETAIL_REGIONS_EVENT = "set-detail-regions";
  var SetDetailRegion = class extends HTMLElement {
    constructor() {
      super();
      this.regionData = null;
      this.region = "";
      this.setRegionData = this.setRegionData.bind(this);
      this.renderRegion = this.renderRegion.bind(this);
    }
    connectedCallback() {
      CustomEventEmitter_default.add(FETCH_REGION_DATA_EVENT, this.setRegionData);
      CustomEventEmitter_default.add(SET_FAVORITE_REGIONS_EVENT, this.renderRegion);
    }
    disconnectedCallback() {
      CustomEventEmitter_default.remove(FETCH_REGION_DATA_EVENT, this.setRegionData);
      CustomEventEmitter_default.remove(SET_FAVORITE_REGIONS_EVENT, this.renderRegion);
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
      const container = this.querySelector(".regions");
      if (!container)
        return;
      container.innerHTML = "";
      const regionElements = this.createRegions(favoriteRegions);
      if (!regionElements)
        return;
      container.appendChild(regionElements);
      this.initializeFirstRegion(container);
    }
    createRegions(favoriteRegions) {
      var _a;
      const template = (_a = document.querySelector("#tp-favorite-region")) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
      if (!template)
        return;
      const fragment = new DocumentFragment();
      favoriteRegions.forEach((region) => {
        const element = template.cloneNode(true);
        const spanElement = element.querySelector("span");
        if (spanElement)
          spanElement.textContent = region;
        fragment.appendChild(element);
      });
      return fragment;
    }
    initializeFirstRegion(container) {
      const firstInput = container.querySelector("input");
      if (!firstInput)
        return;
      firstInput.checked = true;
      const labelEl = firstInput.nextElementSibling;
      const label = (labelEl === null || labelEl === void 0 ? void 0 : labelEl.textContent) || "";
      this.renderDetailRegions(label);
      this.changeRegion();
    }
    renderDetailRegions(regionName) {
      var _a;
      if (!this.regionData)
        return;
      const detailRegionsElement = this.querySelector(".detailRegions");
      if (!detailRegionsElement)
        return;
      const regionObj = getState().regions[regionName];
      const regionCodes = regionObj ? Object.values(regionObj) : [];
      const template = (_a = document.querySelector("#tp-detail-region")) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
      if (!template)
        return;
      detailRegionsElement.innerHTML = "";
      const detailRegionData = this.regionData.detailRegion[regionName];
      if (!detailRegionData)
        return;
      const fragment = this.createDetailRegionElements(detailRegionData, template, regionCodes);
      detailRegionsElement.appendChild(fragment);
      this.region = regionName;
      this.onChangeDetail();
    }
    createDetailRegionElements(detailRegionData, template, regionCodes) {
      const fragment = new DocumentFragment();
      for (const [key, value] of Object.entries(detailRegionData)) {
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
      return fragment;
    }
    changeRegion() {
      const regionRadios = this.querySelectorAll("[name=favorite-region]");
      Array.from(regionRadios).forEach((radio) => {
        const inputRadio = radio;
        inputRadio.addEventListener("change", () => {
          if (inputRadio.checked) {
            const labelElement = inputRadio.nextElementSibling;
            const label = (labelElement === null || labelElement === void 0 ? void 0 : labelElement.textContent) || "";
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
          const labelElement = inputCheckbox.nextElementSibling;
          const label = (labelElement === null || labelElement === void 0 ? void 0 : labelElement.textContent) || "";
          if (inputCheckbox.checked) {
            addDetailRegion(region, label, value);
          } else {
            removeDetailRegion(region, label);
          }
          CustomEventEmitter_default.dispatch(SET_DETAIL_REGIONS_EVENT, {});
        });
      });
    }
  };

  // dev/scripts/pages/setting/FavoriteRegions.js
  var DETAIL_REGIONS_EVENT = "set-detail-regions";
  var FavoriteRegions = class extends HTMLElement {
    constructor() {
      super();
      this.container = null;
      this.render = this.render.bind(this);
    }
    connectedCallback() {
      this.container = this.querySelector(".favorites");
      this.render();
      CustomEventEmitter_default.add(DETAIL_REGIONS_EVENT, this.render);
    }
    disconnectedCallback() {
      CustomEventEmitter_default.remove(DETAIL_REGIONS_EVENT, this.render);
    }
    render() {
      if (!this.container)
        return;
      this.container.innerHTML = "";
      const { regions } = getState();
      for (const regionName in regions) {
        const detailRegions = Object.keys(regions[regionName]);
        if (detailRegions.length > 0) {
          const titleElement = document.createElement("h3");
          titleElement.textContent = regionName;
          this.container.appendChild(titleElement);
          this.renderDetail(detailRegions);
        }
      }
    }
    renderDetail(detailRegions) {
      if (!this.container)
        return;
      const fragment = new DocumentFragment();
      detailRegions.forEach((name) => {
        const element = document.createElement("p");
        element.textContent = name;
        fragment.appendChild(element);
      });
      this.container.appendChild(fragment);
    }
  };

  // dev/scripts/pages/setting/SetStorage.js
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

  // dev/scripts/pages/setting/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-setting", AppSetting);
  customElements.define("set-region", SetRegion);
  customElements.define("set-detail-region", SetDetailRegion);
  customElements.define("favorite-regions", FavoriteRegions);
  customElements.define("set-storage", SetStorage);
})();
//# sourceMappingURL=index.js.map
