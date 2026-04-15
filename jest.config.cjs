module.exports = {
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          target: "ES2020",
        },
      },
    ],
    "^.+\\.js$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: {
          module: "ESNext",
          target: "ES2020",
        },
      },
    ],
  },
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.test.js",
    "**/__tests__/**/*.ts?(x)",
    "**/?(*.)+(spec|test).ts?(x)",
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.cjs"],
  globalSetup: undefined,
  globalTeardown: undefined,
  testTimeout: 10000,
  forceExit: true,
  detectOpenHandles: false,
};
