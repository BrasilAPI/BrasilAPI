import NotFoundError from '@/errors/NotFoundError';
import axios from 'axios';

const API_URL = 'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores'; 

export const getServidores = async (tipoVinculoEquals, situacaoEquals, lotacaoEquals, cargoEquals) => {
  
  var params = "";

  if(tipoVinculoEquals != null)
    params = `tipoVinculoEquals=${tipoVinculoEquals}`;

  if(situacaoEquals != null)
    params += (params == "") ? `tipoVinculoEquals=${situacaoEquals}` : `&tipoVinculoEquals=${situacaoEquals}`;

  if(lotacaoEquals != null)
    params += (params == "") ? `tipoVinculoEquals=${lotacaoEquals}` : `&tipoVinculoEquals=${lotacaoEquals}`;

  if(cargoEquals != null)
    params += (params == "") ? `tipoVinculoEquals=${lotacaoEquals}` : `&tipoVinculoEquals=${lotacaoEquals}`

  if(params != "")
    params = "?" + params;

  return axios.get(API_URL +'/servidores' + params);
}


export const getPensioners = async () => {
  const endpoint = API_URL + '/pensionistas';
   return axios.get(endpoint);
  
}


export const getServidoresInativos = async () => {
  const endpoint = API_URL + '/servidores/inativos';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getServidoresEfetivos = async () => {
  const endpoint = API_URL + '/servidores/efetivos';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getServidoresComissionados = async () => {
  const endpoint = API_URL + '/servidores/comissionados';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getServidoresAtivos = async () => {
  const endpoint = API_URL + '/servidores/ativos';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getRemuneracoes = async (ano, mes) => {

  const endpoint = API_URL + '/remuneracoes/' + ano + '/' + mes;
  const { data } = await axios.get(endpoint);

  return data;
}

export const getQuantitativosPessoal = async () => {

  const endpoint = API_URL + '/quantitativos/pessoal';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getQuantitativosCargosFuncoes = async () => {

  const endpoint = API_URL + '/quantitativos/cargos-funcoes';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getPrevisaoAposentadoria = async () => {

  const endpoint = API_URL + '/previsao-aposentadoria';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getRemuneracoesPensionistas = async (ano, mes) => {

  const endpoint = API_URL + '/pensionistas/remuneracoes/' + ano + '/' + mes;
  const { data } = await axios.get(endpoint);

  return data;
}

export const getLotacoes = async () => {

  const endpoint = API_URL + '/lotacoes';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getHorasExtra = async (ano, mes) => {

  const endpoint = API_URL + '/horas-extras/' + ano + '/' + mes;
  const { data } = await axios.get(endpoint);

  return data;
}

export const getEstagiarios = async () => {

  const endpoint = API_URL + '/estagiarios';
  const { data } = await axios.get(endpoint);

  return data;
}

export const getCargos = async () => {
  const endpoint = API_URL + '/cargos';
  const { data } = await axios.get(endpoint);

  return data;
}