/// <reference types="vitest" />
import { defineConfig } from 'vite';
import path from 'node:path';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '.'); // raiz do repo

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${ROOT}/`, // ajuste para 'src' se o alias apontar pra src
      // '@/': path.resolve(ROOT, 'src') + '/',
    },
  },
  test: {
    environment: 'node',
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
