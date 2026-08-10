import axios from 'axios';
import { describe, expect, it } from 'vitest';
import { getUfEstimatePopulationByCode } from '@/services/ibge/gov';

// Smart service availability check (IBGE bloqueia os runners do GH Actions)
let shouldSkipTests = false;

try {
  const response = await axios.get(
    'https://servicodados.ibge.gov.br/api/v3/agregados/6579/periodos/-1/variaveis?localidades=N3%5B35%5D',
    { timeout: 5000 }
  );
  if (response.status !== 200) {
    shouldSkipTests = true;
  }
} catch (error) {
  shouldSkipTests = true;
}

describe.skipIf(shouldSkipTests)('getUfEstimatePopulationByCode (fix #877 === bug)', () => {
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
