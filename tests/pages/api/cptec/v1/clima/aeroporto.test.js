import axios from 'axios';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import airportHandler from '@/pages/api/cptec/v1/clima/aeroporto/[airport]';
import {
  airportXml,
  airportWithoutObservationsXml,
  requestAirport,
} from '@/tests/helpers/cptec/airport';

vi.mock('axios');

describe('Compatibilidade de GET /api/cptec/v1/clima/aeroporto/:icaoCode', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test.each(['', '<erro>Sem dados</erro>', '<metar />'])(
    'preserva o HTTP 200 com array vazio quando não há METAR (%s)',
    async (xml) => {
      axios.get.mockResolvedValue({ data: xml });

      const response = await requestAirport(airportHandler, 'v1', 'SBGR');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    }
  );

  test.each(['SBGR', 'SBSP'])(
    'preserva os dados retornados pelo provedor, inclusive outro ICAO (%s)',
    async (code) => {
      axios.get.mockResolvedValue({ data: airportXml(code) });

      const response = await requestAirport(airportHandler, 'v1', 'SBGR');

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        codigo_icao: code,
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
      expect(response.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Origin',
        '*'
      );
    }
  );

  test.each(['<metar>Sem dados</metar>', airportXml() + airportXml('SBSP')])(
    'preserva o HTTP 500 quando a formatação do METAR falha (%s)',
    async (xml) => {
      axios.get.mockResolvedValue({ data: xml });

      const response = await requestAirport(airportHandler, 'v1', 'SBGR');

      expect(response.statusCode).toBe(500);
      expect(response.body.name).toBe('AIRPORT_WEATHER_PREDICTIONS_INTERNAL');
    }
  );

  test('preserva a validação apenas por comprimento da v1', async () => {
    axios.get.mockResolvedValue({ data: airportXml('1234') });

    const response = await requestAirport(airportHandler, 'v1', '1234');

    expect(response.statusCode).toBe(200);
    expect(response.body.codigo_icao).toBe(1234);
  });

  test('preserva a resposta original para o XML real sem observações', async () => {
    axios.get.mockResolvedValue({ data: airportWithoutObservationsXml });

    const response = await requestAirport(airportHandler, 'v1', 'SBGR');

    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({
      codigo_icao: 'SBGR',
      temp: 'undefined',
      pressao_atmosferica: 'undefined',
    });
  });

  test('preserva o HTTP 400 para códigos com comprimento inválido', async () => {
    const response = await requestAirport(airportHandler, 'v1', 'SB');

    expect(response.statusCode).toBe(400);
    expect(response.body.name).toBe('INVALID_ICAO_CODE');
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('preserva o HTTP 500 quando o provedor falha', async () => {
    axios.get.mockRejectedValue(new Error('timeout'));

    const response = await requestAirport(airportHandler, 'v1', 'SBGR');

    expect(response.statusCode).toBe(500);
    expect(response.body.name).toBe('AIRPORT_WEATHER_PREDICTIONS_INTERNAL');
  });
});
