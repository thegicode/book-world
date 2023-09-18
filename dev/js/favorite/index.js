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
    libraries: {},
    regions: {},
    category: {},
    categorySort: []
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
  var addCategory = (name) => {
    state.category[name] = [];
    state.categorySort.push(name);
    setState(state);
  };
  var hasCategory = (name) => {
    return name in state.category;
  };
  var renameCategory = (name, newName) => {
    const index = state.categorySort.indexOf(name);
    state.categorySort[index] = newName;
    state.category[newName] = state.category[name];
    delete state.category[name];
    setState(state);
  };
  var deleteCategory = (name) => {
    state.categorySort = state.categorySort.filter((item) => item !== name);
    delete state.category[name];
    setState(state);
  };
  var changeCategory = (draggedKey, targetKey) => {
    const draggedIndex = state.categorySort.indexOf(draggedKey);
    const targetIndex = state.categorySort.indexOf(targetKey);
    const sortData = [...state.categorySort];
    sortData[targetIndex] = draggedKey;
    sortData[draggedIndex] = targetKey;
    state.categorySort = sortData;
    setState(state);
  };
  var addBookInCategory = (name, isbn) => {
    state.category[name].unshift(isbn);
    setState(state);
  };
  var hasBookInCategory = (name, isbn) => {
    return state.category[name].includes(isbn);
  };
  var removeBookInCategory = (name, isbn) => {
    const index = state.category[name].indexOf(isbn);
    if (index !== -1) {
      state.category[name].splice(index, 1);
      setState(state);
    }
  };
  var getBookSizeInCategory = () => {
    function getTotalItemCount(data) {
      return Object.values(data).reduce((sum, currentArray) => sum + currentArray.length, 0);
    }
    return getTotalItemCount(state.category);
  };

  // dev/scripts/components/NavGnb.js
  var NavGnb = class extends HTMLElement {
    constructor() {
      super();
    }
    connectedCallback() {
      this.render();
      this.setSelectedMenu();
    }
    render() {
      this.innerHTML = `
            <nav class="gnb">
                <a class="gnb-item" href="./search">\uCC45 \uAC80\uC0C9</a>
                <a class="gnb-item" href="./favorite">\uB098\uC758 \uCC45 (<span class="size">${getBookSizeInCategory()}</span>)</a>
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
  var updateBookSizeInCategor = () => {
    const navElement = document.querySelector("nav-gnb");
    navElement.querySelector(".size").textContent = String(getBookSizeInCategory());
  };

  // dev/scripts/components/CheckboxFavoriteBook.js
  var CheckboxFavoriteBook = class extends HTMLElement {
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
    }
    connectedCallback() {
      this.render();
    }
    render() {
      const container = this.createContainer();
      this.innerHTML = `<h5>Category</h5>`;
      this.appendChild(container);
    }
    getISBN() {
      const isbnElement = this.closest("[data-isbn]");
      return isbnElement && isbnElement.dataset.isbn ? isbnElement.dataset.isbn : null;
    }
    createContainer() {
      const container = document.createElement("div");
      container.className = "category";
      state.categorySort.forEach((category) => this.createCategoryItem(container, category, this.isbn || ""));
      return container;
    }
    createCheckbox(category, ISBN) {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      if (hasBookInCategory(category, ISBN)) {
        checkbox.checked = true;
      }
      checkbox.addEventListener("change", () => this.onChange(checkbox, category, ISBN));
      return checkbox;
    }
    onChange(checkbox, category, ISBN) {
      const isBookInCategory = hasBookInCategory(category, ISBN);
      if (isBookInCategory) {
        removeBookInCategory(category, ISBN);
      } else {
        addBookInCategory(category, ISBN);
      }
      checkbox.checked = !isBookInCategory;
      updateBookSizeInCategor();
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

  // dev/scripts/pages/favorite/Favorite.js
  var Favorite = class extends HTMLElement {
    constructor() {
      super();
      this.booksElement = this.querySelector(".favorite-books");
      this.template = document.querySelector("#tp-favorite-item");
      const params = new URLSearchParams(location.search);
      this.locationCategory = params.get("category");
    }
    connectedCallback() {
      if (state.categorySort.length === 0) {
        this.renderMessage();
        return;
      }
      const key = this.locationCategory || state.categorySort[0];
      this.render(key);
    }
    disconnectedCallback() {
    }
    render(key) {
      var _a;
      const fragment = new DocumentFragment();
      const template = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild;
      this.booksElement.innerHTML = "";
      if (template) {
        state.category[key].forEach((isbn) => {
          const el = template.cloneNode(true);
          el.dataset.isbn = isbn;
          fragment.appendChild(el);
        });
      }
      this.booksElement.appendChild(fragment);
    }
    renderMessage() {
      const template = document.querySelector("#tp-message").content.firstElementChild;
      if (template) {
        const element = template.cloneNode(true);
        element.textContent = "\uAD00\uC2EC\uCC45\uC744 \uB4F1\uB85D\uD574\uC8FC\uC138\uC694.";
        this.booksElement.appendChild(element);
      }
    }
  };

  // dev/scripts/pages/favorite/FavoriteNav.js
  var FavoriteNav = class extends HTMLElement {
    constructor() {
      super();
      this.nav = this.querySelector(".favorite-category");
      this.overlayCategory = document.querySelector("overlay-category");
      const params = new URLSearchParams(location.search);
      this.category = params.get("category");
      this.onCategoryAdded = this.onCategoryAdded.bind(this);
      this.onCategoryRenamed = this.onCategoryRenamed.bind(this);
      this.onCategoryDeleted = this.onCategoryDeleted.bind(this);
      this.onCategoryChanged = this.onCategoryChanged.bind(this);
    }
    connectedCallback() {
      CustomEventEmitter_default.add("categoryAdded", this.onCategoryAdded);
      CustomEventEmitter_default.add("categoryRenamed", this.onCategoryRenamed);
      CustomEventEmitter_default.add("categoryDeleted", this.onCategoryDeleted);
      CustomEventEmitter_default.add("categoryChanged", this.onCategoryChanged);
      if (this.category === null) {
        this.category = state.categorySort[0];
        const url = this.getUrl(this.category);
        location.search = url;
      }
      this.render();
      this.overlayCatalog();
    }
    disconnectedCallback() {
      CustomEventEmitter_default.remove("categoryAdded", this.onCategoryAdded);
      CustomEventEmitter_default.remove("categoryRenamed", this.onCategoryRenamed);
      CustomEventEmitter_default.remove("categoryDeleted", this.onCategoryDeleted);
    }
    render() {
      if (!this.nav)
        return;
      this.nav.innerHTML = "";
      const fragment = new DocumentFragment();
      state.categorySort.forEach((category) => {
        const el = this.createItem(category);
        fragment.appendChild(el);
      });
      this.nav.appendChild(fragment);
      this.hidden = false;
    }
    createItem(category) {
      const el = document.createElement("a");
      el.textContent = category;
      el.href = `?${this.getUrl(category)}`;
      if (category === this.category) {
        el.ariaSelected = "true";
      }
      el.addEventListener("click", (event) => {
        this.onChange(category, el, event);
      });
      return el;
    }
    onChange(category, el, event) {
      event.preventDefault();
      el.ariaSelected = "true";
      location.search = this.getUrl(category);
      this.category = category;
    }
    getUrl(category) {
      const categoryStr = encodeURIComponent(category);
      return `category=${categoryStr}`;
    }
    overlayCatalog() {
      const modal = this.overlayCategory;
      const changeButton = this.querySelector(".favorite-changeButton");
      changeButton === null || changeButton === void 0 ? void 0 : changeButton.addEventListener("click", () => {
        modal.hidden = Boolean(!modal.hidden);
      });
    }
    onCategoryAdded(event) {
      var _a;
      const { category } = event.detail;
      const element = this.createItem(category);
      (_a = this.nav) === null || _a === void 0 ? void 0 : _a.appendChild(element);
    }
    onCategoryRenamed(event) {
      if (!this.nav)
        return;
      const { category, value } = event.detail;
      const index = state.categorySort.indexOf(value);
      this.nav.querySelectorAll("a")[index].textContent = value;
      if (this.category === category) {
        location.search = this.getUrl(value);
      }
    }
    onCategoryDeleted(event) {
      var _a;
      const { index } = event.detail;
      (_a = this.nav) === null || _a === void 0 ? void 0 : _a.querySelectorAll("a")[index].remove();
    }
    onCategoryChanged(event) {
      var _a;
      const { draggedKey, targetKey } = event.detail;
      const draggedIndex = state.categorySort.indexOf(draggedKey);
      const targetIndex = state.categorySort.indexOf(targetKey);
      const navLinks = (_a = this.nav) === null || _a === void 0 ? void 0 : _a.querySelectorAll("a");
      if (navLinks) {
        const targetEl = navLinks[targetIndex].cloneNode(true);
        const draggedEl = navLinks[draggedIndex].cloneNode(true);
        navLinks[draggedIndex].replaceWith(targetEl);
        navLinks[targetIndex].replaceWith(draggedEl);
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
    constructor() {
      super();
    }
    connectedCallback() {
      this.libraryButton = this.querySelector(".library-button");
      this.anchorElement = this.querySelector("a");
      this.loading();
      this.fetchData(this.dataset.isbn);
      this.libraryButton.addEventListener("click", this.onLibrary.bind(this));
      this.anchorElement.addEventListener("click", this.onClick.bind(this));
    }
    disconnectedCallback() {
      var _a, _b;
      (_a = this.libraryButton) === null || _a === void 0 ? void 0 : _a.removeEventListener("click", this.onLibrary);
      (_b = this.anchorElement) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.onClick);
    }
    fetchData(isbn) {
      return __awaiter3(this, void 0, void 0, function* () {
        const url = `/usage-analysis-list?isbn13=${isbn}`;
        try {
          const data = yield CustomFetch_default.fetch(url);
          this.render(data);
        } catch (error) {
          this.errorRender();
          console.error(error);
          throw new Error(`Fail to get usage analysis list.`);
        }
      });
    }
    render(data) {
      const {
        book
        // loanHistory,
        // loanGrps,
        // keywords,
        // recBooks,
        // coLoanBooks
      } = data;
      const {
        authors,
        bookImageURL,
        bookname,
        class_nm,
        // class_no,
        description,
        isbn13,
        loanCnt,
        publication_year,
        publisher
        // vol
      } = book;
      this.bookData = data;
      this.querySelector(".bookname").textContent = bookname;
      this.querySelector(".authors").textContent = authors;
      this.querySelector(".class_nm").textContent = class_nm;
      this.querySelector(".isbn13").textContent = isbn13;
      this.querySelector(".loanCnt").textContent = loanCnt.toLocaleString();
      this.querySelector(".publication_year").textContent = publication_year;
      this.querySelector(".publisher").textContent = publisher;
      const descriptionElement = this.querySelector("book-description");
      if (descriptionElement) {
        descriptionElement.data = description;
      }
      const imageElement = this.querySelector("book-image");
      if (imageElement) {
        imageElement.data = {
          bookImageURL,
          bookname
        };
      }
      if (this.libraryButton && Object.keys(state.libraries).length === 0) {
        this.libraryButton.disabled = true;
      }
      this.removeLoading();
    }
    errorRender() {
      this.removeLoading();
      this.dataset.fail = "true";
      this.querySelector("h4").textContent = `${this.dataset.isbn}\uC758 \uCC45 \uC815\uBCF4\uB97C \uAC00\uC838\uC62C \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.`;
    }
    onLibrary() {
      const isbn = this.dataset.isbn;
      const libraryBookExist = this.querySelector("library-book-exist");
      if (libraryBookExist && this.libraryButton) {
        libraryBookExist.onLibraryBookExist(this.libraryButton, isbn, state.libraries);
      }
    }
    loading() {
      this.dataset.loading = "true";
    }
    removeLoading() {
      delete this.dataset.loading;
    }
    onClick(event) {
      event.preventDefault();
      location.href = `book?isbn=${this.dataset.isbn}`;
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
        const category = this.addInput.value;
        if (!category)
          return;
        if (hasCategory(category)) {
          alert("\uC911\uBCF5\uB41C \uC774\uB984\uC785\uB2C8\uB2E4.");
          this.addInput.value = "";
          return;
        }
        addCategory(category);
        const index = state.categorySort.length;
        const cloned = this.createItem(category, index);
        (_a = this.list) === null || _a === void 0 ? void 0 : _a.appendChild(cloned);
        this.addInput.value = "";
        CustomEventEmitter_default.dispatch("categoryAdded", {
          category
        });
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
      this.addButton = this.querySelector(".addButton");
      this.addInput = this.querySelector("input[name='add']");
      this.closeButton = this.querySelector(".closeButton");
      this.draggedItem = null;
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
      state.categorySort.forEach((category, index) => {
        const cloned = this.createItem(category, index);
        fragment.appendChild(cloned);
      });
      this.list.appendChild(fragment);
    }
    createItem(category, index) {
      var _a, _b, _c, _d;
      const cloned = (_b = (_a = this.template) === null || _a === void 0 ? void 0 : _a.content.firstElementChild) === null || _b === void 0 ? void 0 : _b.cloneNode(true);
      cloned.dataset.index = index.toString();
      cloned.dataset.category = category;
      const input = cloned.querySelector("input[name='category']");
      if (input) {
        input.value = category;
      }
      (_c = cloned.querySelector(".rename")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
        const value = input.value;
        if (value && category !== value) {
          renameCategory(category, value);
          CustomEventEmitter_default.dispatch("categoryRenamed", {
            category,
            value
          });
        }
      });
      (_d = cloned.querySelector(".delete")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
        const index2 = state.categorySort.indexOf(category);
        cloned.remove();
        deleteCategory(category);
        CustomEventEmitter_default.dispatch("categoryDeleted", {
          index: index2
        });
      });
      this.changeItem(cloned);
      return cloned;
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
        const draggedKey = this.draggedItem.dataset.category;
        const targetKey = cloned.dataset.category;
        if (draggedKey && targetKey) {
          changeCategory(draggedKey, targetKey);
          CustomEventEmitter_default.dispatch("categoryChanged", {
            draggedKey,
            targetKey
          });
        }
        delete cloned.dataset.drag;
      });
    }
  };

  // dev/scripts/pages/favorite/index.js
  customElements.define("nav-gnb", NavGnb);
  customElements.define("app-favorite", Favorite);
  customElements.define("favorite-nav", FavoriteNav);
  customElements.define("favorite-item", FavoriteItem);
  customElements.define("book-description", BookDescription);
  customElements.define("library-book-exist", LibraryBookExist);
  customElements.define("checkbox-favorite-book", CheckboxFavoriteBook);
  customElements.define("book-image", BookImage);
  customElements.define("overlay-category", OverlayCategory);
})();
//# sourceMappingURL=index.js.map
