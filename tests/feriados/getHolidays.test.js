import { describe, test, expect } from 'vitest';
import getHolidays from '../../services/holidays';

describe('getHolidays - feriados estaduais', () => {
  test('deve incluir pelo menos um feriado estadual quando o estado for informado', () => {
    const year = 2024;
    const state = 'SP';

    const result = getHolidays(year, state);

    // deve retornar algum feriado
    expect(result.length).toBeGreaterThan(0);

    // deve existir pelo menos um feriado estadual para o estado informado
    const hasStateHoliday = result.some(
      (holiday) => holiday.type === 'state' && holiday.state === state
    );

    expect(hasStateHoliday).toBe(true);
  });

  test('deve retornar apenas feriados nacionais quando apenas o ano é informado', () => {
    const year = 2024;

    const result = getHolidays(year);

    // deve retornar algum feriado (nacionais)
    expect(result.length).toBeGreaterThan(0);

    // não deve haver nenhum feriado estadual
    const hasStateHoliday = result.some((h) => h.type === 'state');

    expect(hasStateHoliday).toBe(false);
  });

  test('deve filtrar corretamente os feriados estaduais pelo estado informado', () => {
    const year = 2024;
    const state = 'SP';

    const result = getHolidays(year, state);

    // separa apenas os feriados estaduais
    const stateHolidays = result.filter((holiday) => holiday.type === 'state');

    // deve existir pelo menos um feriado estadual
    expect(stateHolidays.length).toBeGreaterThan(0);

    // todos os feriados estaduais devem pertencer ao estado informado
    const allBelongToState = stateHolidays.every(
      (holiday) => holiday.state === state
    );

    expect(allBelongToState).toBe(true);
  });

  test('deve lançar erro quando o estado informado for inválido', () => {
    const year = 2024;
    const state = 'XX'; // sigla inválida

    const chamarFuncao = () => {
      getHolidays(year, state);
    };

    expect(chamarFuncao).toThrowError('Estado inválido');
  });
});
