"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const apiHandlers_1 = require("./apiHandlers");
const app = (0, express_1.default)();
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, envFile) });
const { PORT } = process.env;
const directory = isProduction ? "dist" : "src";
console.log("isProduction", isProduction, directory);
if (isProduction) {
    const copyAssets = (srcSubDir, distSubdir) => __awaiter(void 0, void 0, void 0, function* () {
        const srcDir = path_1.default.join(__dirname, "src", srcSubDir);
        const distDir = path_1.default.join(__dirname, "dist", distSubdir);
        try {
            yield fs_extra_1.default.copy(srcDir, distDir);
            console.log(`${srcSubDir} copied sucessfully!`);
        }
        catch (err) {
            console.error(`An error occured while coping ${srcSubDir}`, err);
        }
    });
    copyAssets("asset", "asset");
    copyAssets("json", "json");
}
app.use(express_1.default.static(`${__dirname}/${directory}`));
app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
// API 라우트
app.get("/search-naver-book", apiHandlers_1.searchNaverBook);
app.get("/library-search", apiHandlers_1.librarySearch);
app.get("/book-exist", apiHandlers_1.bookExist);
app.get("/usage-analysis-list", apiHandlers_1.usageAnalysisList);
app.get("/library-search-by-book", apiHandlers_1.librarySearchByBook);
// 정적 페이지 라우트
const routes = ["search", "favorite", "library", "book", "setting"];
routes.forEach((route) => {
    app.get(`/${route}`, (req, res) => {
        console.log("route:", `/${route}`);
        const htmlPath = path_1.default.resolve(__dirname, `${directory}/html/${route}.html`);
        fs_1.default.readFile(htmlPath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Failed to load HTML file");
            }
            res.send(data);
        });
    });
});
