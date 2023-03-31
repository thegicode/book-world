import path from "path";
import dotenv from "dotenv";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.production" : ".env.development";
const buildType = isProduction ? "prod" : "dev";
const rootPath = path.join(__dirname, "..");
const destinationPath = path.join(rootPath, buildType);

dotenv.config({ path: path.resolve(__dirname, envFile) });
const { PORT } = process.env;

export { isProduction, rootPath, destinationPath, PORT };
