const axios = require('axios');

const { invalidResponse } = require('./helpers/ddd');

const requestUrl = `${global.SERVER_URL}/api/ddd/v1`;

const validResponse = [
  {
    "state": "DF",
    "cities": [
      "BRASÍLIA"
    ]
  },
  {
    "state": "GO",
    "cities": [
      "VILA BOA",
      "VALPARAÍSO DE GOIÁS",
      "SANTO ANTÔNIO DO DESCOBERTO",
      "PLANALTINA",
      "PADRE BERNARDO",
      "NOVO GAMA",
      "LUZIÂNIA",
      "FORMOSA",
      "CRISTALINA",
      "CIDADE OCIDENTAL",
      "CABECEIRAS",
      "ÁGUAS LINDAS DE GOIÁS"
    ]
  }
];

describe('api/ddd/v2 (E2E)', () => {
  test('Utilizando um DDD válido: 61', async () => {
    const response = await axios.get(`${requestUrl}/61`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data).toEqual(validResponse);
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    try {
      await axios.get(`${requestUrl}/01`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual(invalidResponse);
    }
  });
});
