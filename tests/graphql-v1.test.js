const axios = require('axios');

describe('/graphql/v1 (E2E)', () => {
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
    // O endpoint /cep/v1 está retornando 404 independente
    // do CEP não existir ou ele não ser válido. Podemos melhorar
    // esse comportamento fazendo uma diferenciação no Status do
    // response para quando for um type "validation_error" ou "service_error"
    // Nesse caso aqui seria um "service_error":
    // "Todos os serviços de CEP retornaram erro."
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

    expect(response.data.data.cep).toEqual(null);
    expect(response.data.errors[0].message).toEqual('Erro ao consultar CEP');
    expect(response.data.errors[0].extensions.code).toEqual('service_error');
  });

  test('Utilizando um CEP inválido: 999999999999999', async () => {
    // O endpoint /cep/v1 está retornando 404 independente
    // do CEP não existir ou ele não ser válido. Podemos melhorar
    // esse comportamento fazendo uma diferenciação no Status do
    // response para quando for um type "validation_error" ou "service_error"
    // Nesse caso aqui seria um "validation_error":
    // "CEP deve conter exatamente 8 caracteres."
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

    expect(response.data.data.cep).toEqual(null);
    expect(response.data.errors[0].message).toEqual('CEP inválido');
    expect(response.data.errors[0].extensions.code).toEqual('validation_error');
  });
});
