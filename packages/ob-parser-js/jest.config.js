module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: [
    "src/**/*.ts",
    
  ],
  coveragePathIgnorePatterns: [
    "src/parser/mysql/format/*",
    "src/parser/oracle/format/*"
  ],
  moduleFileExtensions: [
    'ts', // 增加 ts、tsx，以支持单测文件中引入 typescript 模块
    'tsx',
    'js',
    'jsx',
    'json',
  ],
  moduleNameMapper: {
    '^assets/(.*)$': '<rootDir>/assets/$1',
  },
};