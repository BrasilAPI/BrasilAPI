const axios = require('axios');
const crypto = require('crypto');

const {
    getUruHoliday,
    getSpHoliday,
    getGoodFridayHoliday,
    getFixedHolidays
} = require('./helpers/feriados-v2');

describe('/feriados/v2/ (E2E)', () => {
  test(`Feriados nacionais com um ano válido`, async () => {
    const year = 2023;
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2?ano=${year}`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(expect.arrayContaining(getFixedHolidays(year)));
  });

  test('Feriado nacional móvel (Sexta-Feira Santa) dos anos 2023, 2024', async () => {
    const year = 2023;

    expect.assertions(1);

    
        const requestUrl = `${global.SERVER_URL}/api/feriados/v2?ano=${year}`;
        const { data } = await axios.get(requestUrl);

        expect(data).toEqual(expect.arrayContaining(getGoodFridayHoliday(year)));
      
  });

  test('Feriados nacionais e estaduais de São Paulo com ano válido entre 2000 e 2030', async () => {
    const year = 2023;
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2?estado=SP&ano=${year}`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(expect.arrayContaining(getSpHoliday(year)));
  });

  test('Feriados nacionais, estaduais e municipais de Uru-SP com ano válido entre 2000 e 2030', async () => {
    const year = 2023;
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2?cidade=Uru&estado=SP&ano=${year}`;
    const { data } = await axios.get(requestUrl);

    expect.assertions(1);
    expect(data).toEqual(expect.arrayContaining(getUruHoliday(year)));
  });

  test('Utilizando um ano fora do intervalo suportado: 3000', async () => {
    expect.assertions(2);
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2?ano=3000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;


      expect(response.status).toBe(404);
      expect(response.data).toMatchObject({
        type: 'feriados_error',
        message: 'Ano fora do intervalo suportado entre 2000 e 2030.',
      });
    }
  });
});