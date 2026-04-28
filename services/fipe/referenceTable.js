import axios from 'axios';

import { FIPE_URL } from './constants';

export async function listReferenceTables() {
  try {
    const { data } = await axios.post(
      `${FIPE_URL}/veiculos/ConsultarTabelaDeReferencia`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (!Array.isArray(data)) {
      throw new Error('Retorno da FIPE inválido');
    }

    return data
      .map((item) => ({ codigo: item.Codigo, mes: item.Mes }))
      .sort((a, b) => b.codigo - a.codigo);
  } catch (error) {
    throw new Error('Erro ao buscar tabelas de referência');
  }
}

export async function getLatestReferenceTable() {
  const tables = await listReferenceTables();
  if (tables && tables.length > 0) {
    return tables[0].codigo;
  }
  throw new Error('Nenhuma tabela de referência encontrada');
}
