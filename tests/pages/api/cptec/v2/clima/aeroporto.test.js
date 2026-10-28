import axios from 'axios';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import airportHandler from '@/pages/api/cptec/v2/clima/aeroporto/[airport]';
import { CPTEC_HTTPS_URL } from '@/services/cptec/constants';

import {
  airportXml,
  airportWithoutObservationsXml,
  requestAirport,
} from '@/tests/helpers/cptec/airport';

vi.mock('axios');

describe('GET /api/cptec/v2/clima/aeroporto/:icaoCode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each(['SBGR', 'sbgr'])(
    'retorna 200 e preserva os dados do aeroporto solicitado (%s)',
    async (code) => {
      axios.get.mockResolvedValue({ data: airportXml() });

      const response = await requestAirport(airportHandler, 'v2', code);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        codigo_icao: 'SBGR',
        pressao_atmosferica: 1013,
        vento: 0,
        direcao_vento: 0,
        condicao: 'ps',
        condicao_desc: 'Predomínio de Sol',
        temp: 0,
        umidade: 80,
        visibilidade: 10000,
        atualizado_em: expect.any(String),
      });
      expect(Number.isNaN(Date.parse(response.body.atualizado_em))).toBe(false);
      expect(response.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        '*'
      );
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${CPTEC_HTTPS_URL}/estacao/SBGR/condicoesAtuais.xml`,
        expect.objectContaining({ timeout: 10000 })
      );
    }
  );

  test.each([
    ['resposta vazia', ''],
    ['resposta sem METAR', '<erro>Aeroporto não encontrado</erro>'],
    ['METAR vazio', '<metar />'],
    ['METAR textual', '<metar>Sem dados</metar>'],
    [
      'METAR sem código ICAO',
      airportXml().replace('<codigo>SBGR</codigo>', ''),
    ],
    ['dados de outro aeroporto', airportXml('SBSP')],
    ['múltiplos registros METAR', airportXml() + airportXml('SBSP')],
    ['o XML real do CPTEC sem observações', airportWithoutObservationsXml],
    [
      'apenas medições undefined, mesmo com data válida',
      airportWithoutObservationsXml.replace(
        '00/00/0000 00:00:00',
        '15/10/2026 12:00:00'
      ),
    ],
    [
      'METAR sem data de atualização',
      airportXml().replace(
        '<atualizacao>15/10/2026 12:00:00</atualizacao>',
        ''
      ),
    ],
  ])('retorna 404 quando o provedor envia %s', async (_description, xml) => {
    axios.get.mockResolvedValue({ data: xml });

    const response = await requestAirport(airportHandler, 'v2', 'SBGR');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      name: 'AIRPORT_CONDITIONS_NOT_FOUND',
      type: 'weather_error',
      message: 'Condições meteorológicas ou aeroporto não localizados',
    });
    expect(response.setHeader).toHaveBeenCalledWith(
      'Access-Control-Allow-Origin',
      '*'
    );
  });

  test('retorna 404 para ZZZZ mesmo que o provedor envie dados de SBGR', async () => {
    axios.get.mockResolvedValue({ data: airportXml() });

    const response = await requestAirport(airportHandler, 'v2', 'ZZZZ');

    expect(response.statusCode).toBe(404);
    expect(response.body.name).toBe('AIRPORT_CONDITIONS_NOT_FOUND');
  });

  test.each([
    '',
    'undefined',
    '00/00/0000 00:00:00',
    '15/10/0000 12:00:00',
    '31/02/2026 12:00:00',
    '29/02/2026 12:00:00',
    '15/13/2026 12:00:00',
    '15/10/2026 24:00:00',
    '15/10/2026 12:60:00',
    '15/10/2026 12:00:60',
  ])('retorna 404 para uma data de observação inválida (%s)', async (date) => {
    axios.get.mockResolvedValue({
      data: airportXml().replace('15/10/2026 12:00:00', date),
    });

    const response = await requestAirport(airportHandler, 'v2', 'SBGR');

    expect(response.statusCode).toBe(404);
    expect(response.body.name).toBe('AIRPORT_CONDITIONS_NOT_FOUND');
  });

  test('aceita uma observação em 29 de fevereiro de um ano bissexto', async () => {
    axios.get.mockResolvedValue({
      data: airportXml().replace('15/10/2026 12:00:00', '29/02/2024 12:00:00'),
    });

    const response = await requestAirport(airportHandler, 'v2', 'SBGR');

    expect(response.statusCode).toBe(200);
    expect(response.body.codigo_icao).toBe('SBGR');
  });

  test('preserva o erro 500 quando a chamada ao provedor falha', async () => {
    axios.get.mockRejectedValue(new Error('timeout'));

    const response = await requestAirport(airportHandler, 'v2', 'SBGR');

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      name: 'AIRPORT_WEATHER_PREDICTIONS_INTERNAL',
      type: 'weather_error',
      message:
        'Erro ao buscar informações meteorológicas para o aeroporto informado',
    });
  });

  test.each([
    { code: 'SB' },
    { code: 'SBCDEF' },
    { code: '1234' },
    { code: 'SB!R' },
    { code: '' },
    { code: undefined },
    { code: ['SBGR'] },
  ])('retorna 400 para o código inválido $code', async ({ code }) => {
    const response = await requestAirport(airportHandler, 'v2', code);

    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('INVALID_ICAO_CODE');
    expect(axios.get).not.toHaveBeenCalled();
  });
});
