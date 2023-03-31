import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
    searchNaverBook,
    librarySearch,
    bookExist,
    usageAnalysisList,
    librarySearchByBook,
} from "./apiHandlers";
import { watchAndCopy } from "./watch-and-copy";

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
const directory = isProduction ? "prod" : "dev";
const rootPath = path.join(__dirname, "..");
const destPath = path.join(rootPath, directory);

dotenv.config({ path: path.resolve(__dirname, envFile) });
const { PORT } = process.env;

console.log("***[Server]*** isProduction: ", isProduction);

// Copy assets file
watchAndCopy(rootPath, isProduction);

app.use(express.static(destPath));

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

        const htmlPath = path.join(destPath, `/html/${route}.html`);
        fs.readFile(htmlPath, "utf8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Failed to load HTML file");
            }
            res.send(data);
        });
    });
});
