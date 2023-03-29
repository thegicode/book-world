import express from "express";
import fs from "fs";
import fsExtra from "fs-extra";
import path from "path";
import dotenv from "dotenv";
import {
    searchNaverBook,
    librarySearch,
    bookExist,
    usageAnalysisList,
    librarySearchByBook,
} from "./apiHandlers";

const app = express();

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
dotenv.config({ path: path.resolve(__dirname, envFile) });
const { PORT } = process.env;

const directory = isProduction ? "src" : "dist";

if (isProduction) {
    const copyAssets = async (srcSubDir: string, distSubdir: string) => {
        const srcDir = path.join(__dirname, "src", srcSubDir);
        const distDir = path.join(__dirname, "dist", distSubdir);
        try {
            await fsExtra.copy(srcDir, distDir);
            console.log(`${srcSubDir} copied sucessfully!`);
        } catch (err) {
            console.error(`An error occured while coping ${srcSubDir}`, err);
        }
    };
    copyAssets("asset", "asset");
    copyAssets("json", "json");
}
app.use(express.static(`${__dirname}/${directory}`));

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});

// API 라우트
app.get("/search-naver-book", searchNaverBook);
app.get("/library-search", librarySearch);
app.get("/book-exist", bookExist);
app.get("/usage-analysis-list", usageAnalysisList);
app.get("/library-search-by-book", librarySearchByBook);

// 정적 페이지 라우트
const routes = ["search", "favorite", "library", "book", "setting"];
routes.forEach((route) => {
    app.get(`/${route}`, (req, res) => {
        console.log("route:", `/${route}`);

        const htmlPath = path.resolve(
            __dirname,
            `${directory}/html/${route}.html`
        );
        fs.readFile(htmlPath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Failed to load HTML file");
            }
            res.send(data);
        });
    });
});
