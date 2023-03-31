"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.destinationPath = exports.rootPath = exports.isProduction = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const isProduction = process.env.NODE_ENV === "production";
exports.isProduction = isProduction;
const envFile = isProduction ? ".env.production" : ".env.development";
const buildType = isProduction ? "prod" : "dev";
const rootPath = path_1.default.join(__dirname, "..");
exports.rootPath = rootPath;
const destinationPath = path_1.default.join(rootPath, buildType);
exports.destinationPath = destinationPath;
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, envFile) });
const { PORT } = process.env;
exports.PORT = PORT;
