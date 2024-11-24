const axios = require('axios');

const requestUrl = `${global.SERVER_URL}/api/cpf/v1`;

describe('api/cpf/v1 (E2E)', () => {
  test('Utilizando um CPF válido: 54083180013', async () => {
    const response = await axios.get(`${requestUrl}/54083180013`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data.cpf).toEqual('540.831.800-13');
    expect(data.rf).toEqual(0);
    expect(data.ufs).toEqual(['RS']);
    expect(data.isValid).toEqual(true);
  });

  test('Utilizando um CPF válido com formatação: 540.831.800-13', async () => {
    try {
      await axios.get(`${requestUrl}/540.831.800-13`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(200);
      expect(data.cpf).toEqual('540.831.800-13');
      expect(data.rf).toEqual(0);
      expect(data.ufs).toEqual(['RS']);
      expect(data.isValid).toEqual(true);
    }
  });

  test('Utilizando um CPF inválido (valor): 00000000000', async () => {
    try {
      await axios.get(`${requestUrl}/00000000000`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        message: 'CPF 000.000.000-00 inválido.',
        name: 'BadRequestError',
        type: 'bad_request',
      });
    }
  });

  test('Utilizando um CPF inválido (tamanho): 123', async () => {
    try {
      await axios.get(`${requestUrl}/123`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(400);
      expect(data).toEqual({
        message: 'CPF 123 inválido.',
        name: 'BadRequestError',
        type: 'bad_request',
      });
    }
  });
});
