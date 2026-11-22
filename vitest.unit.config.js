/// <reference types="vitest" />
import { defineConfig } from 'vite';

import baseConfig from './vite.config';

// Testes unitários (sem servidor): não usa o setup que aguarda o Next.js em
// localhost:3000. Use com `npm run test:unit`.
export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    setupFiles: [],
    include: ['tests/services/**/*.test.js', 'tests/pages/**/*.test.js'],
    coverage: { ...baseConfig.test.coverage, enabled: false },
  },
});
