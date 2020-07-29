import microCors from 'micro-cors';
import * as Yup from 'yup';

import SOAPRequestService from '../../../../src/services/soapRequestService';

const bodySchema = Yup.object().shape({
  nCdEmpresa: Yup.string(),
  sDsSenha: Yup.string(),
  nCdServico: Yup.string().required(),
  sCepOrigem: Yup.string().required(),
  sCepDestino: Yup.string().required(),
  nVlPeso: Yup.string().required(),
  nCdFormato: Yup.string().required(),
  nVlComprimento: Yup.string().required(),
  nVlAltura: Yup.string().required(),
  nVlLargura: Yup.string().required(),
  nVlDiametro: Yup.string().required(),
  sCdMaoPropria: Yup.string(),
  nVlValorDeclarado: Yup.string(),
  sCdAvisoRecebimento: Yup.string(),
});

const cors = microCors();

async function ShippingPrice(request, response) {
  if (request.method !== 'POST') {
    response.status(405);
    response.json({
      error: {
        message:
          'This method is not allowed for this route, try POST with a valid request body',
        more_info: 'httos://brasilapi.com.br',
      },
    });
    return;
  }

  try {
    await bodySchema.validate(request.body, {
      abortEarly: false,
      stripUnknown: true,
    });
  } catch (err) {
    delete err.value;
    delete err.inner;

    response.status(422);
    return response.json(err);
  }

  try {
    const soapRequestService = new SOAPRequestService();
    const result = await soapRequestService.makeRequest(
      'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPreco',
      'POST',
      {
        nCdEmpresa: request.body.nCdEmpresa,
        sDsSenha: request.body.sDsSenha,
        nCdServico: request.body.nCdServico,
        sCepOrigem: request.body.sCepOrigem,
        sCepDestino: request.body.sCepDestino,
        nVlPeso: request.body.nVlPeso,
        nCdFormato: request.body.nCdFormato,
        nVlComprimento: request.body.nVlComprimento,
        nVlAltura: request.body.nVlAltura,
        nVlLargura: request.body.nVlLargura,
        nVlDiametro: request.body.nVlDiametro,
        sCdMaoPropria: request.body.sCdMaoPropria,
        nVlValorDeclarado: request.body.nVlValorDeclarado,
        sCdAvisoRecebimento: request.body.sCdAvisoRecebimento,
      }
    );

    response.status(200);
    return response.json(result);
  } catch (err) {
    response.status(500);

    return response.json({
      error: {
        message: 'Internal Server Error',
      },
    });
  }
}

export default cors(ShippingPrice);
