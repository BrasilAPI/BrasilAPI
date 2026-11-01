import { afterEach, describe, expect, test } from 'vitest';

import { getEasterHolidays } from '@/services/holidays';

describe('getEasterHolidays independe do timezone do servidor', () => {
  const originalTz = process.env.TZ;

  afterEach(() => {
    process.env.TZ = originalTz;
  });

  test('Páscoa 2025 deve cair em 20-04-2025 (domingo) com servidor em UTC+9', () => {
    process.env.TZ = 'Asia/Tokyo';

    const holidays = getEasterHolidays(2025);
    const easter = holidays.find((holiday) => holiday.name === 'Páscoa');

    expect(easter.date).toBe('2025-04-20');
    expect(easter.weekday).toBe('domingo');
  });

  test('Sexta-feira Santa 2025 deve cair em 18-04-2025 com servidor em UTC-3', () => {
    process.env.TZ = 'America/Sao_Paulo';

    const holidays = getEasterHolidays(2025);
    const goodFriday = holidays.find(
      (holiday) => holiday.name === 'Sexta-feira Santa'
    );

    expect(goodFriday.date).toBe('2025-04-18');
    expect(goodFriday.weekday).toBe('sexta-feira');
  });

  test('Carnaval 2025 deve cair em 03-03 e 04-03-2025 com servidor em UTC+9', () => {
    process.env.TZ = 'Asia/Tokyo';

    const holidays = getEasterHolidays(2025);
    const carnavalDates = holidays
      .filter((holiday) => holiday.name === 'Carnaval')
      .map((holiday) => holiday.date);

    expect(carnavalDates).toEqual(['2025-03-03', '2025-03-04']);
  });
});
