"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchAndCopy = void 0;
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_1 = require("./config");
const watchAndCopy = () => {
    const buildType = config_1.isProduction ? "prod" : "dev";
    const assetSrcPath = path_1.default.join(config_1.rootPath, "app", "assets");
    const assetDistPath = path_1.default.join(config_1.rootPath, buildType, "assets");
    const watcher = chokidar_1.default.watch(`${assetSrcPath}/**/*`, {
        persistent: true,
    });
    const copyFile = (path) => {
        const destinationPath = path.replace(assetSrcPath, assetDistPath);
        fs_extra_1.default.copy(path, destinationPath)
            .then(() => console.log(`Copied ${path} to ${destinationPath}`))
            .catch((err) => console.error(`Error copying ${path}:`, err));
    };
    watcher
        .on("add", (path) => {
        console.log(`File ${path} has been added`);
        copyFile(path);
    })
        .on("change", (path) => {
        console.log(`File ${path} has been changed`);
        copyFile(path);
    });
};
exports.watchAndCopy = watchAndCopy;
