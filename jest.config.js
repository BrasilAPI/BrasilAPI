module.exports = {
  roots: ['<rootDir>'],
  preset: 'ts-jest/presets/js-with-ts',
  testTimeout: 30000,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.jest.json',
    },
  },
};
