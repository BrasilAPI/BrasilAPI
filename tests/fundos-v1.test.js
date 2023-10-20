const axios = require('axios');

expect.extend({
  nullOrAny(received) {
    return {
      pass:
        typeof received === 'string' ||
        received instanceof String ||
        received === null,
      message: () =>
        `expected null or string, but received ${this.utils.printReceived(
          received
        )}`,
    };
  },
});
const validOutputSchema = expect.objectContaining({
  tipoFundo: expect.nullOrAny(),
  cnpj: expect.nullOrAny(),
  denominacaoSocial: expect.nullOrAny(),
  dataRegistro: expect.nullOrAny(),
  dataConstituicao: expect.nullOrAny(),
  codigoCvm: expect.nullOrAny(),
  dataCancelamento: expect.nullOrAny(),
  situacao: expect.nullOrAny(),
  dataInicioSituacao: expect.nullOrAny(),
  dataInicioAtividade: expect.nullOrAny(),
  dataInicioExercicio: expect.nullOrAny(),
  dataFimExercicio: expect.nullOrAny(),
  classe: expect.nullOrAny(),
  dataInicioClasse: expect.nullOrAny(),
  rentabilidade: expect.nullOrAny(),
  condominio: expect.nullOrAny(),
  cotas: expect.nullOrAny(),
  fundoExclusivo: expect.nullOrAny(),
  tributacaoLongoPrazo: expect.nullOrAny(),
  publicoAlvo: expect.nullOrAny(),
  entidadeInvestimento: expect.nullOrAny(),
  taxaPerformance: expect.nullOrAny(),
  informacaoTaxaPerformance: expect.nullOrAny(),
  taxaAdministracao: expect.nullOrAny(),
  informacaoTaxaAdministracao: expect.nullOrAny(),
  valorPatrimonioLiquido: expect.nullOrAny(),
  dataPatrimonioLiquido: expect.nullOrAny(),
  diretor: expect.nullOrAny(),
  cnpjAdministrador: expect.nullOrAny(),
  administrador: expect.nullOrAny(),
  tipoPessoaGestor: expect.nullOrAny(),
  cpfCnpjGestor: expect.nullOrAny(),
  gestor: expect.nullOrAny(),
  cnpjAuditor: expect.nullOrAny(),
  auditor: expect.nullOrAny(),
  cnpjCustodiante: expect.nullOrAny(),
  custodiante: expect.nullOrAny(),
  cnpjControlador: expect.nullOrAny(),
  controlador: expect.nullOrAny(),
  investimentoExterno: expect.nullOrAny(),
  classeAnbima: expect.nullOrAny(),
});

const validFunds = expect.objectContaining({
  data: expect.arrayContaining([
    expect.objectContaining({
      cnpj: expect.any(String),
      denominacaoSocial: expect.any(String),
      codigoCvm: expect.any(String),
      tipoFundo: expect.any(String),
      situacao: expect.any(String),
    }),
  ]),
  size: expect.any(Number),
  page: expect.any(Number),
});

describe('funds v1 (E2E)', () => {
  describe('GET /cvm/fundos/v1/:cnpj', () => {
    test('Utilizando um CNPJ válido: 00000684000121', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/fundos/v1/00000684000121`;
      const response = await axios.get(requestUrl);

      expect(response.status).toBe(200);
      expect(response.data).toEqual(validOutputSchema);
    });

    test('Utilizando um CNPJ inexistente: 1111111', async () => {
      const requestUrl = `${global.SERVER_URL}/api/cvm/fundos/v1/1111111`;

      try {
        await axios.get(requestUrl);
      } catch (error) {
        const { response } = error;

        expect(response.status).toBe(404);
        expect(response.data).toMatchObject({
          message: 'Fundo não encontrado',
          type: 'not_found',
          name: 'NotFoundError',
        });
      }
    });
  });

  test('GET /cvm/fundos/v1', async () => {
    const requestUrl = `${global.SERVER_URL}/api/cvm/fundos/v1`;
    const response = await axios.get(requestUrl);

    expect(response.status).toBe(200);
    expect(response.data).toEqual(validFunds);
  });
});
