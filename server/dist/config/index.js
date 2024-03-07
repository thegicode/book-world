"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORT = exports.finalBuildPath = exports.rootDirectoryPath = exports.isProduction = exports.buildDirectory = void 0;
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const isProduction = process.env.NODE_ENV === "production";
exports.isProduction = isProduction;
const envFilePath = isProduction
    ? "./server/.env.production"
    : "./server/.env.development";
const envKeyPath = "./server/.env.key";
const buildDirectory = isProduction ? "app/build" : "app/public";
exports.buildDirectory = buildDirectory;
const rootDirectoryPath = path_1.default.join(__dirname, "../../../");
exports.rootDirectoryPath = rootDirectoryPath;
const finalBuildPath = path_1.default.join(rootDirectoryPath, buildDirectory);
exports.finalBuildPath = finalBuildPath;
dotenv_1.default.config({ path: path_1.default.resolve(rootDirectoryPath, envFilePath) });
dotenv_1.default.config({ path: path_1.default.resolve(rootDirectoryPath, envKeyPath) });
const { PORT } = process.env;
exports.PORT = PORT;
