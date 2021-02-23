const axios = require('axios');

describe('/cep/v1 (E2E)', () => {
  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/05010000`;
    const response = await axios.get(requestUrl);

    expect(response.data).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
      service: expect.any(String),
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/00000000`;

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
    const requestUrl = `${global.SERVER_URL}/api/cep/v1/999999999999999`;

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
});
