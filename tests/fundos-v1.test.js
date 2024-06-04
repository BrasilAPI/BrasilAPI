const axios = require('axios');

expect.extend({
  nullOrString(received) {
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
  tipo_fundo: expect.any(String),
  cnpj: expect.any(String),
  denominacao_social: expect.any(String),
  data_registro: expect.nullOrString(),
  data_constituicao: expect.nullOrString(),
  codigo_cvm: expect.any(String),
  data_cancelamento: expect.nullOrString(),
  situacao: expect.any(String),
  data_inicio_situacao: expect.nullOrString(),
  data_inicio_atividade: expect.nullOrString(),
  data_inicio_exercicio: expect.nullOrString(),
  data_fim_exercicio: expect.nullOrString(),
  classe: expect.nullOrString(),
  data_inicio_classe: expect.nullOrString(),
  rentabilidade: expect.nullOrString(),
  condominio: expect.nullOrString(),
  cotas: expect.nullOrString(),
  fundo_exclusivo: expect.nullOrString(),
  tributacao_longo_prazo: expect.nullOrString(),
  publico_alvo: expect.nullOrString(),
  entidade_investimento: expect.nullOrString(),
  taxa_performance: expect.nullOrString(),
  informacao_taxa_performance: expect.nullOrString(),
  taxa_administracao: expect.nullOrString(),
  informacao_taxa_administracao: expect.nullOrString(),
  valor_patrimonio_liquido: expect.nullOrString(),
  data_patrimonio_liquido: expect.nullOrString(),
  diretor: expect.nullOrString(),
  cnpj_administrador: expect.nullOrString(),
  administrador: expect.nullOrString(),
  tipo_pessoa_gestor: expect.nullOrString(),
  cpf_cnpj_gestor: expect.nullOrString(),
  gestor: expect.nullOrString(),
  cnpj_auditor: expect.nullOrString(),
  auditor: expect.nullOrString(),
  cnpj_custodiante: expect.nullOrString(),
  custodiante: expect.nullOrString(),
  cnpj_controlador: expect.nullOrString(),
  controlador: expect.nullOrString(),
  investimento_externo: expect.nullOrString(),
  classe_anbima: expect.nullOrString(),
});

const validFunds = expect.objectContaining({
  data: expect.arrayContaining([
    expect.objectContaining({
      cnpj: expect.any(String),
      denominacao_social: expect.any(String),
      codigo_cvm: expect.any(String),
      tipo_fundo: expect.any(String),
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
