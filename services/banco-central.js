import axios from 'axios';

export const getBanksData = async () => {
  const url =
    'http://www.bcb.gov.br/pom/spb/estatistica/port/ParticipantesSTRport.csv';
  const LINE_BREAK = '\r\n';

  const { data: body } = await axios.get(url);

  const lines = body.split(LINE_BREAK);

  // Remove o cabeçalho
  lines.shift();

  return lines
    .map((line) => line.split(',')) // Gera um array por coluna
    .filter(([ispb]) => ispb) // Filtra apenas linhas válidas
    .map(
      ([
        ispb, // ISPB
        name, // Nome_Reduzido
        code, // Número_Código
        , // Participa_da_Compe
        , // Acesso_Principal
        fullName, // Nome_Extenso
        , // Início_da_Operação
      ]) => {
        return {
          ispb,
          name: name && name.trim(),
          code: Number(code),
          fullName: fullName && fullName.trim(),
        };
      }
    );
};
