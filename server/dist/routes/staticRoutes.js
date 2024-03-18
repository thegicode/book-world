"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const staticRoutes = (app) => {
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
            const htmlPath = path_1.default.join(config_1.finalBuildPath, `/html/${fileName}.html`);
            fs_1.default.readFile(htmlPath, "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    return res
                        .status(500)
                        .send(`Failed to load HTML file: ${htmlPath}`);
                }
                res.send(data);
            });
        });
    });
};
exports.default = staticRoutes;
