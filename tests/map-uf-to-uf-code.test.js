import { describe, expect, it } from 'vitest';

import mapUfToUfCode from '../util/mapUfToUfCode';

describe('mapUfToUfCode()', () => {
  it('maps UF initials to IBGE state code', () => {
    expect(mapUfToUfCode('PI')).toBe(22);
  });

  it('keeps valid numeric IBGE state codes unchanged', () => {
    expect(mapUfToUfCode('22')).toBe(22);
  });

  it('rejects unknown numeric IBGE state codes', () => {
    expect(() => mapUfToUfCode('99')).toThrowError(
      expect.objectContaining({
        name: 'NotFoundError',
        status: 404,
        type: 'not_found',
      })
    );
  });
});
