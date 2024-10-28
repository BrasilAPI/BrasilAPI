import axios from 'axios';

const URL_BULLETINS =
  "https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='#moeda'&@dataCotacao='#dataCotacao'&$top=100&$format=json";

export const getBulletins = async (query) => {
  const { moeda, dataCotacao } = query;
  const url = URL_BULLETINS.replace('#moeda', moeda).replace(
    '#dataCotacao',
    dataCotacao
  );
  const { data } = await axios.get(url);

  return data.value;
};
