import axios from 'axios';
import banksList from './banksList.json';

const fetchBanksListFromBacen = async () => {
  const url =
    'https://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv';

  const { data: body } = await axios.get(url);

  return body;
};

const formatCsvFile = (file) => {
  const LINE_BREAK = '\r\n';
  const lines = file.split(LINE_BREAK);

  // Remove o cabeçalho
  lines.shift();

  return lines
    .map((line) => line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/g)) // Usa regex em vez de split(',') para corrigir problema de bancos com  "," no nome #476
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
      ]) => {
        return {
          ispb,
          name: name && name.trim(),
          code: Number(code),
          fullName: fullName && fullName.trim().replace(/\\"|"/g, ''), // Remove aspas
        };
      }
    );
};

export const getBanksData = async () => {
  try {
    const response = await fetchBanksListFromBacen();
    return formatCsvFile(response);
  } catch (err) {
    return banksList;
  }
};
