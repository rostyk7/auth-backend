module.exports = {
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/testSetup.js',
  globalTeardown: '<rootDir>/src/testTeardown.js',
  testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)']
};