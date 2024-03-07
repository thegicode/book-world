import path from "path";
import dotenv from "dotenv";

// NODE_ENV 값을 기반으로 실행 환경 확인
const isProduction = process.env.NODE_ENV === "production";

// 환경별 .env 파일 경로 설정
const envFilePath = isProduction
    ? "./server/.env.production"
    : "./server/.env.development";

// 공통 .env.key 파일 경로 설정
const envKeyPath = "./server/.env.key";

// 빌드 경로 설정
const buildDirectory = isProduction ? "app/build" : "app/public";

// 프로젝트 루트 경로 설정
const rootDirectoryPath = path.join(__dirname, "../../../");

// 최종 빌드 경로 생성
const finalBuildPath = path.join(rootDirectoryPath, buildDirectory);

// 환경변수 파일 로드
dotenv.config({ path: path.resolve(rootDirectoryPath, envFilePath) });
dotenv.config({ path: path.resolve(rootDirectoryPath, envKeyPath) });

const { PORT } = process.env;

export {
    buildDirectory,
    isProduction,
    rootDirectoryPath,
    finalBuildPath,
    PORT,
};
