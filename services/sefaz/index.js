import axios from 'axios';
import ncmList from './ncmList.json';

/**
 * @param Date date
 * @return string
 */
function formatDate(date) {
  return date.toISOString().substr(0, 10);
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
      return {
        ...el,
        Data_Inicio: formatDate(el.Data_Inicio),
        Data_Fim: formatDate(el.Data_Fim),
      };
    });
  } catch (err) {
    return ncmList.Nomenclaturas.map((el) => {
      return {
        ...el,
        Data_Inicio: formatDate(el.Data_Inicio),
        Data_Fim: formatDate(el.Data_Fim),
      };
    });
  }
};
