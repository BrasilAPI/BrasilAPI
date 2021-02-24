const axios = require('axios');
const crypto = require('crypto');

describe('/feriados/v1 (E2E)', () => {
  test('Feriados fixos com ano válido entre 1900 e 2199', async () => {
    const year = 1900 + crypto.randomInt(2199 - 1900);
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/${year}`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(
      expect.arrayContaining([
        {
          date: `${year}-01-01`,
          name: 'Confraternização mundial',
          type: 'national',
        },
        {
          date: `${year}-04-21`,
          name: 'Tiradentes',
          type: 'national',
        },
        {
          date: `${year}-05-01`,
          name: 'Dia do trabalho',
          type: 'national',
        },
        {
          date: `${year}-09-07`,
          name: 'Independência do Brasil',
          type: 'national',
        },
        {
          date: `${year}-10-12`,
          name: 'Nossa Senhora Aparecida',
          type: 'national',
        },
        {
          date: `${year}-11-02`,
          name: 'Finados',
          type: 'national',
        },
        {
          date: `${year}-11-15`,
          name: 'Proclamação da República',
          type: 'national',
        },
        {
          date: `${year}-12-25`,
          name: 'Natal',
          type: 'national',
        },
      ])
    );
  });

  test('Feriados móveis de 2010', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/2010`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(
      expect.arrayContaining([
        {
          date: `2010-02-16`,
          name: 'Carnaval',
          type: 'national',
        },
        {
          date: `2010-04-04`,
          name: 'Páscoa',
          type: 'national',
        },
        {
          date: `2010-06-03`,
          name: 'Corpus Christi',
          type: 'national',
        },
      ])
    );
  });

  test('Feriados móveis de 2020', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/2020`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(
      expect.arrayContaining([
        {
          date: `2020-02-25`,
          name: 'Carnaval',
          type: 'national',
        },
        {
          date: `2020-04-12`,
          name: 'Páscoa',
          type: 'national',
        },
        {
          date: `2020-06-11`,
          name: 'Corpus Christi',
          type: 'national',
        },
      ])
    );
  });

  test('Feriados em ordem', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/2020`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual([
      {
        date: `2020-01-01`,
        name: 'Confraternização mundial',
        type: 'national',
      },
      {
        date: `2020-02-25`,
        name: 'Carnaval',
        type: 'national',
      },
      {
        date: `2020-04-12`,
        name: 'Páscoa',
        type: 'national',
      },
      {
        date: `2020-04-21`,
        name: 'Tiradentes',
        type: 'national',
      },
      {
        date: `2020-05-01`,
        name: 'Dia do trabalho',
        type: 'national',
      },
      {
        date: `2020-06-11`,
        name: 'Corpus Christi',
        type: 'national',
      },
      {
        date: `2020-09-07`,
        name: 'Independência do Brasil',
        type: 'national',
      },
      {
        date: `2020-10-12`,
        name: 'Nossa Senhora Aparecida',
        type: 'national',
      },
      {
        date: `2020-11-02`,
        name: 'Finados',
        type: 'national',
      },
      {
        date: `2020-11-15`,
        name: 'Proclamação da República',
        type: 'national',
      },
      {
        date: `2020-12-25`,
        name: 'Natal',
        type: 'national',
      },
    ]);
  });

  test('Utilizando um ano fora do intervalo suportado: 3000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/3000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        type: 'feriados_range_error',
        message: 'Ano fora do intervalo suportado entre 1900 e 2199.',
      });
    }
  });

  test('Utilizando um ano inválido: "erro"', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/erro`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;

      expect(response.status).toBe(500);
      expect(response.data).toEqual({
        type: 'feriados_error',
        message: 'Erro ao calcular feriados.',
      });
    }
  });

  test('Tiradentes e Páscoa no mesmo dia (2019)', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/2019`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(2);
    expect(data).toHaveLength(11);
    expect(data).toEqual(
      expect.arrayContaining([
        {
          date: `2019-04-21`,
          name: 'Páscoa',
          type: 'national',
        },
        {
          date: `2019-04-21`,
          name: 'Tiradentes',
          type: 'national',
        },
      ])
    );
  });
});
