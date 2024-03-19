// const path = require("path");
// const fs = require("fs");
const esbuild = require("esbuild");
const glob = require("glob");
// const http = require("node:http");
// const { finalBuildPath } = require("./server/dist/config");

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
    };

    const context = await esbuild.context(options);
    await context.watch();

    esbuild.build(options).catch(() => process.exit(1));

    /* 
    let { host, port } = await context.serve({
        servedir: isProduction ? "app/buid" : "app/public",
    });

    const routes = [
        "",
        "search",
        "favorite",
        "library",
        "book",
        "popular",
        "setting",
    ];

    http.createServer((req, res) => {
        const options = {
            hostname: host,
            port: port,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const route = options.path === "" ? "index" : `${options.path}`;
        if (routes.includes(route.split("/")[1])) {
            const htmlPath = path.join(finalBuildPath, `/html/${route}.html`);
            fs.readFile(htmlPath, "utf8", (err, data) => {
                if (err) {
                    console.error(err);
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end(`Failed to load HTML file: ${htmlPath}`);
                    return;
                }

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
            });
        } else {
            const proxyReq = http.request(options, (proxyRes) => {
                if (proxyRes.statusCode === 404) {
                    res.writeHead(404, { "Content-Type": "text/html" });
                    res.end("<h1>A custom 404 page</h1>");
                    return;
                }

                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                proxyRes.pipe(res, { end: true });
            });

            req.pipe(proxyReq, { end: true });
        }
    }).listen(3000); */
})();
