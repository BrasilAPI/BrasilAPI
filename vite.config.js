/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  test: {
    setupFiles: ['./tests/helpers/server/setup.js'],
    globals: false,
    fileParallelism: false,
    isolate: true,
    testTimeout: 60_000,
    hookTimeout: 30_000,
    coverage: {
      enabled: true,
      provider: 'istanbul',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './reports/coverage',
      include: [
        'services/**/*.js',
        'graphql/**/**/*.js',
        'pages/api/**/**/*.js',
      ],
      exclude: ['tests/**/**.test.js'],
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
