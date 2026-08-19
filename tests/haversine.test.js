import { describe, expect, test } from 'vitest';

import haversine from '@/util/haversine';

const SAO_PAULO = { latitude: -23.5505, longitude: -46.6333 };
const RIO = { latitude: -22.9068, longitude: -43.1729 };

describe('haversine', () => {
  test('São Paulo → Rio de Janeiro fica na casa dos 360 km', () => {
    const metros = haversine(SAO_PAULO, RIO);

    expect(metros).toBeGreaterThan(355_000);
    expect(metros).toBeLessThan(367_000);
  });

  test('distância de um ponto a ele mesmo é zero', () => {
    expect(haversine(SAO_PAULO, SAO_PAULO)).toBe(0);
  });

  test('é simétrica', () => {
    expect(haversine(SAO_PAULO, RIO)).toBeCloseTo(haversine(RIO, SAO_PAULO));
  });
});
