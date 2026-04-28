import axios from 'axios';
import { describe, expect, test } from 'vitest';

import { testCorsForRoute } from './helpers/cors';

const validTestTableArray = expect.arrayContaining([
  expect.objectContaining({
    codigo: expect.any(Number),
    mes: expect.any(String),
  }),
]);

const validTestAutomakersArray = expect.arrayContaining([
  expect.objectContaining({
    nome: expect.any(String),
    valor: expect.any(String),
  }),
]);

const validTestVehicleArray = expect.arrayContaining([
  expect.objectContaining({
    valor: expect.any(String),
    marca: expect.any(String),
    modelo: expect.any(String),
    anoModelo: expect.any(Number),
    combustivel: expect.any(String),
    codigoFipe: expect.any(String),
    mesReferencia: expect.any(String),
    tipoVeiculo: expect.any(Number),
    siglaCombustivel: expect.any(String),
    dataConsulta: expect.any(String),
  }),
]);

const validTestVehiclesArray = expect.arrayContaining([
  expect.objectContaining({
    modelo: expect.any(String),
    valor: expect.any(String),
  }),
]);

const validTestYearsArray = expect.arrayContaining([
  expect.objectContaining({
    nome: expect.any(String),
    valor: expect.any(String),
  }),
]);

const validTestVehicleObject = expect.objectContaining({
  valor: expect.any(String),
  marca: expect.any(String),
  modelo: expect.any(String),
  anoModelo: expect.any(Number),
  combustivel: expect.any(String),
  codigoFipe: expect.any(String),
  mesReferencia: expect.any(String),
  tipoVeiculo: expect.any(Number),
  siglaCombustivel: expect.any(String),
  dataConsulta: expect.any(String),
});

// Smart service availability check using top-level await
let shouldSkipTests = false;

try {
  const response = await axios.post(
    'https://veiculos.fipe.org.br/api/veiculos/ConsultarTabelaDeReferencia',
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Referer: 'https://veiculos.fipe.org.br/',
      },
      timeout: 5000,
    }
  );

  if (response.status !== 200) {
    shouldSkipTests = true;
  }
} catch (error) {
  shouldSkipTests = true;
  console.warn(
    '⚠️  FIPE service unavailable or Cloudflare challenge detected - skipping tests'
  );
}

describe.skipIf(shouldSkipTests)('/fipe/tabelas/v1 (E2E)', () => {
  test('Listando as tabelas de referências', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/tabelas/v1`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestTableArray);
  });
});

describe.skipIf(shouldSkipTests)('/fipe/marcas/v1 (E2E)', () => {
  test('Listando as marcas sem tabela de referência', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestAutomakersArray);
  });
});

describe.skipIf(shouldSkipTests)('/fipe/preco/v1 (E2E)', () => {
  test('Buscando preço de veículo com código FIPE válido', async () => {
    const fipeCode = '015088-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestVehicleArray);
  });

  test('Buscando preço com código FIPE inválido', async () => {
    const fipeCode = '000000-0';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;

    try {
      await axios.get(requestUrl);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data).toMatchObject({
        name: 'NotFoundError',
        message: 'Código fipe inválido',
      });
    }
  });
});

describe.skipIf(shouldSkipTests)('/fipe/veiculos/v1 (E2E)', () => {
  test('Listando os modelos de veiculos com tipo de veiculo, marca e tabela de referência', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/veiculos/v1/carros/21?tabela_referencia=315`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestVehiclesArray);
  });

  test('Listando os modelos de veiculos com tipo de veiculo e marca, sem tabela de referência', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/veiculos/v1/carros/21`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestVehiclesArray);
  });
});

describe.skipIf(shouldSkipTests)('/fipe/anos/v1 (E2E)', () => {
  test('Listando os anos de um veiculo com tipo de veiculo, marca e modelo', async () => {
    // 21 = Fiat, 437 = 147 C/ CL
    const requestUrl = `${global.SERVER_URL}/api/fipe/anos/v1/carros/21/437`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestYearsArray);
  });

  test('Deve retornar erro para parametros inválidos na busca de anos', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/anos/v1/carros/00/00`;
    try {
      await axios.get(requestUrl);
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
});

describe.skipIf(shouldSkipTests)('/fipe/detalhes/v1 (E2E)', () => {
  test('Buscando detalhes de um veículo com tipo, marca, modelo e ano', async () => {
    // 21 = Fiat, 437 = 147 C/ CL, 1987-1 = 1987 Gasolina
    const requestUrl = `${global.SERVER_URL}/api/fipe/detalhes/v1/carros/21/437/1987-1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestVehicleObject);
  });

  test('Deve retornar erro para parametros inválidos na busca de detalhes', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/detalhes/v1/carros/21/437/0000-0`;
    try {
      await axios.get(requestUrl);
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
});

testCorsForRoute('/api/fipe/tabelas/v1');
testCorsForRoute('/api/fipe/marcas/v1');
testCorsForRoute('/api/fipe/preco/v1/015088-6');
testCorsForRoute('/api/fipe/veiculos/v1/carros/21');
testCorsForRoute('/api/fipe/anos/v1/carros/21/437');
testCorsForRoute('/api/fipe/detalhes/v1/carros/21/437/1987-1');
