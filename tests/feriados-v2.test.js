const axios = require('axios');

const {
  constitutionalistRevolution,
  newYear,
  tresLagoasAniversary,
} = require('./helpers/feriados/v2');

describe('/feriados/v2/sp (E2E)', () => {
  test('Feriado Estadual Revolução Constitucionalista - São Paulo', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2/sp`;
    const { data } = await axios.get(requestUrl);

    expect(data).toEqual(expect.arrayContaining([constitutionalistRevolution]));
  });
});

describe('/feriados/v2/ (E2E)', () => {
  test('Feriado Nacional Ano Novo - São Paulo', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2/`;
    const { data } = await axios.get(requestUrl);

    expect(data).toEqual(expect.arrayContaining([newYear]));
  });
});

describe('/feriados/v2/ms/TrêsLagoas (E2E)', () => {
  test('Feriado Municipal - Aniversário da cidade de Três Lagoas', async () => {
    const requestUrl = `${global.SERVER_URL}/api/feriados/v2/ms/TrêsLagoas`;
    const { data } = await axios.get(requestUrl);

    expect(data).toEqual(expect.arrayContaining([tresLagoasAniversary]));
  });
});
