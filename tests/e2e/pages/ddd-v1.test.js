import axios from 'axios';

import success from 'tests/helpers/scenarios/ddd/success.json';
import inexistent from 'tests/helpers/scenarios/ddd/inexistent.json';
import incorrect from 'tests/helpers/scenarios/ddd/incorrect.json';

const scenariosDdd = { success, inexistent, incorrect };

const requestUrl = `${global.SERVER_URL}/api/ddd/v1`;

describe.skip('api/ddd/v1 (E2E)', () => {
  test('Utilizando um DDD válido: 12', async () => {
    const response = await axios.get(`${requestUrl}/12`);
    expect(response.data).toEqual(scenariosDdd.success);
  });

  test('Utilizando um DDD inexistente: 01', async () => {
    const response = await axios.get(`${requestUrl}/01`);
    expect(response.data).toEqual(scenariosDdd.inexistent);
  });

  test('Utilizando um DDD inválido: 9999', async () => {
    const response = await axios.get(`${requestUrl}/9999`);
    expect(response.data).toEqual(scenariosDdd.incorrect);
  });
});
