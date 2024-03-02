import express from "express";
import { isProduction, destinationPath, PORT } from "./config";
import { watchAndCopy } from "./watchAndCopy";
import { setApiRoutes } from "./apiRoutes";
import { setupStaticRoutes } from "./staticRoutes";

const app = express();

console.log("***[Server]*** isProduction: ", isProduction);

watchAndCopy();

app.use(express.static(destinationPath));

setApiRoutes(app);
setupStaticRoutes(app);

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
