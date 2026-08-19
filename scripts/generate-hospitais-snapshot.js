/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');

const ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_DIR = path.join(ROOT, 'services', 'hospitais', 'snapshots');
const LATEST_PATH = path.join(SNAPSHOT_DIR, 'latest.json');
const METRICS_PATH = path.join(SNAPSHOT_DIR, 'metrics-latest.json');

const DEFAULT_MAPASUS_BASE_URL = 'https://api.mapasus.com.br';

// O override de ambiente existe para apontar para uma instância própria do
// MapaSUS (o projeto é open source). A string crua do ambiente nunca entra
// nas URLs das requisições: precisa parsear como http(s) — new URL lança em
// valor malformado — e só a origem normalizada é usada.
const resolveMapasusBaseUrl = () => {
  const override = process.env.MAPASUS_BASE_URL;

  if (!override) {
    return DEFAULT_MAPASUS_BASE_URL;
  }

  const url = new URL(override);

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`MAPASUS_BASE_URL deve ser http(s): ${url.protocol}`);
  }

  return url.origin;
};

const MAPASUS_BASE_URL = resolveMapasusBaseUrl();

// O MapaSUS roda inteiramente em free tier e limita a 15 req/min por IP.
// Este script é o único ponto do BrasilAPI que toca aquele serviço, então
// serializa as chamadas e espera entre elas para ficar bem abaixo do teto.
const PAGE_SIZE = 500;
const DELAY_BETWEEN_REQUESTS_IN_MS = 5000;
const RATE_LIMIT_BACKOFF_IN_MS = 65000;
const REQUEST_TIMEOUT_IN_MS = 30000;
const USER_AGENT = 'brasilapi-hospitais-snapshot';

const VERTICALS = [
  { slug: 'peconhentos', mapasus: 'venomous-animals' },
  { slug: 'oncologia', mapasus: 'oncology' },
  { slug: 'raras', mapasus: 'rare-diseases' },
];

const MINIMUM_ACCEPTABLE_RATIO = 0.8;

// A API do MapaSUS exige ao menos um filtro por chamada (proteção anti-crawl),
// então a coleta é particionada por UF. Usado só se /v1/states falhar.
const UF_FALLBACK = [
  'AC',
  'AL',
  'AM',
  'AP',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MG',
  'MS',
  'MT',
  'PA',
  'PB',
  'PE',
  'PI',
  'PR',
  'RJ',
  'RN',
  'RO',
  'RR',
  'RS',
  'SC',
  'SE',
  'SP',
  'TO',
];

const sleep = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// Tudo que chega da resposta HTTP do MapaSUS é dado externo: contagens que
// vão para logs e métricas passam por aqui para garantir que só números
// validados sejam gravados/impressos.
const contagemSegura = (value) => Number.parseInt(value, 10) || 0;

const readJsonFile = (filePath, fallbackValue) => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.warn(
      `Ignorando ${filePath} ilegível (${error.message}); usando fallback`
    );
    return fallbackValue;
  }
};

const writeJsonFile = (filePath, value) => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const get = async (endpoint) => {
  const request = () =>
    axios.get(new URL(endpoint, MAPASUS_BASE_URL).toString(), {
      timeout: REQUEST_TIMEOUT_IN_MS,
      headers: { 'User-Agent': USER_AGENT },
    });

  try {
    return (await request()).data;
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('  429 recebido, aguardando a janela de rate limit...');
      await sleep(RATE_LIMIT_BACKOFF_IN_MS);
      return (await request()).data;
    }

    throw error;
  }
};

const fetchStateHospitals = async (mapasus, uf) => {
  const hospitals = [];
  let offset = 0;

  for (;;) {
    const endpoint = `/v1/${mapasus}/hospitals?state_code=${uf}&limit=${PAGE_SIZE}&offset=${offset}`;

    // eslint-disable-next-line no-await-in-loop
    const page = await get(endpoint);
    const items = Array.isArray(page.hospitals) ? page.hospitals : [];

    hospitals.push(...items);

    if (items.length < PAGE_SIZE) {
      break;
    }

    offset += PAGE_SIZE;
    // eslint-disable-next-line no-await-in-loop
    await sleep(DELAY_BETWEEN_REQUESTS_IN_MS);
  }

  return hospitals;
};

