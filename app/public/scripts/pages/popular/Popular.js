var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
// import { BookImage } from "../../components/index";
import { BookImage } from "../../components";
import { CustomEventEmitter, CustomFetch } from "../../utils";
import { cloneTemplate, getCurrentDates } from "../../utils/helpers";
export default class Popular extends HTMLElement {
    constructor() {
        super();
        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.list = this.querySelector(".popular-list");
        this.loadingComponent =
            this.querySelector("loading-component");
        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;
    }
    connectedCallback() {
        this.params = this.getParams();
        this.fetch(this.params);
        CustomEventEmitter.add("requestPopular", this.onRequestPopular);
        CustomEventEmitter.add("clickPageNav", this.onClickPageNav);
    }
    disconnectedCallback() {
        CustomEventEmitter.remove("requestPopular", this.onRequestPopular);
        CustomEventEmitter.remove("clickPageNav", this.onClickPageNav);
    }
    getParams() {
        const { currentYear, currentMonth, currentDay } = getCurrentDates();
        return {
            startDt: "2023-01-01",
            endDt: `${currentYear}-${currentMonth}-${currentDay}`,
            gender: "",
            age: "",
            region: "",
            addCode: "",
            kdc: "",
            pageNo: "1",
            pageSize: "100",
        };
    }
    fetch(params) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.loadingComponent) === null || _a === void 0 ? void 0 : _a.show();
            this.list.innerHTML = "";
            const searchParams = new URLSearchParams(Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)]));
            try {
                const data = yield CustomFetch.fetch(`/popular-book?${searchParams}`);
                this.render(data);
                if (params.pageNo === "1") {
                    CustomEventEmitter.dispatch("renderPageNav", {
                        pageSize: params.pageSize,
                    });
                }
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get library search by book.`);
            }
            (_b = this.loadingComponent) === null || _b === void 0 ? void 0 : _b.hide();
        });
    }
    render({ data, resultNum }) {
        if (!this.list)
            return;
        console.log(resultNum);
        const fragment = new DocumentFragment();
        data.map((item) => this.createItem(item)).forEach((element) => element && fragment.appendChild(element));
        this.list.appendChild(fragment);
    }
    createItem(item) {
        const { 
        // addition_symbol,
        bookImageURL, 
        // bookname,
        bookDtlUrl } = item, otherData = __rest(item, ["bookImageURL", "bookDtlUrl"])
        // authors,  class_nm, isbn13, class_no, loan_count,  no,  publication_year,  publisher, ranking, vol,
        ;
        if (!this.itemTemplate)
            return;
        const cloned = cloneTemplate(this.itemTemplate);
        cloned.dataset.isbn = item.isbn13;
        const linkEl = cloned.querySelector(".link");
        linkEl.insertBefore(new BookImage(bookImageURL, item.bookname), linkEl.querySelector(".ranking"));
        const bookDtlUrlNode = cloned.querySelector(".bookDtlUrl");
        if (bookDtlUrlNode) {
            bookDtlUrlNode.href = bookDtlUrl;
        }
        Object.entries(otherData).forEach(([key, value]) => {
            const element = cloned.querySelector(`.${key}`);
            if (element)
                element.textContent = value;
        });
        const anchorEl = cloned.querySelector("a");
        if (anchorEl)
            anchorEl.href = `/book?isbn=${item.isbn13}`;
        return cloned;
    }
    onRequestPopular(event) {
        this.params = event.detail.params;
        this.fetch(this.params);
    }
    onClickPageNav(event) {
        if (!this.params)
            return;
        this.params.pageNo = event.detail.pageIndex.toString();
        this.fetch(this.params);
    }
}
//# sourceMappingURL=Popular.js.map