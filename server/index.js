"use strict";
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
const directory = isProduction ? "dist" : "src";
const rootPath = path_1.default.join(__dirname, "..");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, envFile) });
const { PORT } = process.env;
console.log("***[Server]*** isProduction: ", isProduction);
if (isProduction) {
    const srcDir = path_1.default.join(rootPath, "src", "assets");
    const distDir = path_1.default.join(rootPath, "dist", "assets");
    try {
        fs_extra_1.default.copy(srcDir, distDir);
        console.log(`Assets copied sucessfully!`);
    }
    catch (err) {
        console.error(`An error occured while coping Assets`, err);
    }
}
app.use(express_1.default.static(path_1.default.join(rootPath, directory)));
app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
app.get("/search-naver-book", apiHandlers_1.searchNaverBook);
app.get("/library-search", apiHandlers_1.librarySearch);
app.get("/book-exist", apiHandlers_1.bookExist);
app.get("/usage-analysis-list", apiHandlers_1.usageAnalysisList);
app.get("/library-search-by-book", apiHandlers_1.librarySearchByBook);
const routes = ["search", "favorite", "library", "book", "setting"];
routes.forEach((route) => {
    app.get(`/${route}`, (req, res) => {
        console.log("route:", `/${route}`);
        const htmlPath = path_1.default.resolve(rootPath, `${directory}/html/${route}.html`);
        fs_1.default.readFile(htmlPath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Failed to load HTML file");
            }
            res.send(data);
        });
    });
});
