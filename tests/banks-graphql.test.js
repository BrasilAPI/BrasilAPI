const axios = require('axios');

describe('/banks/v1 (E2E) graphql', () => {
  test('Utilizando um bank code válido: 260', async () => {
    const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
    const response = await axios.post(requestUrl, {
      query: `query FetchOneBank($bankCode: Int!) {
                bank(code: $bankCode) {
                    ispb
                    name
                    code
                    fullName
                }
            }`,
      variables: {
        bankCode: 260,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data.data.bank).toEqual({
      ispb: '18236120',
      name: 'NU PAGAMENTOS - IP',
      code: 260,
      fullName: 'NU PAGAMENTOS S.A. - INSTITUIÇÃO DE PAGAMENTO',
    });
  });

  test('Utilizando um código inexistente: 1111111', async () => {
    const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
    const response = await axios.post(requestUrl, {
      query: `query FetchOneBank($bankCode: Int!) {
                bank(code: $bankCode) {
                    ispb
                    name
                    code
                    fullName
                }
            }`,
      variables: {
        bankCode: 1111111,
      },
    });

    expect(response.status).toBe(200);
    expect(response.data.data.bank).toEqual(null);
    expect(response.data.errors[0].message).toEqual('Erro ao consultar Bancos');
  });

  test('Pegando a lista total de bancos', async () => {
    const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
    const response = await axios.post(requestUrl, {
      query: `query FetchAllBanks {
                allBanks {
                    ispb
                    name
                    code
                    fullName
                }
            }`,
    });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data.data.allBanks)).toBe(true);
  });
});
