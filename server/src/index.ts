import express from "express";
import dotenv from "dotenv";
import { isProduction, finalBuildPath, PORT } from "./config";
import watchAndCopyAssets from "./scripts/watchAndCopyAssets";
import apiRoutes from "./routes/apiRoutes";
import staticRoutes from "./routes/staticRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();

app.use(express.static(finalBuildPath));

apiRoutes(app);
staticRoutes(app);

app.use(errorHandler);

watchAndCopyAssets();

console.log("***[Server]*** isProduction: ", isProduction);

app.listen(PORT, () => {
    console.log(`Start : http://localhost:${PORT}`);
});
