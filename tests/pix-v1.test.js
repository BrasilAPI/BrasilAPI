const axios = require('axios');

const requestUrl = `${global.SERVER_URL}/api/pix/v1/participants`;

describe('api/pix/v1/participants (E2E)', () => {
  test('should return full list', async () => {
    const response = await axios.get(requestUrl);
    const { data, status } = response;

    expect(status).toEqual(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(1);

    expect.arrayContaining([
      expect.objectContaining({
        ispb: expect.any(String),
        nome: expect.any(String),
        nomeReduzido: expect.any(String),
        modalidadeParticipacao: expect.any(String),
        inicioOperacao: expect.any(String),
      }),
    ]);
  });
});
