const AdmZip = require('adm-zip');
const axios = require('axios');

const LINE_BREAK = '\r\n';

async function requestCvmFile() {
  const fileUrl =
    'http://dados.cvm.gov.br/dados/INTERMED/CAD/DADOS/cad_intermed.zip';
  return axios.get(fileUrl, {
    responseType: 'arraybuffer',
  });
}

function getIntermediatorsFromZip(data) {
  const zip = new AdmZip(data);
  const zipEntries = zip.getEntries();

  const intermediatorsEntry = zipEntries.find((entry) =>
    entry.entryName.match(/cad_intermed.csv/i)
  );
   if (!intermediatorsEntry){
       throw new Error('File not found')
   }
  const intermediatorFile = zip.readAsText(intermediatorsEntry, 'latin1');
  const lines = intermediatorFile.split(LINE_BREAK);
  lines.shift();

  const mappedLines = lines
    .map((line) => line.split(';')) // Gera um array por coluna
    .filter(([type, cnpj]) => type && cnpj) // Filtra apenas linhas válidas
    .map(
      ([
        type, // Tipo de participante
        cnpj, // Cadastro Nacional de Pessoas Jurídicas (CNPJ)
        socialName, // Denominação Social
        commercialName, // Denominação Comercial // Data de Registro // Data de Cancelamento // Motivo do Cancelamento
        ,
        ,
        ,
        status, // Situação
      ]) => {
        return {
          cnpj: cnpj.replace(/\D/gim, ''),
          type,
          socialName: socialName ? socialName.trim() : '',
          commercialName: commercialName ? commercialName.trim() : '',
          status,
        };
      }
    )
    .filter((item) => item.status === 'EM FUNCIONAMENTO NORMAL' && item.type === 'CORRETORAS')
    .map((corretora) => ({
        cnpj: corretora.cnpj,
        nome_social: corretora.socialName,
        nome_comercial: corretora.commercialName,
    });
  return mappedLines;
}

export const getExchangesData = async () => {
  const zipFile = await requestCvmFile();

  return getIntermediatorsFromZip(zipFile.data);
};
