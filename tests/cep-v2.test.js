const axios = require('axios');

describe('/cep/v2 (E2E)', () => {
  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/05010002`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
      location: {
        type: 'Point',
        coordinates: {
          longitude: expect.any(String),
          latitude: expect.any(String),
        },
      },
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/00000000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        name: 'CepPromiseError',
        message: 'Todos os serviços de CEP retornaram erro.',
        type: 'service_error',
      });
    }
  });

  test('Utilizando um CEP inválido: 999999999999999', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/999999999999999`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'CepPromiseError',
        message: 'CEP deve conter exatamente 8 caracteres.',
        type: 'validation_error',
        errors: [
          {
            message: 'CEP informado possui mais do que 8 caracteres.',
            service: 'cep_validation',
          },
        ],
      });
    }
  });

  test('Deve retornar as coordenadas -22.883892 e -43.3061123', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v2/20751120`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '20751120',
      state: 'RJ',
      city: 'Rio de Janeiro',
      neighborhood: 'Piedade',
      street: 'Rua Marcolino',
      service: expect.any(String),
      location: {
        type: 'Point',
        coordinates: {
          longitude: '-43.3061123',
          latitude: '-22.883892',
        },
      },
    });
  });
});
