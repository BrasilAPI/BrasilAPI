const axios = require('axios');

describe('universities v1 (E2E)', () => {
  describe('GET /universities/v1/:id', () => {
    test('Utilizando um id válido: 1', async () => {
      const requestUrl = `${global.SERVER_URL}/api/universities/v1/1`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        "id": 1,
        "full_name": "UNIVERSIDADE FEDERAL DE MATO GROSSO",
        "name": "UFMT",
        "ibge": "5103403",
        "city": "CUIABA",
        "uf": "MT",
        "zipcode": "78060900",
        "street": "AVENIDA FERNANDO CORREA DA COSTA",
        "number": "2367",
        "neighborhood": "BOA ESPERANÇA",
        "phone": "(65) 3615 8302"
      });
    })

    test('Utilizando um id inválido: 199920', async () => {
      const requestUrl = `${global.SERVER_URL}/api/universities/v1/199920`;
      
      try {
        await axios.get(requestUrl);
      } catch(error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Universidade não encontrada',
          type: 'UNIVERSITY_NOT_FOUND',
        });
      }
    });

    test('GET /universities/v1', async () => {
      const requestUrl = `${global.SERVER_URL}/api/universities/v1`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true)
    })
  });
});