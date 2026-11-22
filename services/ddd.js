import axios from 'axios';

const DDD_DATA_URL =
  'https://www.anatel.gov.br/dadosabertos/PDA/Codigo_Nacional/PGCN.csv';
const LINE_BREAK = '\r\n';

export const DDD_DATA_TIMEOUT = 3 * 1000;
export const DDD_DATA_CACHE_TTL = 24 * 60 * 60 * 1000;

let cachedDddsData = null;
let cachedAt = 0;
let inFlightRequest = null;

async function fetchDddsData() {
  const { data: reponseData } = await axios({
    url: DDD_DATA_URL,
    method: 'get',
    responseEncoding: 'binary',
    timeout: DDD_DATA_TIMEOUT,
  });

  const body = reponseData.toString('binary');

  const lines = body.split(LINE_BREAK);

  lines.shift();

  return lines
    .map((line) => line.split(';'))
    .map(([ibgeCode, state, city, ddd]) => {
      return {
        ibgeCode,
        state,
        city,
        ddd,
      };
    });
}

/**
 * Retorna os dados do Plano Geral de Códigos Nacionais (Anatel) no formato
 * `{ ibgeCode, state, city, ddd }[]`.
 *
 * O resultado é mantido em cache em memória por 24h (apenas respostas bem
 * sucedidas) e requisições concorrentes compartilham a mesma chamada.
 * O array retornado é compartilhado entre chamadas: não deve ser mutado.
 */
export const getDddsData = async () => {
  if (cachedDddsData && Date.now() - cachedAt < DDD_DATA_CACHE_TTL) {
    return cachedDddsData;
  }

  if (!inFlightRequest) {
    inFlightRequest = fetchDddsData()
      .then((dddsData) => {
        cachedDddsData = dddsData;
        cachedAt = Date.now();
        return dddsData;
      })
      .finally(() => {
        inFlightRequest = null;
      });
  }

  return inFlightRequest;
};

/**
 * Limpa o cache em memória. Uso destinado a testes.
 */
export const clearDddsDataCache = () => {
  cachedDddsData = null;
  cachedAt = 0;
  inFlightRequest = null;
};

/**
 * Normaliza nomes de municípios para comparação: remove acentos, converte
 * para maiúsculas, trata hífens e apóstrofos como espaço e colapsa espaços.
 * Ex.: "Mogi-Guaçu" -> "MOGI GUACU", "Santa Bárbara d'Oeste" ->
 * "SANTA BARBARA D OESTE".
 */
export const normalizeCityName = (name) =>
  String(name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[-'`\u00b4\u2018\u2019]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Localiza o DDD de um município nos dados retornados por `getDddsData`.
 * Prioriza o código IBGE do município; na ausência dele (ou se o código não
 * for encontrado), compara UF + nome normalizado (nomes de municípios são únicos dentro de uma UF).
 *
 * @returns {string|null} DDD com dois dígitos ou `null` se não encontrado.
 */
export const findDddByCity = (dddsData, { ibgeCode, state, city } = {}) => {
  if (!Array.isArray(dddsData)) {
    return null;
  }

  let match;

  if (ibgeCode !== null && ibgeCode !== undefined && ibgeCode !== '') {
    const code = String(ibgeCode).trim();
    match = dddsData.find((item) => item.ibgeCode === code);
  }

  if (!match && state && city) {
    const uf = String(state).trim().toUpperCase();
    const cityName = normalizeCityName(city);

    if (cityName) {
      match = dddsData.find(
        (item) =>
          item.state &&
          item.city &&
          String(item.state).toUpperCase() === uf &&
          normalizeCityName(item.city) === cityName
      );
    }
  }

  if (!match || !/^\d{2}$/.test(String(match.ddd))) {
    return null;
  }

  return String(match.ddd);
};
