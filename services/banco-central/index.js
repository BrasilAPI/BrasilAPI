import getCsvAsJson from '@/util/getCsvAsJson';

import banksList from './banksList.json';

const formatCsvFile = (file) => {
  // Remove o cabeçalho
  file.shift();

  return file
    .filter(([ispb, , code]) => ispb && code)
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
        // Busca o banco no banksList para obter a localização da sede
        const bankData = banksList.find((bank) => bank.ispb === ispb);

        return {
          ispb,
          name: name && name.trim(),
          code: Number(code),
          fullName: fullName && fullName.trim().replace(/\\"|"/g, ''), // Remove aspas
          localizacao_sede: bankData?.localizacao_sede || '', // Endereço da sede do banco
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
