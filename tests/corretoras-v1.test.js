const axios = require('axios');

const validTestTableArray = expect.arrayContaining([
  expect.objectContaining({
    bairro: expect.any(String),
    cep: expect.any(String),
    cnpj: expect.any(String),
    codigo_cvm: expect.any(String),
    complemento: expect.any(String),
    data_inicio_situacao: expect.any(String),
    data_patrimonio_liquido: expect.any(String),
    data_registro: expect.any(String),
    email: expect.any(String),
    logradouro: expect.any(String),
    municipio: expect.any(String),
    nome_social: expect.any(String),
    nome_comercial: expect.any(String),
    pais: expect.any(String),
    telefone: expect.any(String),
    uf: expect.any(String),
    valor_patrimonio_liquido: expect.any(String),
  }),
]);

describe('corretoras v1 (E2E)', () => {
  describe('GET /cvm/corretoras/v1/:cnpj', () => {
    test('Utilizando um CNPJ válido: 02332886000104', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/02332886000104`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        bairro: 'LEBLON',
        cep: '22440032',
        cnpj: '02332886000104',
        codigo_cvm: '3247',
        complemento: 'SALA 201',
        data_inicio_situacao: '1998-02-10',
        data_patrimonio_liquido: '2021-12-31',
        data_registro: '1997-12-05',
        email: 'juridico.regulatorio@xpi.com.br',
        logradouro: 'AVENIDA ATAULFO DE PAIVA 153',
        municipio: 'RIO DE JANEIRO',
        nome_social: 'XP INVESTIMENTOS CCTVM S.A.',
        nome_comercial: 'XP INVESTIMENTOS',
        pais: '',
        status: 'EM FUNCIONAMENTO NORMAL',
        telefone: '30272237',
        type: 'CORRETORAS',
        uf: 'RJ',
        valor_patrimonio_liquido: '5514593491.29',
      });
    });

    test('Utilizando um CNPJ inexistente: 1111111', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Nenhuma corretora localizada',
          type: 'exchange_error',
          name: 'EXCHANGE_NOT_FOUND',
        });
      }
    });
  });

  test('GET /cvm/corretoras/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cvm/corretoras/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data).toEqual(validTestTableArray);
  });
});
