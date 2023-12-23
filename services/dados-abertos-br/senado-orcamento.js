import axios from 'axios';

export const getDadosDespesa = async () => {
  const data = await axios.get(
    'https://www.senado.gov.br/bi-arqs/Arquimedes/Financeiro/DespesaSenadoDadosAbertos.json'
  );
  return data;
};

export const getDadosReceita = async () => {
  const data = await axios.get(
    'https://www.senado.gov.br/bi-arqs/Arquimedes/Financeiro/ReceitasSenadoDadosAbertos.json'
  );
  return data;
};
