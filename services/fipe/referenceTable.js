import { fipePost } from './http';
import { parallelumListTabelas } from './parallelum';

const REFERENCE_TABLES_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

let referenceTablesCache = {
  data: null,
  expiresAt: 0,
};

let inFlightRequest = null;
let cacheEpoch = 0;

export function clearReferenceTablesCache() {
  cacheEpoch += 1;
  referenceTablesCache = {
    data: null,
    expiresAt: 0,
  };
  inFlightRequest = null;
}

async function fetchReferenceTables() {
  try {
    const { data } = await fipePost(
      '/veiculos/ConsultarTabelaDeReferencia',
      {},
      parallelumListTabelas
    );

    if (!Array.isArray(data) || data.length === 0) {
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

export async function listReferenceTables() {
  if (
    referenceTablesCache.data &&
    referenceTablesCache.expiresAt > Date.now()
  ) {
    return [...referenceTablesCache.data];
  }

  if (!inFlightRequest) {
    const requestEpoch = cacheEpoch;
    inFlightRequest = fetchReferenceTables()
      .then((tables) => {
        if (requestEpoch === cacheEpoch) {
          referenceTablesCache = {
            data: tables,
            expiresAt: Date.now() + REFERENCE_TABLES_CACHE_TTL_MS,
          };
        }
        return tables;
      })
      .finally(() => {
        if (requestEpoch === cacheEpoch) {
          inFlightRequest = null;
        }
      });
  }

  const tables = await inFlightRequest;
  return [...tables];
}

export async function getLatestReferenceTable() {
  try {
    const tables = await listReferenceTables();

    return tables[0]?.codigo;
  } catch {
    // Fonte oficial e fallback indisponíveis: o fallback parallelum das
    // demais rotas não depende da tabela de referência, então seguimos sem ela.
    return undefined;
  }
}