const fetchVertical = async ({ slug, mapasus }, ufs) => {
  const hospitals = [];

  // Sequencial de propósito (rate limit do MapaSUS) — por isso o await no loop.
  // eslint-disable-next-line no-restricted-syntax
  for (const uf of ufs) {
    // eslint-disable-next-line no-await-in-loop
    hospitals.push(...(await fetchStateHospitals(mapasus, uf)));
    // eslint-disable-next-line no-await-in-loop
    await sleep(DELAY_BETWEEN_REQUESTS_IN_MS);
  }

  console.log(`  ${slug}: ${contagemSegura(hospitals.length)} registros`);
  return hospitals;
};

const unir = (a = [], b = []) => [...new Set([...a, ...b])];

const unirEspecialidades = (a = [], b = []) => {
  const porChave = new Map();

  [...a, ...b].forEach((especialidade) => {
    porChave.set(JSON.stringify(especialidade), especialidade);
  });

  return [...porChave.values()];
};

// Um mesmo hospital pode estar habilitado em mais de uma vertical, e aparece
// então na coleta de cada uma. Os campos de lista precisam ser unidos, não
// sobrescritos: um espalhamento simples faria a última coleta apagar as
// verticais e os soros trazidos pelas anteriores.
const mergeHospitals = (pages) => {
  const byId = new Map();

  pages.forEach((hospitals) => {
    hospitals.forEach((hospital) => {
      const existing = byId.get(hospital.id);

      if (!existing) {
        byId.set(hospital.id, hospital);
        return;
      }

      byId.set(hospital.id, {
        ...existing,
        ...hospital,
        verticals: unir(existing.verticals, hospital.verticals),
        treatments: unir(existing.treatments, hospital.treatments),
        specialties: unirEspecialidades(
          existing.specialties,
          hospital.specialties
        ),
      });
    });
  });

  return [...byId.values()].sort((a, b) => a.id - b.id);
};

// Em hospital.verticals o MapaSUS usa as chaves de banco (venomous_animals,
// oncology, rare_diseases) — o slug da API com hífen trocado por underscore.
const KNOWN_VERTICAL_KEYS = new Set(
  VERTICALS.map(({ mapasus }) => mapasus.replaceAll('-', '_'))
);

// As chaves vêm da resposta do MapaSUS; só as verticais conhecidas entram no
// objeto de métricas (que é logado e gravado em arquivo).
const countByVertical = (hospitals) =>
  hospitals.reduce((acc, hospital) => {
    (hospital.verticals || [])
      .filter((vertical) => KNOWN_VERTICAL_KEYS.has(vertical))
      .forEach((vertical) => {
        acc[vertical] = (acc[vertical] || 0) + 1;
      });

    return acc;
  }, {});

const countGeocoded = (hospitals) =>
  hospitals.filter(
    (hospital) =>
      typeof hospital.lat === 'number' && typeof hospital.lng === 'number'
  ).length;

// Além das siglas, guarda o frescor por UF que o MapaSUS reporta: synced_at é
// a última checagem da fonte, updated_at é a data publicada pelo próprio
// gov.br (null enquanto a fonte estiver despublicada). Vai para o
// metrics-latest.json — permite auditar de quando são os dados de cada UF sem
// tocar o contrato da API.
const fetchStates = async () => {
  try {
    const data = await get('/v1/states');
    const states = (data.states || []).filter((state) => state.state_code);

    if (!states.length) {
      return { ufs: UF_FALLBACK, estados: null };
    }

    return {
      ufs: states.map((state) => state.state_code),
      estados: states.map((state) => ({
        state_code: state.state_code,
        status: state.status,
        synced_at: state.synced_at,
        updated_at: state.updated_at,
      })),
    };
  } catch (error) {
    console.log(
      `  /v1/states indisponível (${error.message}), usando a lista fixa de UFs`
    );
    return { ufs: UF_FALLBACK, estados: null };
  }
};

