import { describe, it, expect } from 'vitest';

import { isValidIsbn } from '../services/isbn/tools';

describe('isValidIsbn()', () => {
  it('CT1 — Tamanho inválido (11 dígitos) → false', () => {
    const isbn = '12345678901'; // 11 dígitos
    expect(isValidIsbn(isbn)).toBe(false);
  });

  it('CT2 — Tamanho válido (ISBN-10) e dentro do padrão → true', () => {
    const isbn = '8535902775'
    expect(isValidIsbn(isbn)).toBe(true);
  });

  it('CT3 — Tamanho válido (ISBN-13) e dentro do padrão → true', () => {
    const isbn = '9788571537415'; 
    expect(isValidIsbn(isbn)).toBe(true);
  });

  it('CT4 — Fora do padrão ISBN (formato aceito, mas regex rejeita) → false', () => {
    const isbn = '2222222222';
    expect(isValidIsbn(isbn)).toBe(false);
  });
});
