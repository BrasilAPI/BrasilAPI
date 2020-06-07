const axios = require('axios');

const createServer = require('./helpers/server.js');
const server = createServer();

beforeAll(async () => {
  await server.start();
});

afterAll(async () => {
  await server.stop();
});

/**
 *  nCdServico - String
 *
 *   Código do serviço:
 *
 *    04014 = SEDEX à vista
 *    04065 = SEDEX à vista pagamento na entrega
 *    04510 = PAC à vista
 *    04707 = PAC à vista pagamento na entrega
 *    40169 = SEDEX12 ( à vista e a faturar)
 *    40215 = SEDEX 10 (à vista e a faturar)
 *    40290 = SEDEX Hoje Varejo
 */
describe('/shipping/v1/calculate-price (E2E)', () => {
  test('Utilizando payload válido, SEDEX à vista', async () => {
    const requestUrl = `${server.getUrl()}/api/shipping/v1/calculate-price`;
    const response = await axios.post(requestUrl, {
      nCdEmpresa: '',
      sDsSenha: '',
      nCdServico: '04014',
      sCepOrigem: '37410220',
      sCepDestino: '05311900',
      nVlPeso: '1',
      nCdFormato: '1',
      nVlComprimento: '20',
      nVlAltura: '5',
      nVlLargura: '15',
      nVlDiametro: '0',
      sCdMaoPropria: 'n',
      nVlValorDeclarado: '100',
      sCdAvisoRecebimento: 'n',
    });

    expect(response.data).toEqual({
      Codigo: '4014',
      Valor: '59,99',
      ValorMaoPropria: '0,00',
      ValorAvisoRecebimento: '0,00',
      ValorValorDeclarado: '1,59',
      Erro: '',
      MsgErro: '',
      ValorSemAdicionais: '58,40',
    });
  });

  test('Utilizando payload válido, PAC à vista', async () => {
    const requestUrl = `${server.getUrl()}/api/shipping/v1/calculate-price`;
    const response = await axios.post(requestUrl, {
      nCdEmpresa: '',
      sDsSenha: '',
      nCdServico: '04510',
      sCepOrigem: '37410220',
      sCepDestino: '05311900',
      nVlPeso: '1',
      nCdFormato: '1',
      nVlComprimento: '20',
      nVlAltura: '5',
      nVlLargura: '15',
      nVlDiametro: '0',
      sCdMaoPropria: 'n',
      nVlValorDeclarado: '100',
      sCdAvisoRecebimento: 'n',
    });

    expect(response.data).toEqual({
      Codigo: '4510',
      Valor: '30,99',
      ValorMaoPropria: '0,00',
      ValorAvisoRecebimento: '0,00',
      ValorValorDeclarado: '1,59',
      Erro: '',
      MsgErro: '',
      ValorSemAdicionais: '29,40',
    });
  });

  test('Utilizando payload invalido, dois campos faltantes', async () => {
    const requestUrl = `${server.getUrl()}/api/shipping/v1/calculate-price`;

    const response = await axios.post(
      requestUrl,
      {
        nCdEmpresa: '',
        sDsSenha: '',
        nCdServico: '04510',
        sCepOrigem: '',
        sCepDestino: '',
        nVlPeso: '1',
        nCdFormato: '1',
        nVlComprimento: '20',
        nVlAltura: '5',
        nVlLargura: '15',
        nVlDiametro: '0',
        sCdMaoPropria: 'n',
        nVlValorDeclarado: '100',
        sCdAvisoRecebimento: 'n',
      },
      {
        validateStatus: (status) => status === 422,
      }
    );

    expect(response.status).toEqual(422);
    expect(response.data).toEqual({
      name: 'ValidationError',
      errors: [
        'sCepOrigem is a required field',
        'sCepDestino is a required field',
      ],
      message: '2 errors occurred',
    });
  });
});
