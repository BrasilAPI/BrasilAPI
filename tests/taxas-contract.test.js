import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as selic from 'selic';

import getRates from '@/pages/api/taxas/v1';
import getRate from '@/pages/api/taxas/v1/[sigla]';

// Invoke the handlers directly with a simulated provider. Middleware and HTTP
// integration remain covered by the live taxas-v1.test.js suite.
vi.mock('@/app', () => ({
  default: () => ({ get: (handler) => handler }),
}));
vi.mock('selic', () => ({
  getRatesList: vi.fn(),
  getRatesObject: vi.fn(),
}));

const rates = { selic: 14.75, cdi: 14.65, ipca: 4.83 };

function createResponse() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  selic.getRatesObject.mockResolvedValue(rates);
  selic.getRatesList.mockResolvedValue([
    { name: 'Selic', apy: rates.selic },
    { name: 'CDI', apy: rates.cdi },
    { name: 'IPCA', apy: rates.ipca },
  ]);
});

describe('Taxas v1 route contracts (without external requests)', () => {
  test('preserves the list order, names and numeric values', async () => {
    const response = createResponse();
    await getRates({}, response);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith([
      { nome: 'Selic', valor: rates.selic },
      { nome: 'CDI', valor: rates.cdi },
      { nome: 'IPCA', valor: rates.ipca },
    ]);
    expect(selic.getRatesList).toHaveBeenCalledTimes(1);
  });

  test.each(['selic', 'SELIC', 'cdi', 'CdI', 'ipca', 'IPCA'])(
    'returns the selected rate for %s',
    async (sigla) => {
      const response = createResponse();
      await getRate({ query: { sigla } }, response);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith({
        nome: sigla.toUpperCase(),
        valor: rates[sigla.toLowerCase()],
      });
      expect(selic.getRatesObject).toHaveBeenCalledTimes(1);
    }
  );

  test('rejects an unknown rate before contacting any provider', async () => {
    const response = createResponse();
    await expect(
      getRate({ query: { sigla: 'xpto' } }, response)
    ).rejects.toMatchObject({
      status: 404,
      message: 'Taxa ou Índice não encontrada.',
      name: 'NotFoundError',
      type: 'not_found',
    });
    expect(selic.getRatesObject).not.toHaveBeenCalled();
    expect(selic.getRatesList).not.toHaveBeenCalled();
    expect(response.json).not.toHaveBeenCalled();
  });

  test.each(['Request error', 'Parse error'])(
    'propagates %s from the list provider without a success response',
    async (message) => {
      const error = new Error(message);
      selic.getRatesList.mockRejectedValue(error);
      const response = createResponse();

      await expect(getRates({}, response)).rejects.toBe(error);
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
    }
  );

  test.each(['selic', 'cdi', 'ipca'])(
    'propagates a provider failure for %s without a success response',
    async (sigla) => {
      const error = new Error('Request error');
      selic.getRatesObject.mockRejectedValue(error);
      const response = createResponse();

      await expect(getRate({ query: { sigla } }, response)).rejects.toBe(error);
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
    }
  );
});