const collect = async () => {
  const { ufs, estados } = await fetchStates();
  console.log(`Coletando ${ufs.length} UFs por vertical...`);
  await sleep(DELAY_BETWEEN_REQUESTS_IN_MS);

  const pages = [];

  // Sequencial de propósito (rate limit do MapaSUS) — por isso o await no loop.
  // eslint-disable-next-line no-restricted-syntax
  for (const vertical of VERTICALS) {
    console.log(`Coletando ${vertical.slug}...`);
    // eslint-disable-next-line no-await-in-loop
    pages.push(await fetchVertical(vertical, ufs));
  }

  console.log('Coletando ciatox...');
  const ciatoxResponse = await get('/v1/ciatox');
  const ciatox = Array.isArray(ciatoxResponse.centers)
    ? ciatoxResponse.centers
    : [];
  console.log(`  ciatox: ${contagemSegura(ciatox.length)} registros`);

  return { hospitais: mergeHospitals(pages), ciatox, estados };
};

const buildMetrics = ({ current, previous, runId }) => ({
  generated_at: new Date().toISOString(),
  run_id: runId,
  totals: {
    hospitais: contagemSegura(current.hospitais.length),
    ciatox: contagemSegura(current.ciatox.length),
    geocoded: contagemSegura(countGeocoded(current.hospitais)),
    by_vertical: countByVertical(current.hospitais),
  },
  deltas: {
    previous_hospitais: contagemSegura(previous.hospitais.length),
    previous_ciatox: contagemSegura(previous.ciatox.length),
    hospitais_delta:
      contagemSegura(current.hospitais.length) -
      contagemSegura(previous.hospitais.length),
    ciatox_delta:
      contagemSegura(current.ciatox.length) -
      contagemSegura(previous.ciatox.length),
  },
  // Só a proveniência técnica da coleta. O texto de procedência e o aviso de
  // emergência que a API devolve vivem em services/hospitais/index.js — é
  // conteúdo editorial, não dado gerado.
  coletado_de: MAPASUS_BASE_URL,
  // Frescor por UF reportado pelo MapaSUS no momento da coleta (null quando
  // /v1/states não respondeu e a lista fixa de UFs foi usada).
  sincronia_da_fonte: current.estados || null,
});

// Um sync quebrado no MapaSUS não pode zerar o dataset que o BrasilAPI serve.
const shouldPromoteSnapshot = (current, previous) => {
  if (current.hospitais.length === 0) {
    return false;
  }

  if (previous.hospitais.length === 0) {
    return true;
  }

  return (
    current.hospitais.length >=
    previous.hospitais.length * MINIMUM_ACCEPTABLE_RATIO
  );
};

const main = async () => {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const runId = new Date().toISOString().replace(/[:.]/g, '-');
  const previous = readJsonFile(LATEST_PATH, { hospitais: [], ciatox: [] });

  let collected;
  try {
    collected = await collect();
  } catch (error) {
    console.error('Falha ao coletar do MapaSUS:', error.message);

    writeJsonFile(METRICS_PATH, {
      ...buildMetrics({ current: previous, previous, runId }),
      fallback: {
        used_previous_snapshot: true,
        reason: 'source_collection_failure',
      },
    });

    console.log(
      JSON.stringify(
        {
          status: 'fallback',
          reason: 'source_collection_failure',
          latest_snapshot_preserved: true,
        },
        null,
        2
      )
    );

    process.exitCode = 1;
    return;
  }

  const promote = shouldPromoteSnapshot(collected, previous);
  const metrics = buildMetrics({ current: collected, previous, runId });

  if (promote) {
    writeJsonFile(LATEST_PATH, {
      generated_at: metrics.generated_at,
      coletado_de: metrics.coletado_de,
      hospitais: collected.hospitais,
      ciatox: collected.ciatox,
    });
  }

  writeJsonFile(METRICS_PATH, {
    ...metrics,
    fallback: {
      used_previous_snapshot: !promote,
      reason: promote ? null : 'count_guardrail',
    },
  });

  console.log(
    JSON.stringify(
      {
        status: promote ? 'promoted' : 'kept_previous_latest',
        hospitais: metrics.totals.hospitais,
        ciatox: metrics.totals.ciatox,
        geocoded: metrics.totals.geocoded,
        by_vertical: metrics.totals.by_vertical,
      },
      null,
      2
    )
  );
};

main();
