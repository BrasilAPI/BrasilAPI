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

describe('/fipe/preco/v1 (E2E)', () => {
  test('Utilizando um veículo válido sem informar nenhuma tabela de referência', async () => {
    expect.assertions(2);
    const fipeCode = '015088-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valor: expect.any(String),
          marca: expect.any(String),
          modelo: expect.any(String),
          anoModelo: expect.any(Number),
          combustivel: expect.any(String),
          codigoFipe: expect.any(String),
          mesReferencia: expect.any(String),
          tipoVeiculo: expect.any(Number),
          siglaCombustivel: expect.any(String),
          dataConsulta: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando um veículo válido com a tabela de referência 267', async () => {
    expect.assertions(2);
    const fipeCode = '015088-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
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
          valor: expect.any(String),
          marca: expect.any(String),
          modelo: expect.any(String),
          anoModelo: expect.any(Number),
          combustivel: expect.any(String),
          codigoFipe: expect.any(String),
          mesReferencia: expect.any(String),
          tipoVeiculo: expect.any(Number),
          siglaCombustivel: expect.any(String),
          dataConsulta: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando um carro válido com a tabela de referência 270', async () => {
    expect.assertions(2);
    const fipeCode = '004113-0';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const referenceTable = 270;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valor: expect.any(String),
          marca: expect.any(String),
          modelo: expect.any(String),
          anoModelo: expect.any(Number),
          combustivel: expect.any(String),
          codigoFipe: expect.any(String),
          mesReferencia: expect.any(String),
          tipoVeiculo: expect.any(Number),
          siglaCombustivel: expect.any(String),
          dataConsulta: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando uma moto válida com a tabela de referência 270', async () => {
    expect.assertions(2);
    const fipeCode = '811165-0';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const referenceTable = 270;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valor: expect.any(String),
          marca: expect.any(String),
          modelo: expect.any(String),
          anoModelo: expect.any(Number),
          combustivel: expect.any(String),
          codigoFipe: expect.any(String),
          mesReferencia: expect.any(String),
          tipoVeiculo: expect.any(Number),
          siglaCombustivel: expect.any(String),
          dataConsulta: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando um caminhão válido com a tabela de referência 270', async () => {
    expect.assertions(2);
    const fipeCode = '516094-4';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const referenceTable = 270;

    const response = await axios.get(requestUrl, {
      params: {
        tabela_referencia: referenceTable,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          valor: expect.any(String),
          marca: expect.any(String),
          modelo: expect.any(String),
          anoModelo: expect.any(Number),
          combustivel: expect.any(String),
          codigoFipe: expect.any(String),
          mesReferencia: expect.any(String),
          tipoVeiculo: expect.any(Number),
          siglaCombustivel: expect.any(String),
          dataConsulta: expect.any(String),
        }),
      ])
    );
  });

  test('Utilizando um veículo válido com a tabela de referência inválida', async () => {
    expect.assertions(2);
    const fipeCode = '015088-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
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

  test('Utilizando um veículo inválido sem informar nenhuma tabela de referência', async () => {
    expect.assertions(2);
    const fipeCode = 'AAAAAA-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'BadRequestError',
        message: 'Código fipe inválido',
        type: 'bad_request',
      });
    }
  });

  test('Utilizando um veículo inválido com a tabela de referência 267', async () => {
    expect.assertions(2);
    const fipeCode = 'AAAAAA-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const referenceTable = 267;
    try {
      await axios.get(requestUrl, {
        params: {
          tabela_referencia: referenceTable,
        },
      });
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(400);
      expect(response.data).toEqual({
        name: 'BadRequestError',
        message: 'Código fipe inválido',
        type: 'bad_request',
      });
    }
  });

  test('Utilizando um veículo inválido com a tabela de referência inválida', async () => {
    expect.assertions(2);
    const fipeCode = 'AAAAAA-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
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
