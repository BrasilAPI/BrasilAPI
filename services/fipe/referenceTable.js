import axios from 'axios';

import { FIPE_URL } from './constants';

export async function listReferenceTables() {
  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarTabelaDeReferencia`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data
    .map((item) => ({ codigo: item.Codigo, mes: item.Mes }))
    .sort((a, b) => b.codigo - a.codigo);
}

export async function getLatestReferenceTable() {
  const tables = await listReferenceTables();
  return tables[0].codigo;
}
