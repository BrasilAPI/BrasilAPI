import { describe, expect, test, vi } from 'vitest';
import axios from 'axios';
import { getIgpmByLastNRecords } from '@/services/indices/igpm';

vi.mock('axios');

describe('getIgpmByLastNRecords', () => {
  test('interpreta a data do BCB no formato DD/MM/YYYY', async () => {
    axios.get.mockResolvedValue({
      data: [{ data: '01/06/2026', valor: '-0.50' }],
    });

    const [igpm] = await getIgpmByLastNRecords(189, 1);
    const date = new Date(igpm.date);

    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(1);
  });
});
