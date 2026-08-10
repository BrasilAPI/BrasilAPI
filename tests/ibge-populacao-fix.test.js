import { describe, expect, it } from 'vitest';
import { getUfEstimatePopulationByCode } from '@/services/ibge/gov';

describe('getUfEstimatePopulationByCode (fix #877 === bug)', () => {
  it('encontra a variável com id string vindo do IBGE', async () => {
    const result = await getUfEstimatePopulationByCode('35');
    expect(result).toHaveProperty('populacao_estimada');
    expect(typeof result.populacao_estimada).toBe('number');
    expect(result).toHaveProperty('periodo');
  });

  it('aceita sigla (SP)', async () => {
    const result = await getUfEstimatePopulationByCode('SP');
    expect(typeof result.populacao_estimada).toBe('number');
  });
});
