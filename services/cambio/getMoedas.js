const axios = require('axios');

export const getMoedas = async () => {
  const resp = await axios.get(
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json`
  );
  return { infoMoedas: resp.data, statusMoedas: resp.status };
};
