import { describe, expect, it } from 'vitest';
import { listElectionYears } from '@/services/eleicoes';

describe('Anos Eleitorais Válidos', () => {
  it('deve retornar um array de anos eleitorais', async () => {
    const mockResponse = {
      data: [2024, 2022, 2020, 2018, 2016, 2014, 2012, 2010, 2008, 2006, 2004],
    };
    const response = await listElectionYears();

    expect(response).toEqual(mockResponse.data);
  });
});
