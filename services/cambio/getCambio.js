const axios = require('axios');

export const getCambio = async (data, moeda) => {
  const resp = await axios.get(
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${moeda}'&@dataCotacao='${data}'&$top=100&$format=json`
  );
  return { info: resp.data, status: resp.status };
};
