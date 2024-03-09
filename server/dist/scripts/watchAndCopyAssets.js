"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const chokidar_1 = __importDefault(require("chokidar"));
const fs_1 = __importDefault(require("fs"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const config_1 = require("../config");
const watchAndCopyAssets = () => {
    const assetsSrcPath = path_1.default.join(config_1.rootDirectoryPath, "app/src", "assets");
    const assetsDistPath = path_1.default.join(config_1.rootDirectoryPath, config_1.buildDirectory, "assets");
    const watcher = chokidar_1.default.watch(`${assetsSrcPath}/**/*`, {
        ignored: /\.DS_Store$/,
        persistent: true,
    });
    const copyFile = (srcPath) => {
        const targetPath = srcPath.replace(assetsSrcPath, assetsDistPath);
        fs_extra_1.default
            .copy(srcPath, targetPath)
            .then(() => console.log(`Copied ${srcPath} to ${targetPath}`))
            .catch((err) => console.error(`Error copying ${srcPath}:`, err));
    };
    const removeFile = (srcPath) => {
        const targetPath = srcPath.replace(assetsSrcPath, assetsDistPath);
        fs_1.default.unlink(targetPath, (err) => {
            if (err) {
                console.error(`Error while deleting the file: ${err.message}`);
                return;
            }
            console.log(`File ${targetPath} deleted successfully`);
        });
    };
    watcher
        .on("add", (path) => {
        console.log(`File ${path} has been added`);
        copyFile(path);
    })
        .on("change", (path) => {
        console.log(`File ${path} has been changed`);
        copyFile(path);
    })
        .on("unlink", (path) => {
        console.log(`File ${path} has been removed`);
        removeFile(path);
    });
};
exports.default = watchAndCopyAssets;
