const axios = require('axios');

const artistNotFound = require('./helpers/scenarios/music/artistNotFound.json');
const musicNotFound = require('./helpers/scenarios/music/musicNotFound.json');

const {
  artistSchema,
  musicSchema,
} = require('./helpers/scenarios/music/schemas.js');

describe('/music/v1 (E2E)', () => {
  describe('GET /music/v1/artist/:artist', () => {
    test('Requisição de um artista existente: twenty-one-pilots', async () => {
      const requestUrl = `${global.SERVER_URL}/api/music/v1/artist/twenty-one-pilots`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      // Checando se os campos da response batem com o schema que devem ter
      expect(Object.keys(response.data)).toStrictEqual(artistSchema);
    });

    test('Requisição de um artista inexistente: maicon-jekson', async () => {
      const requestUrl = `${global.SERVER_URL}/api/music/v1/artist/maicon-jekson`;

      try {
        await axios.get(requestUrl);
      } catch (err) {
        const { response } = err;
        expect(response.status).toBe(404);
        expect(response.data).toStrictEqual(artistNotFound);
      }
    });
  });

  describe('GET /music/v1/artist/:artist/:music', () => {
    test('Requisição de artista e música existentes: gelpi/pneu ', async () => {
      const requestUrl = `${global.SERVER_URL}/api/music/v1/artist/gelpi/pneu`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      // Checando se os campos da response batem com o schema que devem ter
      expect(Object.keys(response.data)).toStrictEqual(musicSchema);
    });

    test('Requisição de artista e música inexistentes: abcw/defw', async () => {
      const requestUrl = `${global.SERVER_URL}/api/music/v1/artist/abcw/defw`;

      try {
        await axios.get(requestUrl);
      } catch (err) {
        const { response } = err;
        expect(response.status).toBe(404);
        expect(response.data).toStrictEqual(artistNotFound);
      }
    });

    test('Requisição de artista existente com música inexistente: the-do/notfound', async () => {
      const requestUrl = `${global.SERVER_URL}/api/music/v1/artist/the-do/notfound`;

      try {
        await axios.get(requestUrl);
      } catch (err) {
        const { response } = err;
        expect(response.status).toBe(404);
        expect(response.data).toStrictEqual(musicNotFound);
      }
    });
  });
});
