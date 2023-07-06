import express from "express";
import { isProduction, destinationPath, PORT } from "./config";
import { watchAndCopy } from "./watchAndCopy";
import { setupApiRoutes } from "./apiRoutes";
import { setupStaticRoutes } from "./staticRoutes";

const app = express();

console.log("***[Server]*** isProduction: ", isProduction);

watchAndCopy();

app.use(express.static(destinationPath));

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});

setupApiRoutes(app);
setupStaticRoutes(app);
