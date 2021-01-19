const axios = require('axios');

describe('/graphql/v1 (E2E)', () => {
  describe('CEP', () => {
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

    test('Utilizando um CEP válido retornar apenas cidade: 05010000', async () => {
      const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
      const response = await axios.post(requestUrl, {
        query: `query FetchCep($cep: String!){
                  cep(cep: $cep) {
                      city
                  }
              }`,
        variables: {
          cep: '05010000',
        },
      });

      expect(response.data.data.cep).toEqual({
        city: 'São Paulo'
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

      expect(response.data.data.cep).toEqual(null);
      expect(response.data.errors[0].message).toEqual('Erro ao consultar CEP');
      expect(response.data.errors[0].extensions.code).toEqual('service_error');
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

      expect(response.data.data.cep).toEqual(null);
      expect(response.data.errors[0].message).toEqual('CEP inválido');
      expect(response.data.errors[0].extensions.code).toEqual('validation_error');
    });
  });

  describe('Banks', () => {
    test('Utilizando um bank code válido: 260', async () => {
      const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
      const response = await axios.post(requestUrl, {
        query: `query FetchBank($code: Int!){
                  bank(code: $code) {
                      ispb
                      name
                      code
                      fullName
                  }
              }`,
        variables: {
          code: 260
        }
      });

      expect(response.data.data.bank).toEqual({
        ispb: '18236120',
        name: 'NU PAGAMENTOS S.A.',
        code: 260,
        fullName: 'Nu Pagamentos S.A.',
      });
    });

    test('Utilizando um bank ispb válido: 18236120', async () => {
      const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
      const response = await axios.post(requestUrl, {
        query: `query FetchBank($ispb: String!){
                  bank(ispb: $ispb) {
                      ispb
                      name
                      code
                      fullName
                  }
              }`,
        variables: {
          ispb: "18236120"
        }
      });

      expect(response.data.data.bank).toEqual({
        ispb: '18236120',
        name: 'NU PAGAMENTOS S.A.',
        code: 260,
        fullName: 'Nu Pagamentos S.A.',
      });
    });

    test('Utilizando um bank code válido retornar apenas nome do banco: 260', async () => {
      const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
      const response = await axios.post(requestUrl, {
        query: `query FetchBank($code: Int!){
                  bank(code: $code) {
                      name
                  }
              }`,
        variables: {
          code: 260
        }
      });

      expect(response.data.data.bank).toEqual({
        name: 'NU PAGAMENTOS S.A.'
      });
    });

    test('Listando todos os bancos', async () => {
      const requestUrl = `${global.SERVER_URL}/api/graphql/v1`;
      const response = await axios.post(requestUrl, {
        query: `query{
                  banks {
                      ispb
                      name
                      code
                      fullName
                  }
              }`
      });

      expect(response.status).toBe(200);
      expect(Array.isArray(response.data.data.banks)).toBe(true);
    });
  });
});
