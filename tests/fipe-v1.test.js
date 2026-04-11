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
  }),
]);

describe('/fipe/tabelas/v1 (E2E)', () => {
  test('Listando as tabelas de referências', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/tabelas/v1`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestTableArray);
  });
});

describe('/fipe/marcas/v1 (E2E)', () => {
  test('Listando as marcas sem tabela de referência', async () => {
    const requestUrl = `${global.SERVER_URL}/api/fipe/marcas/v1`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestAutomakersArray);
  });
});

describe('/fipe/preco/v1 (E2E)', () => {
  test('Buscando preço de veículo com código FIPE válido', async () => {
    const fipeCode = '015088-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    const response = await axios.get(requestUrl);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestVehicleArray);
  });

  test('Buscando preço com código FIPE inválido', async () => {
    const fipeCode = 'AAAAAA-6';
    const requestUrl = `${global.SERVER_URL}/api/fipe/preco/v1/${fipeCode}`;
    let result;
    try {
      await axios.get(requestUrl);
    } catch ({ response }) {
      result = {
        status: response.status,
        data: response.data,
      };
    }
    expect(result.status).toBe(400);
    expect(result.data).toEqual({
      name: 'BadRequestError',
      message: 'Código fipe inválido',
      type: 'bad_request',
    });
  });
});

describe('/fipe/veiculos/v1 (E2E)', () => {
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

testCorsForRoute('/api/fipe/tabelas/v1');
testCorsForRoute('/api/fipe/marcas/v1');
testCorsForRoute('/api/fipe/preco/v1/015088-6');
testCorsForRoute('/api/fipe/veiculos/v1/carros/21');
