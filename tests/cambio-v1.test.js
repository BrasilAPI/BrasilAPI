const axios = require('axios');

const validOutputSchemaCurrency = expect.objectContaining({
  simbolo: expect.any(String),
  nomeFormatado: expect.any(String),
  tipoMoeda: expect.any(String),
});

const validTestCurrencyArray = expect.arrayContaining([
  validOutputSchemaCurrency,
]);

const validOutputSchemaBulletins = expect.objectContaining({
  paridadeCompra: expect.any(Number),
  paridadeVenda: expect.any(Number),
  cotacaoCompra: expect.any(Number),
  cotacaoVenda: expect.any(Number),
  dataHoraCotacao: expect.any(String),
  tipoBoletim: expect.any(String),
});

const validTestBulletinsArray = expect.arrayContaining([
  validOutputSchemaBulletins,
]);

const validOutputSchemaExchange = expect.objectContaining({
  cotacaoCompra: expect.any(Number),
  cotacaoVenda: expect.any(Number),
  dataHoraCotacao: expect.any(String),
});

const validTestExchangeArray = expect.arrayContaining([
  validOutputSchemaExchange,
]);

describe('cambio v1 (E2E)', () => {
  test('GET /cambio/v1/moedas', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cambio/v1/moedas`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual(validTestCurrencyArray);
  });

  test('Buscando boletim por moeda e data', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cambio/v1/boletim?moeda=USD&dataCotacao=11-14-2023`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestBulletinsArray);
  });

  test('Buscando cotação por data', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cambio/v1/cotacao?dataCotacao=11-14-2023`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestExchangeArray);
  });
});
