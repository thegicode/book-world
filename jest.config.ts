/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

// import type { Config } from "@jest/types";

// const config: Config.InitialOptions = {
export default {
    preset: "ts-jest",
    testEnvironment: "jest-environment-jsdom",
    roots: ["<rootDir>"],
    collectCoverage: true, // 커버리지 데이터 수집 활성화
    // collectCoverageFrom: [
    //     "<rootDir>/app/**/*.{ts,tsx}",
    //     "<rootDir>/server/**/*.{ts,tsx}",
    //     "!<rootDir>/app/**/*.d.ts",
    // ],
    coverageReporters: ["json", "lcov", "text", "clover"], // 커버리지 리포트 형식 지정
    coverageDirectory: "coverage", // 커버리지 리포트를 저장할 디렉토리 지정
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/scripts/$1",
        // "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    },
    transform: {
        "^.+\\.jsx?$": "babel-jest",
    },
    testMatch: ["**/__tests__/**/*.ts"],
    // setupFilesAfterEnv: ["./jest.setup.ts"],
};

// export default config;
