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

  test('Carnaval e Corpus Christi são pontos facultativos; Páscoa e Sexta-feira Santa seguem nacionais (Lei 9.093/1995)', () => {
    const year = 2024;

    const result = getHolidays(year);

    const carnaval = result.filter((holiday) => holiday.name === 'Carnaval');
    const corpusChristi = result.find(
      (holiday) => holiday.name === 'Corpus Christi'
    );
    const pascoa = result.find((holiday) => holiday.name === 'Páscoa');
    const sextaSanta = result.find(
      (holiday) => holiday.name === 'Sexta-feira Santa'
    );

    // Carnaval são dois dias (segunda e terça) e ambos são facultativos
    expect(carnaval).toHaveLength(2);
    expect(carnaval.every((holiday) => holiday.type === 'facultative')).toBe(
      true
    );

    expect(corpusChristi).toBeDefined();
    expect(corpusChristi.type).toBe('facultative');

    // Páscoa e Sexta-feira Santa permanecem nacionais
    expect(pascoa.type).toBe('national');
    expect(sextaSanta.type).toBe('national');
  });
});
