const axios = require('axios');

describe('/cep/v1 (E2E) graphql', () => {
  test('Utilizando um CEP válido: 05010000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
    const response = await axios.post(requestUrl, {
      query: `query FetchCep($cep: String!){
                cep(cep: $cep) {
                    cep
                    state
                    city
                    street
                    neighborhood
                }
            }`,
      variables: {
        cep: '05010000',
      },
    });

    expect(response.data.data.cep).toEqual({
      cep: '05010000',
      state: 'SP',
      city: 'São Paulo',
      neighborhood: 'Perdizes',
      street: 'Rua Caiubi',
    });
  });

  test('Utilizando um CEP inexistente: 00000000', async () => {
    const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
    const response = await axios.post(requestUrl, {
      query: `query FetchCep($cep: String!){
                cep(cep: $cep) {
                    cep
                    state
                    city
                    street
                    neighborhood
                }
            }`,
      variables: {
        cep: '00000000',
      },
    });

    expect(response.data.errors[0].message).toBe('Erro ao consultar CEP');
  });

  test('Utilizando um CEP inválido: 999999999999999', async () => {
    const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
    const response = await axios.post(requestUrl, {
      query: `query FetchCep($cep: String!){
                cep(cep: $cep) {
                    cep
                    state
                    city
                    street
                    neighborhood
                }
            }`,
      variables: {
        cep: '999999999999999',
      },
    });

    expect(response.data.errors[0].message).toBe('CEP inválido');
  });
});
