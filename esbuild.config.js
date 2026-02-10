const esbuild = require("esbuild");
const glob = require("glob");
const htmlLoaderPlugin = require("./esbuild-html-plugin");

(async () => {
    const isProduction = process.env.NODE_ENV === "production";

    const entryPoints = glob.sync(`app/src/scripts/pages/**/index.ts`);

    const outDir = isProduction ? "app/build/js" : "app/public/js";

    const options = {
        entryPoints: entryPoints,
        outdir: outDir,
        bundle: true,
        minify: isProduction,
        sourcemap: !isProduction,
        target: ["es2016"],
        plugins: [htmlLoaderPlugin],
    };

    const context = await esbuild.context(options);
    await context.watch();

    esbuild.build(options).catch(() => process.exit(1));
})();
