import fs from "fs";
import path from "path";
import { Application } from "express";
import { destinationPath } from "./config";

export const setupStaticRoutes = (app: Application) => {
    const routes = ["search", "favorite", "library", "book", "setting"];
    routes.forEach((route) => {
        app.get(`/${route}`, (req, res) => {
            const htmlPath = path.join(destinationPath, `/html/${route}.html`);
            fs.readFile(htmlPath, "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Failed to load HTML file");
                }
                res.send(data);
            });
        });
    });
};
