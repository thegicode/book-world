import fs from "fs";
import path from "path";

const ENV_PATH = path.resolve("./server/.env.key");

export function saveApiKey(key: string) {
    const formattedKey = key.replace(/aaaaa/g, "\n");
    // This is a synchronous operation. If it fails, it will throw an exception
    // which will be caught by the asyncHandler in the controller.
    fs.writeFileSync(ENV_PATH, formattedKey);
}
