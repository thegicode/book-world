"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const watchAndCopyAssets_1 = __importDefault(require("./scripts/watchAndCopyAssets"));
const apiRoutes_1 = __importDefault(require("./routes/apiRoutes"));
const staticRoutes_1 = __importDefault(require("./routes/staticRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.static(config_1.finalBuildPath));
(0, apiRoutes_1.default)(app);
(0, staticRoutes_1.default)(app);
(0, watchAndCopyAssets_1.default)();
console.log("***[Server]*** isProduction: ", config_1.isProduction);
app.listen(config_1.PORT, () => {
    console.log(`Start : http://localhost:${config_1.PORT}`);
});
