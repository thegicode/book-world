import path from "path";
import chokidar from "chokidar";
import fs from "fs-extra";
import { rootPath, isProduction } from "./config";

export const watchAndCopy = () => {
    const buildType = isProduction ? "prod" : "dev";
    const assetSrcPath = path.join(rootPath, "app", "assets");
    const assetDistPath = path.join(rootPath, buildType, "assets");
    const watcher = chokidar.watch(`${assetSrcPath}/**/*`, {
        persistent: true,
    });
    const copyFile = (path: string) => {
        const destinationPath = path.replace(assetSrcPath, assetDistPath);
        fs.copy(path, destinationPath)
            .then(() => console.log(`Copied ${path} to ${destinationPath}`))
            .catch((err) => console.error(`Error copying ${path}:`, err));
    };
    watcher
        .on("add", (path: string) => {
            console.log(`File ${path} has been added`);
            copyFile(path);
        })
        .on("change", (path: string) => {
            console.log(`File ${path} has been changed`);
            copyFile(path);
        });
};
