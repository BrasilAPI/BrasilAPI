import { describe, expect, it } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getJsonDoc } from '@/services/getJsonDoc';

describe('spec OpenAPI completa (docs)', () => {
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

  it('servers aponta para o host com prefixo /api', () => {
    const spec = getJsonDoc();
    expect(spec.servers).toEqual([{ url: 'https://brasilapi.com.br/api' }]);
  });

  it('identidade global vem do basic_info.json, não de arquivos de endpoint', () => {
    const spec = getJsonDoc();
    expect(spec.openapi).toBe('3.0.5');
    expect(spec.info.title).toBe('Brasil API');
  });

  it('nenhum arquivo de endpoint declara chaves globais da spec', () => {
    const docsDirectory = path.join(process.cwd(), 'pages/docs/doc');
    const offenders = [];

    fs.readdirSync(docsDirectory)
      .filter((file) => file.endsWith('.json') && file !== 'basic_info.json')
      .forEach((file) => {
        const content = JSON.parse(
          fs.readFileSync(path.join(docsDirectory, file), 'utf-8')
        );
        ['openapi', 'info', 'servers'].forEach((key) => {
          if (key in content) offenders.push(`${file}: ${key}`);
        });
      });

    expect(offenders).toEqual([]);
  });

  it('todos os paths documentados são relativos ao server (sem /api embutido)', () => {
    const spec = getJsonDoc();
    const withApiPrefix = Object.keys(spec.paths || {}).filter((p) =>
      p.startsWith('/api/')
    );
    expect(withApiPrefix).toEqual([]);
  });
});
