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
  if (!intermediatorsEntry) {
    throw new Error('File not found');
  }

  const intermediatorFile = zip.readAsText(intermediatorsEntry, 'latin1');
  const lines = intermediatorFile.split(LINE_BREAK);
  lines.shift();

  try {
    const mappedLines = lines
      .map((line) => line.split(';')) // Gera um array por coluna
      .filter(([type, cnpj]) => type === 'CORRETORAS' && cnpj)
      .map(
        ([
          type, // Tipo de participante
          cnpj, // Cadastro Nacional de Pessoas Jurídicas (CNPJ)
          socialName, // Denominação Social
          commercialName, // Denominação Comercial
          registerDate, // Data de Registro // Data de Cancelamento // Motivo do Cancelamento
          ,
          ,
          status, // Situação
          statusInit, // Data Inicial do Status
          cvmCode, // Código da CVM // Setor de Atividade // Controle Acionário
          ,
          ,
          equityValue, // Patrimônio Líquido
          equityValueDate, // Data de Divulgação do Patrimônio Líquido // Tipo de Endereço
          ,
          address, // Logradouro
          obs, // Complemento
          neighborhood, // Bairro
          city, // Cidade
          state, // Estado
          country, // País
          cep, // CEP // DDD Telefone
          ,
          tel, // Telefone // DDD Fax // Fax
          ,
          ,
          email, // Email
        ]) => ({
          cnpj: cnpj.replace(/\D/gim, ''),
          type,
          nome_social: socialName ? socialName.trim() : '',
          nome_comercial: commercialName ? commercialName.trim() : '',
          status,
          email,
          telefone: tel,
          cep,
          pais: country,
          uf: state,
          municipio: city,
          bairro: neighborhood,
          complemento: obs,
          logradouro: address,
          data_patrimonio_liquido: equityValueDate,
          valor_patrimonio_liquido: equityValue,
          codigo_cvm: cvmCode,
          data_inicio_situacao: statusInit,
          data_registro: registerDate,
        })
      )
      .filter((item) => item.type === 'CORRETORAS');
    return mappedLines;
  } catch (err) {
    throw new Error(err);
  }
}

export const getExchangesData = async () => {
  const zipFile = await requestCvmFile();

  return getIntermediatorsFromZip(zipFile.data);
};
