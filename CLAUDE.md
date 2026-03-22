# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

BrasilAPI is a Next.js-based REST API deployed on Vercel that aggregates Brazilian public data (CEP, ISBN, DDD, FIPE, PIX, IBGE, etc.) into modern, low-latency endpoints. It uses Next.js `/pages/api` for serverless API routes.

## Commands

```bash
npm run dev            # Start dev server at localhost:3000
npm run build          # Production build
npm run test           # Start dev server + run full Vitest suite
npm run test:watch     # Vitest watch mode (no server startup)
npm run test:watch:services  # Vitest watch mode with dev server
npm run fix            # ESLint auto-fix
npm run commit         # Interactive conventional commit (commitizen)
```

**Run a single test file:**
```bash
npx vitest run tests/isbn-v1.test.js
```

Tests require a running server at `localhost:3000` — use `npm run test` or start the dev server separately before running `npx vitest`.

## Architecture

### Request Flow

```
HTTP Request → pages/api/{resource}/v{n}/[param].js
                    ↓
              app() middleware stack (app.js)
              [CORS → Firewall → Logger → Cache]
                    ↓
              services/{resource}/*.js
              (business logic, external API calls)
                    ↓
              JSON response or error class
```

### Key Directories

- **`pages/api/`** — Next.js API routes (serverless handlers). Each resource has versioned subdirectories (e.g., `cep/v1/`, `isbn/v1/`).
- **`services/`** — Business logic per resource. Multiple provider files per service are common (e.g., `isbn/` has `googleBooks.js`, `cbl.js`, `openLibrary.js`, `mercadoEditorial.js`).
- **`middlewares/`** — Shared middleware: `cache.js`, `errorHandler.js`, `firewall.js`, `logger.js`.
- **`errors/`** — Custom error classes (`BadRequestError`, `NotFoundError`, `InternalError`, `UnauthorizedError`) extending `BaseError`.
- **`tests/`** — E2E tests using Vitest + axios against the live dev server. Helpers in `tests/helpers/`.
- **`graphql/`** — GraphQL schema and resolvers for the `/api/graphql/v1` endpoint.

### Adding a New Endpoint

1. Create service logic in `services/{resource}/`
2. Create the route handler in `pages/api/{resource}/v1/[param].js` using the `app()` factory from `app.js`
3. Add E2E tests in `tests/{resource}-v1.test.js`

### Test Structure

Tests are E2E — they hit the real server at `global.SERVER_URL` (set to `http://localhost:3000` in `tests/helpers/server/setup.js`). Use `testCorsForRoute()` from `tests/helpers/cors.js` to test CORS behavior for a route.

```js
import axios from 'axios';
import { describe, test, expect, beforeAll } from 'vitest';
import { testCorsForRoute } from './helpers/cors';

describe('api/resource/v1 (E2E)', () => {
  let requestUrl;
  beforeAll(() => { requestUrl = `${global.SERVER_URL}/api/resource/v1`; });
  test('...', async () => { /* ... */ });
});

testCorsForRoute('/api/resource/v1/example');
```

### Constraints

- Node.js `>=20 <22`, npm `>=10`
- Pre-commit hook runs ESLint auto-fix via Husky + lint-staged
- ESLint extends airbnb + prettier; path alias `@` maps to project root
- Test timeout: 60s; file parallelism disabled in Vitest
