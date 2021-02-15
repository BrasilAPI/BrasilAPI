import * as Yup from 'yup';
import makeRequest from '../soapRequestService';

export function validateShippingData(data) {
  return Yup.object()
    .shape({
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
    })
    .validate(data, {
      abortEarly: false,
      stripUnknown: true,
    });
}

export async function calculateShipping(data) {
  const endpoint = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPreco';
  const result = await makeRequest(endpoint, 'POST', {
    nCdEmpresa: data.nCdEmpresa,
    sDsSenha: data.sDsSenha,
    nCdServico: data.nCdServico,
    sCepOrigem: data.sCepOrigem,
    sCepDestino: data.sCepDestino,
    nVlPeso: data.nVlPeso,
    nCdFormato: data.nCdFormato,
    nVlComprimento: data.nVlComprimento,
    nVlAltura: data.nVlAltura,
    nVlLargura: data.nVlLargura,
    nVlDiametro: data.nVlDiametro,
    sCdMaoPropria: data.sCdMaoPropria,
    nVlValorDeclarado: data.nVlValorDeclarado,
    sCdAvisoRecebimento: data.sCdAvisoRecebimento,
  });
  const shippingData = result.cResultado.Servicos[0].cServico[0];
  Object.getOwnPropertyNames(shippingData).forEach((property) => {
    [shippingData[property]] = shippingData[property];
  });
  return shippingData;
}
