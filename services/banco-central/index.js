import axios from 'axios';
import banksList from './banksList.json';

const fetchBanksListFromBacen = async () => {
  const url =
    'https://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv';

  const { data: body } = await axios.get(url);

  return body;
};

const fetchBanksList = async () => {
  try {
    return await fetchBanksListFromBacen();
  } catch (err) {
    return banksList;
  }
};

const formatCsvFile = (file) => {
  const LINE_BREAK = '\r\n';
  const lines = file.split(LINE_BREAK);

  // Remove o cabeçalho
  lines.shift();

  return lines
    .map((line) => line.split(',')) // Gera um array por coluna
    .filter(([ispb]) => ispb) // Filtra apenas linhas válidas
    .map(
      ([
        ispb, // ISPB
        name, // Nome_Reduzido
        code, // Número_Código // Participa_da_Compe // Acesso_Principal
        ,
        ,
        fullName, // Nome_Extenso // Início_da_Operação
        ,
      ]) => ({
        ispb,
        name: name && name.trim(),
        code: Number(code),
        fullName: fullName && fullName.trim(),
      })
    );
};

const formatResponse = (response) => {
  if (response[0].code && response[0].code === 1) {
    return response;
  }

  return formatCsvFile(response);
};

export const getBanksData = async () => {
  const response = await fetchBanksList();
  return formatResponse(response);
};
