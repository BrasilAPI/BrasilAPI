const axios = require('axios');

describe('/fipe/marcas/v1 (E2E)', () => {
  test('Utilizando sem informar nenhuma tabela de referência', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com a tabela de referência 267', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1`;
    const referenceTable = 267;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com uma tabela de referência inválida', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1`;
    const referenceTable = 'AAAA';
    try {
      await axios.get(requestUrl, {
        params: { tabela_referencia: referenceTable },
      });
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'BadRequestError',
        message: 'Tabela de referência inválida',
        type: 'bad_request',
      });
    }
  });
});

describe('/fipe/marcas/v1/carros (E2E)', () => {
  test('Utilizando sem informar nenhuma tabela de referência', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/carros`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com a tabela de referência 267', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/carros`;
    const referenceTable = 267;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com uma tabela de referência inválida', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/carros`;
    const referenceTable = 'AAAA';
    try {
      await axios.get(requestUrl, {
        params: { tabela_referencia: referenceTable },
      });
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'BadRequestError',
        message: 'Tabela de referência inválida',
        type: 'bad_request',
      });
    }
  });
});

describe('/fipe/marcas/v1/motos (E2E)', () => {
  test('Utilizando sem informar nenhuma tabela de referência', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/motos`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com a tabela de referência 267', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/motos`;
    const referenceTable = 267;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com uma tabela de referência inválida', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/motos`;
    const referenceTable = 'AAAA';
    try {
      await axios.get(requestUrl, {
        params: { tabela_referencia: referenceTable },
      });
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'BadRequestError',
        message: 'Tabela de referência inválida',
        type: 'bad_request',
      });
    }
  });
});

describe('/fipe/marcas/v1/caminhoes (E2E)', () => {
  test('Utilizando sem informar nenhuma tabela de referência', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/caminhoes`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com a tabela de referência 267', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/caminhoes`;
    const referenceTable = 267;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nome: expect.any(String),
          valor: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando com uma tabela de referência inválida', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1/caminhoes`;
    const referenceTable = 'AAAA';
    try {
      await axios.get(requestUrl, {
        params: { tabela_referencia: referenceTable },
      });
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'BadRequestError',
        message: 'Tabela de referência inválida',
        type: 'bad_request',
      });
    }
  });
});
