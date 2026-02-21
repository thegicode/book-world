import path from "path";
import fs from "fs-extra";
import { glob } from "glob";
import * as esbuild from "esbuild";
import * as sass from "sass";
import { minify } from "html-minifier-terser";
import { optimizeImages } from "./optimize-images";
import { generateCriticalCss } from "./critical-css";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const htmlLoaderPlugin = require("../../../esbuild-html-plugin");

const isProduction = process.env.NODE_ENV === "production";
const BASE_SRC_PATH = "app/src";
const BASE_DIST_PATH = isProduction ? "app/build" : "app/public";

const htmlConfig = {
    caseSensitive: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    noNewlinesBeforeTagClose: true,
    removeAttributeQuotes: true,
    removeComments: true,
    trimCustomFragments: true
};

async function buildHtml() {
    console.log("--- Building HTML ---");
    const srcDir = path.join(BASE_SRC_PATH, "markup");
    const distDir = path.join(BASE_DIST_PATH, "html");
    await fs.ensureDir(distDir);

    const files = await glob("**/*.html", { cwd: srcDir });
    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file);
        await fs.ensureDir(path.dirname(distPath));

        const content = await fs.readFile(srcPath, "utf-8");
        const minified = await minify(content, htmlConfig);
        await fs.writeFile(distPath, minified);
        console.log(`Minified: ${file}`);
    }
}

async function buildCss() {
    console.log("--- Building CSS ---");
    const srcDir = path.join(BASE_SRC_PATH, "scss");
    const distDir = path.join(BASE_DIST_PATH, "css");
    await fs.ensureDir(distDir);

    const files = await glob("*.scss", { cwd: srcDir });
    for (const file of files) {
        const srcPath = path.join(srcDir, file);
        const distPath = path.join(distDir, file.replace(".scss", ".css"));

        const result = sass.compile(srcPath, {
            style: isProduction ? "compressed" : "expanded",
            sourceMap: !isProduction
        });

        await fs.writeFile(distPath, result.css);
        if (result.sourceMap) {
            await fs.writeFile(`${distPath}.map`, JSON.stringify(result.sourceMap));
        }
        console.log(`Compiled: ${file}`);
    }
}

async function buildJs() {
    console.log("--- Building JS ---");
    const entryPoints = await glob(`app/src/scripts/pages/**/index.ts`);
    const outDir = isProduction ? "app/build/js" : "app/public/js";

    const options: esbuild.BuildOptions = {
        entryPoints,
        outdir: outDir,
        bundle: true,
        minify: isProduction,
        sourcemap: !isProduction,
        target: ["es2016"],
        alias: {
            "@": path.resolve(process.cwd(), "app/src/scripts"),
        },
        plugins: [htmlLoaderPlugin],
    };

    await esbuild.build(options);
    console.log("JS Build complete");
}

async function main() {
    const startTime = Date.now();
    console.log(`Starting ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} build...`);

    try {
        // 1. Clean dist directory (optional but recommended for production)
        if (isProduction) {
            await fs.emptyDir(BASE_DIST_PATH);
            console.log(`Cleaned ${BASE_DIST_PATH}`);
        }

        // 2. Parallel builds for independent assets
        await Promise.all([
            buildHtml(),
            buildCss(),
            buildJs(),
            optimizeImages()
        ]);

        // 3. Sequential build for assets that depend on others
        if (isProduction) {
            await generateCriticalCss();
        }

        const endTime = Date.now();
        console.log(`Build finished in ${((endTime - startTime) / 1000).toFixed(2)}s`);
    } catch (error) {
        console.error("Build failed:", error);
        process.exit(1);
    }
}

main();
