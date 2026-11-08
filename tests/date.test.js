import { describe, expect, it } from 'vitest';
import { parseToDate, toISOString } from '@/services/date';

describe('services/date', () => {
  describe('parseToDate', () => {
    it('respeita o formato DD/MM/YYYY ao invés do formato nativo do Date', () => {
      const date = parseToDate('01/06/1989', 'DD/MM/YYYY');

      expect(date.getFullYear()).toBe(1989);
      expect(date.getMonth()).toBe(5); // junho (0-indexado)
      expect(date.getDate()).toBe(1);
    });

    it('continua aceitando YYYY-MM-DD', () => {
      const date = parseToDate('1989-06-01', 'YYYY-MM-DD');

      expect(date.getFullYear()).toBe(1989);
      expect(date.getMonth()).toBe(5);
      expect(date.getDate()).toBe(1);
    });
  });

  describe('toISOString', () => {
    it('converte DD/MM/YYYY sem trocar dia e mês', () => {
      const iso = toISOString('01/06/1989', 'DD/MM/YYYY');

      expect(iso.slice(0, 10)).toBe('1989-06-01');
    });
  });
});
