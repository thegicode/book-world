var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CustomFetch } from "../../utils";
export default class Popular extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.fetch();
    }
    // disconnectedCallback() {}
    fetch() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParams = new URLSearchParams({
                startDt: "2022-01-01",
                endDt: "2022-03-31",
                gender: "1",
                age: "20",
                region: "11;31",
                addCode: "0",
                kdc: "6",
                pageNo: "1",
                pageSize: "10",
            });
            const url = `/popular-book?${searchParams}`;
            try {
                const data = yield CustomFetch.fetch(url);
                console.log(data);
            }
            catch (error) {
                console.error(error);
                throw new Error(`Fail to get library search by book.`);
            }
        });
    }
}
//# sourceMappingURL=Popular.js.map