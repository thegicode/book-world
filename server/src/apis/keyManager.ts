import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const ENV_PATH = path.resolve("./server/.env.key");

export function saveRegistrationKey(req: Request, res: Response) {
    try {
        const key = (req.query.key as string).replace(/aaaaa/g, "\n");
        fs.writeFileSync(ENV_PATH, key);

        res.send(true);
    } catch (error) {
        res.send(false);
        console.error(`Fail to read file, ${error}`);
    }
}
