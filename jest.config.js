module.exports = {
  clearMocks: true,
  collectCoverage: true,
  testEnvironment: "node",
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
  ],
  coverageProvider: "v8",
  moduleNameMapper: {
    "@core/(.*)": "<rootDir>/src/lib/core/$1",
    "@infra/(.*)": "<rootDir>/src/lib/infra/$1",
    "@fixtures/?(.*)": "<rootDir>/fixtures/$1"
  },
  testMatch: [
    "<rootDir>/src/**/*.(test|spec).ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};