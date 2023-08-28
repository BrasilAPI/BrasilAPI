const axios = require('axios');

const validTestArray = expect.arrayContaining([
  expect.objectContaining({
    codigo: expect.any(String),
    ex: expect.any(String),
    tipo: expect.any(String),
    descricao: expect.any(String),
    nacional_federal: expect.any(Number),
    importados_federal: expect.any(Number),
    estadual: expect.any(Number),
    municipal: expect.any(Number),
    vigencia_inicio: expect.any(String),
    vigencia_fim: expect.any(String),
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
  nacional_federal: expect.any(Number),
  importados_federal: expect.any(Number),
  estadual: expect.any(Number),
  municipal: expect.any(Number),
  vigencia_inicio: expect.any(String),
  vigencia_fim: expect.any(String),
  chave: expect.any(String),
  versao: expect.any(String),
  fonte: expect.any(String),
});

const validTestVersaoObject = expect.objectContaining({
  versao: expect.any(String),
});

describe('ibpt v1 (E2E)', () => {
  describe('GET /ibpt/versao/v1', () => {
    test('Consulta versão IBPT', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/versao/v1`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestVersaoObject);
    });
  });

  describe('GET /ibpt/ncm/v1/:uf', () => {
    test('Utilizando uma UF válida: SP', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP`;
      const response = await axios.get(requestUrl);
      expect(response.status).toBe(200);
      expect(response.data).toEqual(validTestArray);
    });

    test('Utilizando uma UF válida: PR', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/PR`;
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
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NCM_BAD_REQUEST',
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

    test('Utilizando um codigo NCM válido: 02109100 e EX: 01', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP/02109100?ex=01`;
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
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NCM_BAD_REQUEST',
        });
      }
    });

    test('Utilizando um codigo NCM com tamanho incorreto: 000000001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP/000000001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Código do NCM deve ter 8 digitos.',
          type: 'IBPT_NCM_BAD_REQUEST',
        });
      }
    });

    test('Utilizando um codigo NCM não numérico: A0000001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/ncm/v1/SP/A0000001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Código do NCM deve ser um valor numérico.',
          type: 'IBPT_NCM_BAD_REQUEST',
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

    test('Utilizando uma UF válida: PR', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/PR`;
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
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NBS_BAD_REQUEST',
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
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_NBS_BAD_REQUEST',
        });
      }
    });

    test('Utilizando um codigo NBS com tamanho incorreto: 0000000001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SP/0000000001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Código do NBS deve ter 9 digitos.',
          type: 'IBPT_NBS_BAD_REQUEST',
        });
      }
    });

    test('Utilizando um codigo NBS não numérico: A00000001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/nbs/v1/SP/A00000001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Código do NBS deve ser um valor numérico.',
          type: 'IBPT_NBS_BAD_REQUEST',
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

    test('Utilizando uma UF válida: PR', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/PR`;
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
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_LC116_BAD_REQUEST',
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
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'UF não encontrada.',
          type: 'IBPT_LC116_BAD_REQUEST',
        });
      }
    });

    test('Utilizando um codigo LC 116 com tamanho incorreto: 00001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SP/00001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Código do LC 116 deve ter 4 digitos.',
          type: 'IBPT_LC116_BAD_REQUEST',
        });
      }
    });

    test('Utilizando um codigo LC 116 não numérico: A001', async () => {
      const requestUrl = `${global.SERVER_URL}/api/ibpt/lc116/v1/SP/A001`;
      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;
        expect(response.status).toBe(400);
        expect(response.data).toMatchObject({
          message: 'Código do LC 116 deve ser um valor numérico.',
          type: 'IBPT_LC116_BAD_REQUEST',
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
