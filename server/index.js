"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const apiHandlers_1 = require("./apiHandlers");
const watch_and_copy_1 = require("./watch-and-copy");
const app = (0, express_1.default)();
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
const directory = isProduction ? "prod" : "dev";
const rootPath = path_1.default.join(__dirname, "..");
const destPath = path_1.default.join(rootPath, directory);
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, envFile) });
const { PORT } = process.env;
console.log("***[Server]*** isProduction: ", isProduction);
(0, watch_and_copy_1.watchAndCopy)(rootPath, isProduction);
app.use(express_1.default.static(destPath));
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
        const htmlPath = path_1.default.join(destPath, `/html/${route}.html`);
        fs_1.default.readFile(htmlPath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Failed to load HTML file");
            }
            res.send(data);
        });
    });
});
