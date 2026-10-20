import axios from 'axios';
import { formatDate } from '@/services/date';

export const getCurrencyExchange = async (date, currency) => {
  const data = formatDate(date, 'MM-DD-YYYY');

  const resp = await axios.get(
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${currency}'&@dataCotacao='${data}'&$top=100&$format=json`
  );

  const output = resp.data.value.map((item) => ({
    paridade_compra: item.paridadeCompra,
    paridade_venda: item.paridadeVenda,
    cotacao_compra: item.cotacaoCompra,
    cotacao_venda: item.cotacaoVenda,
    data_hora_cotacao: item.dataHoraCotacao,
    tipo_boletim: item.tipoBoletim.toUpperCase(),
  }));
  return output;
};
