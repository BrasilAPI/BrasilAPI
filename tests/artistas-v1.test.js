const axios = require('axios');

describe('Artists v1', () => {
  describe('GET /artistas/v1/:name', () => {
    test('Requisição de um artista existente: twenty-one-pilots', async () => {
      const requestUrl = `${global.SERVER_URL}/api/artistas/v1/twenty-one-pilots`;
      const response = await axios.get(requestUrl);

      const artistSchema = [
        'nome',
        'imagem',
        'generoMusical',
        'relacionado',
        'topMusicas',
        'musicas',
        'albuns',
      ];

      expect(response.status).toBe(200);
      // Checando se todos os campos da response estão corretos
      expect(Object.keys(response.data)).toStrictEqual(artistSchema);
    });

    test('Requisição de um artista inexistente: maicon jekson', async () => {
      const requestUrl = `${global.SERVER_URL}/api/artistas/v1/maicon jekson`;

      try {
        await axios.get(requestUrl);
      } catch (err) {
        const { response } = err;
        expect(response.status).toBe(404);
      }
    });
  });
});
