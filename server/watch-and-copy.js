"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchAndCopy = void 0;
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const watchAndCopy = (rootPath, isProduction) => {
    const distType = isProduction ? "prod" : "dev";
    const appPath = path_1.default.join(rootPath, "app", "assets");
    const distPath = path_1.default.join(rootPath, distType, "assets");
    const watcher = chokidar_1.default.watch(`${appPath}/**/*`, { persistent: true });
    watcher
        .on("add", (path) => {
        console.log(`File ${path} has been added`);
        const destinationPath = path.replace(appPath, distPath);
        fs_extra_1.default.copy(path, destinationPath)
            .then(() => console.log(`Copied ${path} to ${destinationPath}`))
            .catch((err) => console.error(`Error copying ${path}:`, err));
    })
        .on("change", (path) => {
        console.log(`File ${path} has been changed`);
        const destinationPath = path.replace(appPath, distPath);
        fs_extra_1.default.copy(path, destinationPath)
            .then(() => console.log(`Copied ${path} to ${destinationPath}`))
            .catch((err) => console.error(`Error copying ${path}:`, err));
    });
};
exports.watchAndCopy = watchAndCopy;
