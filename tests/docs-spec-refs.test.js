import { describe, expect, it } from 'vitest';
import { getJsonDoc } from '@/services/getJsonDoc';

describe('spec OpenAPI completa (docs)', () => {
  it('a URL base da API inclui o prefixo /api (issue #903)', () => {
    const spec = getJsonDoc();

    // O Redoc monta as URLs exibidas como `servers[0].url + path`. Os paths
    // documentados não têm o prefixo /api, então a URL base precisa tê-lo.
    expect(spec.servers).toEqual([{ url: 'https://brasilapi.com.br/api' }]);
  });

  it('todas as refs #/components/schemas resolvem', () => {
    const spec = getJsonDoc();
    const schemas = spec.components?.schemas || {};
    const names = Object.keys(schemas);
    expect(names.length).toBeGreaterThan(30);

    const broken = [];
    const walk = (obj) => {
      if (!obj || typeof obj !== 'object') return;
      if (typeof obj.$ref === 'string' && obj.$ref.startsWith('#/components/schemas/')) {
        const n = obj.$ref.split('/').pop();
        if (!schemas[n]) broken.push(obj.$ref);
      }
      for (const v of Object.values(obj)) walk(v);
    };
    walk(spec);
    expect(broken).toEqual([]);
  });
});
