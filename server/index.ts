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
const directory = isProduction ? "dist" : "src";
const rootPath = path.join(__dirname, "..");

dotenv.config({ path: path.resolve(__dirname, envFile) });
const { PORT } = process.env;

console.log("***[Server]*** isProduction: ", isProduction);

if (isProduction) {
    const copyAssets = async (srcSubDir: string, distSubdir: string) => {
        const srcDir = path.join(rootPath, "src", srcSubDir);
        const distDir = path.join(rootPath, "dist", distSubdir);
        try {
            await fsExtra.copy(srcDir, distDir);
            console.log(`${srcSubDir} copied sucessfully!`);
        } catch (err) {
            console.error(`An error occured while coping ${srcSubDir}`, err);
        }
    };
    copyAssets("assets", "assets");
    // copyAssets("json", "json");
}
app.use(express.static(path.join(rootPath, directory)));

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});

// API routes
app.get("/search-naver-book", searchNaverBook);
app.get("/library-search", librarySearch);
app.get("/book-exist", bookExist);
app.get("/usage-analysis-list", usageAnalysisList);
app.get("/library-search-by-book", librarySearchByBook);

// Static page routes
const routes = ["search", "favorite", "library", "book", "setting"];
routes.forEach((route) => {
    app.get(`/${route}`, (req, res) => {
        console.log("route:", `/${route}`);

        const htmlPath = path.resolve(
            rootPath,
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
