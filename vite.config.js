/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    setupFiles: ['./tests/helpers/server/setup.js'],
    globals: false,
    fileParallelism: false,
    isolate: false,
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
});
