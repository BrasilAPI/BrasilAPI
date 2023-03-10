import banksList from './banksList.json';
import getCsvAsJson from '../util/getCsvAsJson';

const formatCsvFile = (file) => {
  // Remove o cabeçalho
  file.shift();

  return file.map(
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
    const response = await getCsvAsJson(
      'https://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv'
    );
    return formatCsvFile(response);
  } catch (err) {
    return banksList;
  }
};
