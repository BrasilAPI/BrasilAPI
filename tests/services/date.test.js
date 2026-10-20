import { describe, expect, test } from 'vitest';
import { isValidDate, parseToDate } from '@/services/date';

describe('parseToDate com strict', () => {
  test('rejeita data com texto sobrando no fim', () => {
    const date = parseToDate('2026-01-01abc', 'YYYY-MM-DD', true);

    expect(isValidDate(date)).toBe(false);
  });

  test('rejeita data inexistente', () => {
    const date = parseToDate('2026-02-30', 'YYYY-MM-DD', true);

    expect(isValidDate(date)).toBe(false);
  });
});
