import axios from 'axios';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  clearDddsDataCache,
  DDD_DATA_CACHE_TTL,
  DDD_DATA_TIMEOUT,
  findDddByCity,
  getDddsData,
  normalizeCityName,
} from '@/services/ddd';

vi.mock('axios');

const CSV_LINES = [
  'Código IBGE;UF;MUNICiPIO;CoDIGO_NACIONAL',
  '3550308;SP;SÃO PAULO;11',
  '3530706;SP;MOGI-GUAÇU;19',
  "3545803;SP;SANTA BÁRBARA D'OESTE;19",
  '2507507;PB;JOÃO PESSOA;83',
  '5300108;DF;BRASÍLIA;61',
  '',
];

// O CSV da Anatel é servido em latin1; o serviço lê a resposta como 'binary'.
const CSV_BUFFER = Buffer.from(CSV_LINES.join('\r\n'), 'latin1');

const DDDS_DATA = [
  { ibgeCode: '3550308', state: 'SP', city: 'SÃO PAULO', ddd: '11' },
  { ibgeCode: '3530706', state: 'SP', city: 'MOGI-GUAÇU', ddd: '19' },
  {
    ibgeCode: '3545803',
    state: 'SP',
    city: "SANTA BÁRBARA D'OESTE",
    ddd: '19',
  },
  { ibgeCode: '2507507', state: 'PB', city: 'JOÃO PESSOA', ddd: '83' },
  { ibgeCode: '', state: undefined, city: undefined, ddd: undefined },
];

describe('normalizeCityName', () => {
  test('remove acentos, normaliza caixa, hífens, apóstrofos e espaços', () => {
    expect(normalizeCityName('  Mogi-Guaçu ')).toBe('MOGI GUACU');
    expect(normalizeCityName("Santa Bárbara d'Oeste")).toBe(
      'SANTA BARBARA D OESTE'
    );
    expect(normalizeCityName('São   Paulo')).toBe('SAO PAULO');
  });
});

describe('findDddByCity', () => {
  test('encontra o DDD pelo código IBGE', () => {
    expect(findDddByCity(DDDS_DATA, { ibgeCode: '3550308' })).toBe('11');
  });

  test('aceita código IBGE numérico', () => {
    expect(findDddByCity(DDDS_DATA, { ibgeCode: 2507507 })).toBe('83');
  });

  test('prioriza o código IBGE sobre o nome', () => {
    expect(
      findDddByCity(DDDS_DATA, {
        ibgeCode: '2507507',
        state: 'SP',
        city: 'São Paulo',
      })
    ).toBe('83');
  });

  test('usa UF + nome quando o código IBGE é nulo', () => {
    expect(
      findDddByCity(DDDS_DATA, {
        ibgeCode: null,
        state: 'sp',
        city: 'São Paulo',
      })
    ).toBe('11');
  });

  test('fallback por nome trata acentos, caixa, hífens e apóstrofos', () => {
    expect(findDddByCity(DDDS_DATA, { state: 'SP', city: 'Mogi Guaçu' })).toBe(
      '19'
    );
    expect(
      findDddByCity(DDDS_DATA, {
        ibgeCode: null,
        state: 'SP',
        city: "Santa Bárbara d'Oeste",
      })
    ).toBe('19');
    expect(findDddByCity(DDDS_DATA, { state: 'pb', city: 'joao pessoa' })).toBe(
      '83'
    );
  });

  test('não casa município com mesmo nome em outra UF', () => {
    expect(
      findDddByCity(DDDS_DATA, {
        ibgeCode: null,
        state: 'RJ',
        city: 'São Paulo',
      })
    ).toBeNull();
  });

  test('retorna null quando não há correspondência', () => {
    expect(findDddByCity(DDDS_DATA, { ibgeCode: '9999999' })).toBeNull();
    expect(
      findDddByCity(DDDS_DATA, { state: 'SP', city: 'Cidade Inexistente' })
    ).toBeNull();
  });

  test('retorna null com código IBGE nulo e cidade ausente', () => {
    expect(
      findDddByCity(DDDS_DATA, { ibgeCode: null, state: 'SP', city: null })
    ).toBeNull();
    expect(findDddByCity(DDDS_DATA, { ibgeCode: null })).toBeNull();
    expect(findDddByCity(DDDS_DATA, {})).toBeNull();
  });

  test('retorna null quando os dados não estão disponíveis', () => {
    expect(findDddByCity(null, { ibgeCode: '3550308' })).toBeNull();
  });
});

describe('getDddsData', () => {
  beforeEach(() => {
    clearDddsDataCache();
    axios.mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('envia timeout ao axios e mantém o formato de retorno', async () => {
    axios.mockResolvedValue({ data: CSV_BUFFER });

    const data = await getDddsData();

    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'get',
        responseEncoding: 'binary',
        timeout: DDD_DATA_TIMEOUT,
      })
    );
    expect(DDD_DATA_TIMEOUT).toBe(3000);
    expect(data[0]).toEqual({
      ibgeCode: '3550308',
      state: 'SP',
      city: 'SÃO PAULO',
      ddd: '11',
    });
    expect(data[1].city).toBe('MOGI-GUAÇU');
    expect(findDddByCity(data, { state: 'DF', city: 'Brasília' })).toBe('61');
  });

  test('usa o cache em memória na segunda chamada', async () => {
    axios.mockResolvedValue({ data: CSV_BUFFER });

    const first = await getDddsData();
    const second = await getDddsData();

    expect(axios).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  test('compartilha a mesma requisição entre chamadas concorrentes', async () => {
    axios.mockResolvedValue({ data: CSV_BUFFER });

    const [first, second] = await Promise.all([getDddsData(), getDddsData()]);

    expect(axios).toHaveBeenCalledTimes(1);
    expect(second).toBe(first);
  });

  test('busca novamente após expirar o TTL', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    axios.mockResolvedValue({ data: CSV_BUFFER });

    await getDddsData();
    vi.setSystemTime(Date.now() + DDD_DATA_CACHE_TTL + 1);
    await getDddsData();

    expect(axios).toHaveBeenCalledTimes(2);
  });

  test('não armazena falhas em cache', async () => {
    axios
      .mockRejectedValueOnce(
        Object.assign(new Error('timeout'), { code: 'ECONNABORTED' })
      )
      .mockResolvedValueOnce({ data: CSV_BUFFER });

    await expect(getDddsData()).rejects.toThrow('timeout');

    const data = await getDddsData();

    expect(axios).toHaveBeenCalledTimes(2);
    expect(data[0].ddd).toBe('11');
  });
});
