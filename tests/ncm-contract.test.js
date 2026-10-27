import { beforeEach, describe, expect, test, vi } from 'vitest';

import getAllNcmData from '@/pages/api/ncm/v1';
import getNcmByCode from '@/pages/api/ncm/v1/[code]';
import { getNcmData } from '@/services/sefaz';

// Exercise the route contracts without depending on Siscomex availability.
vi.mock('@/app', () => ({
  default: () => ({ get: (handler) => handler }),
}));
vi.mock('@/services/sefaz', () => ({ getNcmData: vi.fn() }));

const ncm = {
  codigo: '3305.10.00',
  descricao: 'Xampus',
  data_inicio: '2022-04-01',
  data_fim: '9999-12-31',
  tipo_ato: 'Res Camex',
  numero_ato: '272',
  ano_ato: '2021',
};

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  getNcmData.mockResolvedValue([ncm]);
});

describe('NCM v1 route contracts', () => {
  test.each(['localhost', '00'])(
    'returns 200 and an empty array for an unmatched search: %s',
    async (search) => {
      const response = createResponse();

      await getAllNcmData({ query: { search } }, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith([]);
    }
  );

  test('rejects an unknown exact code with the existing 404 error', async () => {
    const response = createResponse();

    await expect(
      getNcmByCode({ query: { code: '00' } }, response)
    ).rejects.toMatchObject({
      status: 404,
      message: 'Código NCM não encontrado',
      type: 'NCM_CODE_NOT_FOUND',
    });
    expect(response.json).not.toHaveBeenCalled();
  });

  test.each(['33051000', '3305.10.00'])(
    'returns the matching record for an exact code: %s',
    async (code) => {
      const response = createResponse();

      await getNcmByCode({ query: { code } }, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(ncm);
    }
  );

  test('numeric searches also match descriptions', async () => {
    const record = { ...ncm, descricao: 'Produto em embalagem de 200 kg' };
    getNcmData.mockResolvedValue([record]);
    const response = createResponse();

    await getAllNcmData({ query: { search: '00' } }, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([record]);
  });

  test.each(['Xampus', '3305'])(
    'returns matching records for a search: %s',
    async (search) => {
      const response = createResponse();

      await getAllNcmData({ query: { search } }, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith([ncm]);
    }
  );
});
