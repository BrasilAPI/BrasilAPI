module.exports = {
  testTimeout: 30000,
  globals: {
    SERVER_URL: 'http://localhost:3000',
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>//reports//coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'services/**/*.js',
    'graphql/**/**/*.js',
    'pages/api/**/**/*.js',
    '!tests/**/**.test.js',
  ],
  globalSetup: './tests/helpers/server/setup',
  globalTeardown: './tests/helpers/server/teardown',
  testEnvironment: 'node',
};
