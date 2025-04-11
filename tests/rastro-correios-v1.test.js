import axios from 'axios';
import { beforeAll, describe, expect, test } from 'vitest';

describe('/rastro-correios/v1 (E2E)', () => {
  let requestUrl = '';

  beforeAll(async () => {
    requestUrl = `${global.SERVER_URL}/api/rastro-correios/v1`;
  });

  test('Verifica CORS', async () => {
    const response = await axios.get(`${requestUrl}/NM768198985BR`);

    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  test('Utilizando um código de rastreamento válido: NM768198985BR', async () => {
    const response = await axios.get(`${requestUrl}/NM768198985BR`);

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('codigo_rastreamento');
    expect(response.data).toHaveProperty('tipo_envio');
    expect(response.data).toHaveProperty('historico');
    expect(response.data.historico).instanceOf(Array);
  });

  test('Utilizando um código de rastreamento inexistente: NM789588459BR', async () => {
    try {
      await axios.get(`${requestUrl}/NM789588459BR`);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'TrackingError',
        message: 'Código de rastreamento não encontrado',
        type: 'not_found_error',
        errors: [
          {
            message: 'O código de rastreamento informado não foi encontrado',
            note: 'Caso o envio tenha sido recente, os dados de rastreio podem ainda não estar disponíveis. Verifique se o código está correto e tente novamente em alguns instantes.',
            service: 'tracking_not_found',
          },
        ],
      });
    }
  });

  test('Utilizando um código de rastreamento incompleto: NM7895459BR', async () => {
    try {
      await axios.get(`${requestUrl}/NM7895459BR`);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({
        name: 'TrackingError',
        message: 'Código de rastreamento inválido',
        type: 'validation_error',
        errors: [
          {
            message: 'O código de rastreamento informado é inválido',
            service: 'tracking_validation',
          },
        ],
      });
    }
  });

  test('Utilizando um código de rastreamento fora do padrão, sem prefixo e sufixo: 4576819898512', async () => {
    try {
      await axios.get(`${requestUrl}/4576819898512`);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toMatchObject({
        name: 'TrackingError',
        message: 'Código de rastreamento inválido',
        type: 'validation_error',
        errors: [
          {
            message: 'O código de rastreamento informado é inválido',
            service: 'tracking_validation',
          },
        ],
      });
    }
  });
});
