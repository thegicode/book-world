"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRegistrationKey = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ENV_PATH = path_1.default.resolve("./server/.env.key");
function saveRegistrationKey(req, res) {
    try {
        const key = req.query.key.replace(/aaaaa/g, "\n");
        fs_1.default.writeFileSync(ENV_PATH, key);
        res.send(true);
    }
    catch (error) {
        res.send(false);
        console.error(`Fail to read file, ${error}`);
    }
}
exports.saveRegistrationKey = saveRegistrationKey;
