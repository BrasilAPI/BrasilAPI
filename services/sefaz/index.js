import axios from 'axios';
import ncmList from './ncmList.json';

function parseObject(obj) {
  const formatDate = (date) => {
    const newDate = new Date(date.split('/').reverse());
    return newDate.toISOString().slice(0, 10);
  };

  const convertKeysToLowerCase = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])
  );

  const {
    tipo_ato_ini,
    numero_ato_ini,
    ano_ato_ini,
    tipo_ato,
    numero_ato,
    ano_ato,
    data_inicio: dataInicio,
    data_fim: dataFim,
    ...rest
  } = convertKeysToLowerCase;

  const newObj = {
    ...rest,
    data_inicio: formatDate(dataInicio),
    data_fim: formatDate(dataFim),
    tipo_ato: tipo_ato_ini ?? tipo_ato,
    numero_ato: numero_ato_ini ?? numero_ato,
    ano_ato: ano_ato_ini ?? ano_ato,
  };

  return newObj;
}

const fetchNcmListFromSefaz = async () => {
  const url =
    'https://portalunico.siscomex.gov.br/classif/api/publico/nomenclatura/download/json';

  const { data: body } = await axios.get(url);

  return body;
};

export const getNcmData = async () => {
  try {
    const response = await fetchNcmListFromSefaz();
    return response.Nomenclaturas.map((el) => {
      return parseObject(el);
    });
  } catch (err) {
    return ncmList.Nomenclaturas.map((el) => {
      return parseObject(el);
    });
  }
};
