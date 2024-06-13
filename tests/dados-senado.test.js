const axios = require('axios');

const URL_SERVIDORES = `${global.SERVER_URL}/api/senado/v1/gestao/servidores`;

const URL_ORCAMENTO = `${global.SERVER_URL}/api/senado/v1/orcamento`;

const URL_QUANTITANTIVOS = `${global.SERVER_URL}/api/senado/v1/quantitativos`;


const validTestArray = expect.arrayContaining([
  expect.objectContaining({
    nome: expect.any(String),
  }),
]);

describe('api/senado/v1/gestao/servidores (E2E)', () => {
  test('Pesquisando Relação de servidores efetivos do Governo do Distrito Federal à disposição do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/efetivos (E2E)', () => {
  test('Pesquisando Relação de servidores efetivos do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/efetivos`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/ativos (E2E)', () => {
  test('Pesquisando Relação de servidores ativos do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/ativos`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/estagiarios (E2E)', () => {
  test('Pesquisando Relação de servidores estagiarios do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/estagiarios`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/terceirizados (E2E)', () => {
  test('Pesquisando Relação de servidores terceirizados do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/terceirizados`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/comissionados (E2E)', () => {
  test('Pesquisando Relação de servidores comissionados do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/comissionados`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

// Testes da parte de aposentadoria
describe('api/senado/v1/gestao/servidores/aposentadoria/inativos (E2E)', () => {
  test('Pesquisando Relação de Ex-Servidores Aposentados no IPC do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/aposentadoria/inativos`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/aposentadoria/pensionistas (E2E)', () => {
  test('Pesquisando Relação de Pensionistas de Servidores no IPC do Senado Federal', async () => {
    const response = await axios.get(`${URL_SERVIDORES}/aposentadoria/pensionistas`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArray);
  });
});

describe('api/senado/v1/gestao/servidores/aposentadoria/previsao (E2E)', () => {
  test('Pesquisando Relação de Previsão de aposentadoria de Servidores no IPC do Senado Federal', async () => {

    const validTestArrayToPrevisao = expect.arrayContaining([
      expect.objectContaining({
        cargo: { nome: expect.any(String) },
        categoria: { nome: expect.any(String), codigo: expect.any(String) },
        quantidade: expect.any(Number),
        mes_ano: expect.any(String)
      }),
    ]);

    const response = await axios.get(`${URL_SERVIDORES}/aposentadoria/previsao`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArrayToPrevisao);
  });
});

// Testes da parte de orçamento
describe('api/senado/v1/orcamento/despesa (E2E)', () => {
  test('Pesquisando Dados relativos à dotação inicial e final alocada ao Senado Federal', async () => {
    /**
     * Dados relativos à dotação inicial e final alocada ao Senado Federal nos orçamentos anuais, bem como os valores das despesas empenhadas, liquidadas e pagas à conta desses créditos orçamentários, a partir de 2013 (área responsável pela elaboração: Secretaria de Finanças, Orçamento e Contabilidade - SAFIN).
     */

    const validTestArrayToOrcamento = expect.arrayContaining([
      expect.objectContaining({
        acao_nome: expect.any(String),
        valor_liquidado: expect.any(String)
      }),
    ]);

    const response = await axios.get(`${URL_ORCAMENTO}/despesa`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArrayToOrcamento);
  });
});

describe('api/senado/v1/orcamento/receita (E2E)', () => {
  test('Pesquisando Dados relativos à previsão e à arrecadação de receitas próprias pelo Senado Federal a partir de 2012', async () => {
    /**
     * Dados relativos à previsão e à arrecadação de receitas próprias pelo Senado Federal a partir de 2012 (área responsável pela elaboração: Secretaria de Finanças, Orçamento e Contabilidade - SAFIN).
     */

    const validTestArrayToOrcamento = expect.arrayContaining([
      expect.objectContaining({
        ano: expect.any(String),
        categoria_economica_cod_desc: expect.any(String)
      }),
    ]);

    const response = await axios.get(`${URL_ORCAMENTO}/receita`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArrayToOrcamento);
  });
});

// Teste da parte de quantitantivos
describe('api/senado/v1/quantitativos/cargos-funcoes (E2E)', () => {
  test('Pesquisando Dados que Relaciona o quantitativo de cargos em comissão e funções de confiança do Senado Federal.', async () => {
    /**
     * Relaciona o quantitativo de cargos em comissão e funções de confiança do Senado Federal.
     */

    const validTestArrayToQuantitativos = expect.arrayContaining([
      expect.objectContaining({
        nivel: expect.any(String),
        tabVenc: expect.any(String)
      }),
    ]);

    const response = await axios.get(`${URL_QUANTITANTIVOS}/cargos-funcoes`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArrayToQuantitativos);
  });
});

// Teste da parte de quantitantivos
describe('api/senado/v1/quantitativos/pessoal (E2E)', () => {
  test('Pesquisando Dados que Relaciona aos quantitativos físicos de servidores efetivos, ativos, aposentados e pensionistas Senado Federal.', async () => {
    /**
     * Apresenta as informações concernentes aos quantitativos físicos de servidores efetivos, ativos, aposentados e pensionistas
     */

    const validTestArrayToQuantitativos = expect.arrayContaining([
      expect.objectContaining({
        classe: expect.any(String),
        plano_carreira: expect.any(String)
      }),
    ]);

    const response = await axios.get(`${URL_QUANTITANTIVOS}/pessoal`);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(validTestArrayToQuantitativos);
  });
});