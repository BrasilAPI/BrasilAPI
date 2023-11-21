const axios = require('axios');

const {
  validResponse,
  validSortedAscResponse,
  validSortedDescResponse,
} = require('./helpers/ddd');

const GraphqlRequestUrl = `${global.SERVER_URL}/api/graphql/v1`;

describe('api/graphql ddd (E2E)', () => {
  test('Utilizando um DDD válido: 11', async () => {
    const { status, data } = await axios.post(GraphqlRequestUrl, {
      query: `query GetDDD($ddd: String!) {
                citiesOfDdd(ddd:$ddd) {
                  state
                  cities
                }
              }`,
      variables: {
        ddd: '11',
      },
    });

    expect(status).toEqual(200);
    expect(data.data.citiesOfDdd).toEqual(validResponse);
  });

  test('Utilizando um DDD válido: 11 e ordenando o response', async () => {
    const { status, data } = await axios.post(GraphqlRequestUrl, {
      query: `query GetDDD($ddd: String!) {
                citiesOfDdd(ddd:$ddd, sort: asc) {
                  state
                  cities
                }
              }`,
      variables: {
        ddd: '11',
      },
    });

    expect(status).toEqual(200);
    expect(data.data.citiesOfDdd).toEqual(validSortedAscResponse);
  });

  test('Utilizando um DDD válido: 11 e ordenando descendente o response', async () => {
    const { status, data } = await axios.post(GraphqlRequestUrl, {
      query: `query GetDDD($ddd: String!) {
                citiesOfDdd(ddd:$ddd, sort: desc) {
                  state
                  cities
                }
              }`,
      variables: {
        ddd: '11',
      },
    });

    // console.log(data)

    expect(status).toEqual(200);
    expect(data.data.citiesOfDdd).toEqual(validSortedDescResponse);
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    const { status, data } = await axios.post(GraphqlRequestUrl, {
      query: `query GetDDD($ddd: String!) {
                citiesOfDdd(ddd:$ddd) {
                  state
                  cities
                }
              }`,
      variables: {
        ddd: '01',
      },
    });
    expect(status).toEqual(200);
    expect(data.errors[0].message).toBe('DDD não encontrado');
    expect(data.data.citiesOfDdd).toEqual(null);
  });
});
