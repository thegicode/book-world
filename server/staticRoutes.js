"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupStaticRoutes = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const setupStaticRoutes = (app) => {
    const routes = ["search", "favorite", "library", "book", "setting"];
    routes.forEach((route) => {
        app.get(`/${route}`, (req, res) => {
            const htmlPath = path_1.default.join(config_1.destinationPath, `/html/${route}.html`);
            fs_1.default.readFile(htmlPath, "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Failed to load HTML file");
                }
                res.send(data);
            });
        });
    });
};
exports.setupStaticRoutes = setupStaticRoutes;
