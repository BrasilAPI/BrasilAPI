import axios from 'axios';
import { Parser } from 'xml2js';
import * as Yup from 'yup';

function buildQuery(data) {
  return Object.entries(data)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
}

function xmlToJson(xml) {
  return new Promise((resolve, reject) => {
    const xmlParser = new Parser();
    xmlParser.parseString(xml, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

export function validateCorreiosShippingData(data) {
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

export async function calculateCorreiosShipping(data) {
  const response = await axios({
    url: 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPreco',
    method: 'POST',
    // quando `data` é uma string o conteúdo é enviado no corpo da requisição
    data: buildQuery(data),
  });
  const result = await xmlToJson(response.data);
  const shippingData = result.cResultado.Servicos[0].cServico[0];
  Object.getOwnPropertyNames(shippingData).forEach((property) => {
    [shippingData[property]] = shippingData[property];
  });
  return shippingData;
}

export const { ValidationError } = Yup;
