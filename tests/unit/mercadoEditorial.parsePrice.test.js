import { describe, test, expect } from 'vitest';
import { parsePrice } from '../../services/isbn/mercadoEditorial';

describe('parsePrice (MC/DC)', () => {
  test('CT1 - retorna objeto quando currency e price são válidos', () => {
    expect(parsePrice('USD', '10')).toEqual({ currency: 'USD', amount: 10 });
  });

  test('CT2 - retorna null quando currency é vazio', () => {
    expect(parsePrice('', '10')).toBeNull();
  });

  test('CT3 - retorna null quando price é vazio', () => {
    expect(parsePrice('USD', '')).toBeNull();
  });

  test('CT4 - retorna null quando currency.length === 0 (mantendo CD1 falsa)', () => {
    expect(parsePrice([], '10')).toBeNull(); // [] é truthy e length 0
  });

  test('CT5 - retorna null quando price.length === 0 (mantendo CD1 falsa)', () => {
    expect(parsePrice('USD', [])).toBeNull();
  });
});
