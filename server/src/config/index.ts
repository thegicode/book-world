import path from "path";
import dotenv from "dotenv";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction
    ? "../../.env.production"
    : "../../.env.development";
const buildPath = isProduction ? "app/build" : "app/public";
const rootPath = path.join(__dirname, "../../../");
const destinationPath = path.join(rootPath, buildPath);

dotenv.config({ path: path.resolve(__dirname, envFile) });
dotenv.config({ path: path.resolve(__dirname, "../../.env.key") });

const { PORT } = process.env;

export { buildPath, isProduction, rootPath, destinationPath, PORT };
