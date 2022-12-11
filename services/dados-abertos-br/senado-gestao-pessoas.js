import axios from 'axios';

export const getDadosServidoresInativos = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/servidores/inativos'
  );
  return data;
};

export const getDadosServidoresPensionistas = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/pensionistas'
  );
  return data;
};

export const getDadosServidoresEstagiarios = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/estagiarios'
  );
  return data;
};

export const getDadosServidoresEfetivos = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/servidores/efetivos'
  );
  return data;
};

export const getDadosServidoresAtivos = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/servidores/ativos'
  );
  return data;
};

export const getDadosServidoresDisponibilizados = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/servidores'
  );
  return data;
};

export const getDadosServidoresComissionados = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/servidores/comissionados'
  );
  return data;
};

export const getDadosServidoresTerceirizados = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/contratacoes/terceirizados'
  );
  return data;
};

export const getDadosServidoresPensionistasPrevisao = async () => {
  const data = await axios.get(
    'https://adm.senado.gov.br/adm-dadosabertos/api/v1/servidores/previsao-aposentadoria'
  );
  return data;
};
