const AdmZip = require('adm-zip');
const request = require('request');

function requestCvmFile() {
  const file_url =
    'http://dados.cvm.gov.br/dados/INTERMED/CAD/DADOS/cad_intermed.zip';
  return new Promise(function (resolve, reject) {
    request.get({ url: file_url, encoding: null }, function (
      error,
      response,
      body
    ) {
      if (error) return reject(error);
      try {
        resolve(body);
      } catch (e) {
        reject(e);
      }
    });
  });
}

export const getExchangesData = async () => {
  const LINE_BREAK = '\r\n';

  return await requestCvmFile()
    .then((body) => {
      const zip = new AdmZip(body);
      const zipEntries = zip.getEntries();

      return zipEntries.map((entry) => {
        if (entry.entryName.match(/cad_intermed.csv/i)) {
          const body = zip.readAsText(entry, 'latin1');
          const lines = body.split(LINE_BREAK);

          // Remove o cabeçalho
          lines.shift();

          const mappedLines = lines
            .map((line) => line.split(';')) // Gera um array por coluna
            .filter(([type, cvmCode]) => type && cvmCode) // Filtra apenas linhas válidas
            .map(
              ([
                type, // Tipo de participante
                cnpj, // Cadastro Nacional de Pessoas Jurídicas (CNPJ)
                socialName, // Denominação Social
                commercialName, // Denominação Comercial
                registerDate, // Data de Registro
                cancelDate, // Data de Cancelamento
                cancelReason, // Motivo do Cancelamento
                status, // Situação
                statusInit, // Data Inicial do Status
                cvmCode, // Código da CVM
                sector, // Setor de Atividade
                stockControl, // Controle Acionário
                equityValue, // Patrimônio Líquido
                equityValueDate, // Data de Divulgação do Patrimônio Líquido
                addressType, // Tipo de Endereço
                address, // Logradouro
                obs, // Complemento
                neighborhood, // Bairro
                city, // Cidade
                state, // Estado
                country, // País
                cep, // CEP
              ]) => {
                return {
                  cnpj: cnpj.replace(/\D/gim, ''),
                  type,
                  socialName: socialName && socialName.trim(),
                  commercialName: commercialName && commercialName.trim(),
                  status,
                };
              }
            );
          return mappedLines;
        }
      })[0];
    })
    .catch((error) => {
      console.log('ERROR', error);
    });
};
