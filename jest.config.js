module.exports = {
  testTimeout: 30000,
  testEnvironment: 'node',
  globals: {
    SERVER_URL: 'http://localhost:3000',
  },
  globalSetup: './tests/helpers/server/setup',
  globalTeardown: './tests/helpers/server/teardown',
};
