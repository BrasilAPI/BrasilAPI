const axios = require('axios');
const crypto = require('crypto');

const {
  getEasterHolidays,
  getFixedHolidays,
  getHolidays,
} = require('./helpers/feriados');

describe('/feriados/v1 (E2E)', () => {
  test('Feriados fixos com ano válido entre 1900 e 2199', async () => {
    const year = 1900 + crypto.randomInt(2199 - 1900);
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/${year}`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(expect.arrayContaining(getFixedHolidays(year)));
  });

  test('Feriados móveis dos anos 2010, 2020', async () => {
    const years = [2010, 2020];

    expect.assertions(years.length);

    await Promise.all(
      years.map(async (year) => {
        const requestUrl = `${global.SERVER_URL}/api/feriados/v1/${year}`;
        const { data } = await axios.get(requestUrl);

        expect(data).toEqual(expect.arrayContaining(getEasterHolidays(year)));
      })
    );
  });

  test('Feriados em ordem', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v1/2020`;
    const { data } = await axios.get(requestUrl);
    expect.assertions(1);
    expect(data).toEqual(getHolidays(2020));
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
        name: 'InternalError',
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

    expect(data).toHaveLength(12);
    expect(data).toEqual(
      expect.arrayContaining(getHolidays(2019, ['Páscoa', 'Tiradentes']))
    );
  });
});
