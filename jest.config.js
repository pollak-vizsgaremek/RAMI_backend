export default{
    testEnvironment: "node",
    transform: {
        "^.+\\.ts$": ["ts-jest", {
            useESM: true,
            tsconfig: {
                module: "esnext",
                target: "es2020"
            }
        }]
    },
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    }
}