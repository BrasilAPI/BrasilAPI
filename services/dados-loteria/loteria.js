//recuperação de dados da última loteria
import axios from 'axios';
let tipoDeLoteria;
//Escolher tipo de loteria 
//Exemplo de tipo de loteria -  passar como parâmetro para a API

tipoDeLoteria = 'lotomania'

const URL_LOTERIAS = 'https://servicebus2.caixa.gov.br/portaldeloterias/api/${tipoDeLoteria}/';

export const getLoteriaResults = async () => {
  try {
    const response = await axios.get(URL_LOTERIAS);
    return response.data;
  } catch (error) {
    console.error("Error ao coletar dados da API", error);
    throw error;
  }
};

