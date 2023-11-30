const axios = require('axios');

describe('/cep/v3 (E2E)', () => {
  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v3/05010000`;
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

  test('Utilizando um CEP incompleto: 050', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v3/050`;
    const response = await axios.get(requestUrl);

    expect(response.data[0]).toEqual({
      state: 'SP',
      city: 'São Paulo',
      cep_interval: '01000-001 a 05999-999',
    });
  });

  test('Utilizando um CEP incompleto: 87', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v3/87`;
    const response = await axios.get(requestUrl);

    expect(response.data[0]).toEqual({
      state: 'PR',
      city: 'Alto Paraná',
      cep_interval: '87750-000 a 87759-999',
    });

    expect(response.data[1]).toEqual({
      state: 'PR',
      city: 'Alto Paraíso',
      cep_interval: '87528-000 a 87529-999',
    });

    expect(response.data[2]).toEqual({
      state: 'PR',
      city: 'Alto Piquiri',
      cep_interval: '87580-000 a 87594-999',
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v3/00000000`;

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
    const requestUrl = `${global.SERVER_URL}/api/cep/v3/999999999999999`;

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
    const requestUrl = `${global.SERVER_URL}/api/cep/v3/20751120`;
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
