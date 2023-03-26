var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CustomFetch {
    constructor(baseOptions = {}) {
        this.defaultOptions = Object.assign({ method: 'GET', headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${getToken()}`
            } }, baseOptions);
    }
    fetch(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalOptions = Object.assign(Object.assign(Object.assign({}, this.defaultOptions), options), { timeout: 5000 });
            try {
                const response = yield fetch(url, finalOptions);
                if (!response.ok) {
                    throw new Error(`Http error! status: ${response.status}, message: ${response.statusText}`);
                }
                const data = yield response.json();
                return data;
            }
            catch (error) {
                console.error(`Error fetching data: ${error}`);
                throw new Error(`Error fetching data: ${error}`);
            }
        });
    }
}
export default new CustomFetch();
//# sourceMappingURL=CustomFetch.js.map