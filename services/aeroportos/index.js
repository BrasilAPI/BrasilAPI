import axios from 'axios';
import aeroportosList from './aeroportosList.json';

export const getAeroportosData = async () => {
  try {
    const url =
      'https://sistemas.anac.gov.br/dadosabertos/Aerodromos/Lista%20de%20aer%C3%B3dromos%20p%C3%BAblicos/AerodromosPublicos.json';
    const { data: responseData } = await axios({
      url,
      method: 'get',
    });
    return responseData.map((objeto) => {
      return {
        CodigoOACI: objeto.CódigoOACI,
        NomeAeroporto: objeto.Nome,
        Cidade: objeto.Município,
        Estado: objeto.UF,
        LatGeoPoint: objeto.LatGeoPoint,
        LonGeoPoint: objeto.LonGeoPoint,
      };
    });
  } catch (err) {
    return aeroportosList;
  }
};
