import express from "express";
import { isProduction, destinationPath, PORT } from "./config";
import { watchAndCopy } from "./watchAndCopy";
import { setApiRoutes } from "./routes/apiRoutes";
import { setStaticRoutes } from "./routes/staticRoutes";

const app = express();

console.log("***[Server]*** isProduction: ", isProduction);

watchAndCopy();

app.use(express.static(destinationPath));

setApiRoutes(app);
setStaticRoutes(app);

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
