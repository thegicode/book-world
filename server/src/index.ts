import express from "express";
import { isProduction, finalBuildPath, PORT } from "./config";
import { watchAndCopy } from "./watchAndCopy";
import { setApiRoutes } from "./routes/apiRoutes";
import { setStaticRoutes } from "./routes/staticRoutes";

const app = express();

console.log("***[Server]*** isProduction: ", isProduction);

watchAndCopy();

app.use(express.static(finalBuildPath));

setApiRoutes(app);
setStaticRoutes(app);

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
