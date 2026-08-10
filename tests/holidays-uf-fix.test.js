import { describe, expect, it } from 'vitest';
import getHolidays from '@/services/holidays';

describe('getHolidays com UF (fix rota feriados)', () => {
  it('retorna feriado estadual de SP quando uf=SP', () => {
    const result = getHolidays(2026, 'SP');
    const state = result.filter((h) => h.type === 'state');
    expect(state.length).toBeGreaterThan(0);
    expect(state.every((h) => h.state === 'SP')).toBe(true);
    expect(state[0]).toEqual({
      date: '2026-01-25',
      name: 'Aniversário da Cidade de São Paulo',
      type: 'state',
      state: 'SP',
    });
  });

  it('não retorna estaduais sem UF', () => {
    const result = getHolidays(2026);
    expect(result.some((h) => h.type === 'state')).toBe(false);
  });

  it('lança erro para UF inválida', () => {
    expect(() => getHolidays(2026, 'XX')).toThrow('Estado inválido');
  });
});
