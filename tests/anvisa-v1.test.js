const axios = require('axios');

const requestUrl = `${global.SERVER_URL}/api/anvisa/v1`;

// TODO: This test is intermitent at Github Actions provider
describe.skip('api/anvisa/v1 (E2E)', () => {
  test('Utilizando um ANVISA válido: 10064010018', async () => {
    const response = await axios.get(`${requestUrl}/10064010018`);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(data.produto).toEqual(
      'KAVO KEY LASER 1242/1243  - TRATAMENTO DE CARIES ETERAPIAS EM TECIDOS DUROS'
    );
  });

  test('Utilizando um ANVISA inválido: 123', async () => {
    try {
      await axios.get(`${requestUrl}/123`);
    } catch (error) {
      const { response } = error;
      const { data, status } = response;

      expect(status).toEqual(404);
      expect(data).toEqual({
        message: 'Protocolo do ANVISA 123 não encontrado.',
      });
    }
  });
});
