import { fipePost } from './http';

export async function listReferenceTables() {
  try {
    const { data } = await fipePost(
      '/veiculos/ConsultarTabelaDeReferencia',
      {}
    );

    if (!Array.isArray(data)) {
      throw new Error('Retorno da FIPE inválido');
    }

    return data
      .map((item) => ({ codigo: item.Codigo, mes: item.Mes }))
      .sort((a, b) => b.codigo - a.codigo);
  } catch {
    throw new Error(
      'Fonte de dados FIPE temporariamente indisponível. Tente novamente mais tarde.'
    );
  }
}

export async function getLatestReferenceTable() {
  try {
    const tables = await listReferenceTables();

    return tables[0]?.codigo;
  } catch {
    // Fonte oficial indisponível: o fallback parallelum não depende da
    // tabela de referência, então seguimos sem ela.
    return undefined;
  }
}
