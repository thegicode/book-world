import fs from "fs";
import path from "path";
import { Application } from "express";
import { finalBuildPath } from "../config";

const staticRoutes = (app: Application) => {
    const routes = [
        "",
        "search",
        "favorite",
        "library",
        "book",
        "popular",
        "setting",
    ];

    routes.forEach((route) => {
        app.get(`/${route}`, (req, res) => {
            const fileName = route === "" ? "index" : route;
            const htmlPath = path.join(
                finalBuildPath,
                `/html/${fileName}.html`
            );

            fs.readFile(htmlPath, "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .send("Failed to load HTML file: ", htmlPath);
                }
                res.send(data);
            });
        });
    });
};

export default staticRoutes;
