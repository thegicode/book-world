"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveApiKey = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ENV_PATH = path_1.default.resolve("./server/.env.key");
function saveApiKey(key) {
    const formattedKey = key.replace(/aaaaa/g, "\n");
    fs_1.default.writeFileSync(ENV_PATH, formattedKey);
}
exports.saveApiKey = saveApiKey;
