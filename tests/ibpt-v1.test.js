const axios = require('axios');

const validTestArray = expect.arrayContaining([
  expect.objectContaining({
    codigo: expect.any(String),
    ex: expect.any(String),
    tipo: expect.any(String),
    descricao: expect.any(String),
    nacionalfederal: expect.any(Number),
    importadosfederal: expect.any(Number),
    estadual: expect.any(Number),
    municipal: expect.any(Number),
    vigenciainicio: expect.any(String),
    vigenciafim: expect.any(String),
    chave: expect.any(String),
    versao: expect.any(String),
    fonte: expect.any(String),
  }),
]);

const validTestObject = expect.objectContaining({
  codigo: expect.any(String),
  ex: expect.any(String),
  tipo: expect.any(String),
  descricao: expect.any(String),
  nacionalfederal: expect.any(Number),
  importadosfederal: expect.any(Number),
  estadual: expect.any(Number),
  municipal: expect.any(Number),
  vigenciainicio: expect.any(String),
  vigenciafim: expect.any(String),
  chave: expect.any(String),
  versao: expect.any(String),
  fonte: expect.any(String),
});

describe('ibpt v1 (E2E)', () => {
  describe('GET /ibpt/ncm/v1/:uf', () => {
    test('Utilizando uma UF válida: SP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestArray);
    });

    test('Utilizando uma UF inexistente: SPP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SPP`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NCM_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /ibpt/ncm/v1/:uf/:codigo', () => {
    test('Utilizando um codigo NCM válido: 00000000', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP/00000000`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestObject);
    });

    test('Utilizando uma UF inexistente: SPP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SPP/00000000`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NCM_NOT_FOUND',
        });
      }
    });

    test('Utilizando um codigo NCM inexistente: 00000001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP/00000001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'NCM não encontrado.',
          type: 'IBPT_NCM_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /ibpt/nbs/v1/:uf', () => {
    test('Utilizando uma UF válida: SP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SP`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestArray);
    });

    test('Utilizando uma UF inexistente: SPP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SPP`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NBS_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /ibpt/nbs/v1/:uf/:codigo', () => {
    test('Utilizando um codigo NBS válido: 101011000', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SP/101011000`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestObject);
    });

    test('Utilizando uma UF inexistente: SPP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SPP/101011000`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NBS_NOT_FOUND',
        });
      }
    });

    test('Utilizando um codigo NBS inexistente: 000000001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SP/000000001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'NBS não encontrado.',
          type: 'IBPT_NBS_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /ibpt/lc116/v1/:uf', () => {
    test('Utilizando uma UF válida: SP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SP`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestArray);
    });

    test('Utilizando uma UF inexistente: SPP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SPP`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_LC116_NOT_FOUND',
        });
      }
    });
  });

  describe('GET /ibpt/lc116/v1/:uf/:codigo', () => {
    test('Utilizando um codigo LC 116 válido: 0101', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SP/0101`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestObject);
    });

    test('Utilizando uma UF inexistente: SPP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SPP/0101`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_LC116_NOT_FOUND',
        });
      }
    });

    test('Utilizando um codigo LC 116 inexistente: 0001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SP/0001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'LC 116 não encontrado.',
          type: 'IBPT_LC116_NOT_FOUND',
        });
      }
    });
  });
});
