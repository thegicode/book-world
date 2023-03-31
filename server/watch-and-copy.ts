import path from "path";
import chokidar from "chokidar";
import fs from "fs-extra";

export const watchAndCopy = (rootPath: string, isProduction: boolean) => {
    const distType = isProduction ? "prod" : "dev";
    const appPath = path.join(rootPath, "app", "assets");
    const distPath = path.join(rootPath, distType, "assets");
    const watcher = chokidar.watch(`${appPath}/**/*`, { persistent: true });
    watcher
        .on("add", (path: string) => {
            console.log(`File ${path} has been added`);
            const destinationPath = path.replace(appPath, distPath);
            fs.copy(path, destinationPath)
                .then(() => console.log(`Copied ${path} to ${destinationPath}`))
                .catch((err) => console.error(`Error copying ${path}:`, err));
        })
        .on("change", (path: string) => {
            console.log(`File ${path} has been changed`);
            const destinationPath = path.replace(appPath, distPath);
            fs.copy(path, destinationPath)
                .then(() => console.log(`Copied ${path} to ${destinationPath}`))
                .catch((err) => console.error(`Error copying ${path}:`, err));
        });
};
