"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const watchAndCopy_1 = require("./watchAndCopy");
const apiRoutes_1 = require("./apiRoutes");
const staticRoutes_1 = require("./staticRoutes");
const app = (0, express_1.default)();
console.log("***[Server]*** isProduction: ", config_1.isProduction);
(0, watchAndCopy_1.watchAndCopy)();
app.use(express_1.default.static(config_1.destinationPath));
(0, apiRoutes_1.setApiRoutes)(app);
(0, staticRoutes_1.setupStaticRoutes)(app);
app.listen(config_1.PORT, () => {
    console.log(`Start : http://localhost:${config_1.PORT}`);
});
