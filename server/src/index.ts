import express from "express";
import { isProduction, finalBuildPath, PORT } from "./config";
import { watchAndCopy } from "./watchAndCopy";
import apiRoutes from "./routes/apiRoutes";
import staticRoutes from "./routes/staticRoutes";

const app = express();

app.use(express.static(finalBuildPath));

apiRoutes(app);
staticRoutes(app);

watchAndCopy();

console.log("***[Server]*** isProduction: ", isProduction);

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
