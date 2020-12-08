const axios = require('axios');
const createServer = require('./helpers/server.js');
const successCase = require('./helpers/scenarios/car/success.json');
const inexistentCase = require('./helpers/scenarios/car/inexistent.json');
const incorrectCase = require('./helpers/scenarios/car/incorrect.json');

const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(() => {
  server.stop();
});

describe('/car/v1 (E2E)', () => {
  // A placa usada para este teste foi retirada da RevistaCarro no link a seguir:
  // https://revistacarro.com.br/wp-content/uploads/2019/02/Yaris-VW-9.jpg
  test('Utilizando uma placa válido: FPP0767', async () => {
    const requestUrl = `${server.getUrl()}/api/car/v1/fpp0767`;
    const { data } = await axios.get(requestUrl);

    // algumas informações como marca, modelo, ano e etc nunca mudarão,
    // então podemos validá-las.
    // para informações como situação e ultima atualização de caracteristica
    // podemos validar somente se a propriedade existe, uma vez que estas
    // informações podem mudar.
    expect(data.brand).toEqual(successCase.brand);
    expect(data.model).toEqual(successCase.model);
    expect(data.year).toEqual(successCase.year);
    expect(data.chassis).toEqual(successCase.chassis);
    expect(data.city).toEqual(successCase.city);
    expect(data.state).toEqual(successCase.state);
    expect(data.plate).toEqual(successCase.plate);
    expect(data).toHaveProperty('situation.code');
    expect(data).toHaveProperty('situation.code');
    expect(data).toHaveProperty('situation.description');
  });

  test('Utilizando uma placa inexistente: XXX0000', async () => {
    const requestUrl = `${server.getUrl()}/api/car/v1/xxx0000`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.data).toEqual({ error: inexistentCase.error });
    }
  });

  test('Utilizando uma placa inválida: XXX', async () => {
    const requestUrl = `${server.getUrl()}/api/car/v1/xxx`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      const { response } = error;
      expect(response.data).toEqual({ error: incorrectCase.error });
    }
  });
});

// Código para testes das funções de utils da API

// describe('/car/v1 (Utils - formatBrandModel)', () => {
//   const mocks = {
//     withBar: Array.from(2).fill('VW/POLO CL AC'),
//     iPrefix: Array.from(2).fill('I/BMW I8'),
//     impPrefix: Array.from(2).fill('IMP/TESLA MODEL X'),
//     tPrefix: ['T', 'VW GOLF GTI'],
//   };

//   test('Se marca/modelo forem iguais e tiver I/ como prefixo', () => {
//     const { iPrefix } = mocks;
//     expect(formatBrandModel(iPrefix[0], iPrefix[1])).toEqual({
//       brand: 'BMW',
//       model: 'I8',
//     });
//   });

//   test('Se marca/modelo forem iguais e tiver IMP/ como prefixo', () => {
//     const { impPrefix } = mocks;
//     expect(formatBrandModel(impPrefix[0], impPrefix[1])).toEqual({
//       brand: 'TESLA',
//       model: 'MODEL X',
//     });
//   });

//   test('Se marca/modelo forem iguais e tiver o caractere /', () => {
//     const { withBar } = mocks;
//     expect(formatBrandModel(withBar[0], withBar[1])).toEqual({
//       brand: 'VW',
//       model: 'POLO CL AC',
//     });
//   });

//   test('Se tiver T/ como prefixo', () => {
//     const { tPrefix } = mocks;
//     expect(formatBrandModel(tPrefix[0], tPrefix[1])).toEqual({
//       brand: 'VW',
//       model: 'GOLF GTI',
//     });
//   });
// });

// describe('/car/v1 (Utils - formatBrandModel)', () => {
//   test('Se o codigo for 0', () => {
//     expect(getSituation('0')).toEqual('Veículo sem restrições.');
//   });

//   test('Se o codigo for 1', () => {
//     expect(getSituation('1')).toEqual('Veículo roubado ou furtado.');
//   });

//   test('Se o codigo qualquer outra coisa', () => {
//     expect(getSituation('10')).toEqual('10');
//     expect(getSituation('z')).toEqual('z');
//     expect(getSituation('anything')).toEqual('anything');
//   });
// });
