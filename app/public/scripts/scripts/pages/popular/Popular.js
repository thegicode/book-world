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
import { CustomEventEmitter, CustomFetch } from "../../utils";
import { cloneTemplate, getCurrentDates } from "../../utils/helpers";
export default class Popular extends HTMLElement {
    constructor() {
        super();
        this.itemTemplate = document.querySelector("#tp-popular-item");
        this.body = this.querySelector(".popular-body");
        this.list = this.querySelector(".popular-list");
        this.loading = document.querySelector(".popular-loading");
        this.onRequestPopular = this.onRequestPopular.bind(this);
        this.onClickPageNav = this.onClickPageNav.bind(this);
        this.params = null;
        // console.log(BookImage);
    }
    connectedCallback() {
        const { currentYear, currentMonth, currentDay } = getCurrentDates();
        const params = {
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
        this.params = params;
        this.fetch(params);
        CustomEventEmitter.add("requestPopular", this.onRequestPopular);
        CustomEventEmitter.add("clickPageNav", this.onClickPageNav);
    }
    disconnectedCallback() {
        CustomEventEmitter.remove("requestPopular", this.onRequestPopular);
        CustomEventEmitter.remove("clickPageNav", this.onClickPageNav);
    }
    fetch(params) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.body && this.list) {
                this.body.dataset.loading = "true";
                this.list.innerHTML = "";
            }
            const searchParams = new URLSearchParams(Object.entries(params)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => [key, String(value)]));
            const url = `/popular-book?${searchParams}`;
            try {
                const data = yield CustomFetch.fetch(url);
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
        });
    }
    render({ data, resultNum }) {
        if (!this.list)
            return;
        console.log(resultNum);
        const fragment = new DocumentFragment();
        data.map((item) => {
            const cloned = this.createItem(item);
            cloned && fragment.appendChild(cloned);
        });
        this.list.appendChild(fragment);
        if (this.body) {
            this.body.dataset.loading = "false";
        }
    }
    createItem(item) {
        const { 
        // addition_symbol,
        bookImageURL, 
        // bookname,
        bookDtlUrl } = item, otherData = __rest(item, ["bookImageURL", "bookDtlUrl"])
        // authors,  class_nm, isbn13, class_no, loan_count,  no,  publication_year,  publisher, ranking, vol,
        ;
        const isbn = item.isbn13;
        const bookname = item.bookname;
        if (this.itemTemplate === null) {
            throw new Error("Template is null");
        }
        const cloned = cloneTemplate(this.itemTemplate);
        cloned.dataset.isbn = isbn;
        const imageNode = cloned.querySelector("img");
        if (imageNode) {
            imageNode.src = bookImageURL;
            imageNode.alt = bookname;
        }
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
            anchorEl.href = `/book?isbn=${isbn}`;
        return cloned;
    }
    onRequestPopular(event) {
        const { params } = event.detail;
        this.params = params;
        this.fetch(params);
    }
    onClickPageNav(event) {
        const { pageIndex } = event.detail;
        if (this.params) {
            this.params.pageNo = pageIndex.toString();
            this.fetch(this.params);
        }
    }
}
//# sourceMappingURL=Popular.js.map