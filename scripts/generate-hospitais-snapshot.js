/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_DIR = path.join(ROOT, 'services', 'hospitais', 'snapshots');
const LATEST_PATH = path.join(SNAPSHOT_DIR, 'latest.json');
const METRICS_PATH = path.join(SNAPSHOT_DIR, 'metrics-latest.json');

const MAPASUS_BASE_URL =
  process.env.MAPASUS_BASE_URL || 'https://api.mapasus.com.br';

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

const readJsonFile = (filePath, fallbackValue) => {
  try {
    if (!fs.existsSync(filePath)) {
      return fallbackValue;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return fallbackValue;
  }
};

const writeJsonFile = (filePath, value) => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const get = async (endpoint) => {
  const request = () =>
    axios.get(`${MAPASUS_BASE_URL}${endpoint}`, {
      timeout: REQUEST_TIMEOUT_IN_MS,
      headers: { 'User-Agent': USER_AGENT },
    });

  try {
    return (await request()).data;
  } catch (error) {
    if (error.response && error.response.status === 429) {
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

  for (let index = 0; index < ufs.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    hospitals.push(...(await fetchStateHospitals(mapasus, ufs[index])));
    // eslint-disable-next-line no-await-in-loop
    await sleep(DELAY_BETWEEN_REQUESTS_IN_MS);
  }

  console.log(`  ${slug}: ${hospitals.length} registros`);
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

const countByVertical = (hospitals) =>
  hospitals.reduce((acc, hospital) => {
    (hospital.verticals || []).forEach((vertical) => {
      acc[vertical] = (acc[vertical] || 0) + 1;
    });

    return acc;
  }, {});

const countGeocoded = (hospitals) =>
  hospitals.filter(
    (hospital) =>
      typeof hospital.lat === 'number' && typeof hospital.lng === 'number'
  ).length;

const fetchUfs = async () => {
  try {
    const data = await get('/v1/states');
    const ufs = (data.states || []).map((state) => state.state_code);

    return ufs.length ? ufs : UF_FALLBACK;
  } catch (error) {
    console.log('  /v1/states indisponível, usando a lista fixa de UFs');
    return UF_FALLBACK;
  }
};

const collect = async () => {
  const ufs = await fetchUfs();
  console.log(`Coletando ${ufs.length} UFs por vertical...`);
  await sleep(DELAY_BETWEEN_REQUESTS_IN_MS);

  const pages = [];

  for (let index = 0; index < VERTICALS.length; index += 1) {
    console.log(`Coletando ${VERTICALS[index].slug}...`);
    // eslint-disable-next-line no-await-in-loop
    pages.push(await fetchVertical(VERTICALS[index], ufs));
  }

  console.log('Coletando ciatox...');
  const ciatoxResponse = await get('/v1/ciatox');
  const ciatox = Array.isArray(ciatoxResponse.centers)
    ? ciatoxResponse.centers
    : [];
  console.log(`  ciatox: ${ciatox.length} registros`);

  return { hospitais: mergeHospitals(pages), ciatox };
};

const buildMetrics = ({ current, previous, runId }) => ({
  generated_at: new Date().toISOString(),
  run_id: runId,
  totals: {
    hospitais: current.hospitais.length,
    ciatox: current.ciatox.length,
    geocoded: countGeocoded(current.hospitais),
    by_vertical: countByVertical(current.hospitais),
  },
  deltas: {
    previous_hospitais: previous.hospitais.length,
    previous_ciatox: previous.ciatox.length,
    hospitais_delta: current.hospitais.length - previous.hospitais.length,
    ciatox_delta: current.ciatox.length - previous.ciatox.length,
  },
  // Só a proveniência técnica da coleta. O texto de procedência e o aviso de
  // emergência que a API devolve vivem em services/hospitais/index.js — é
  // conteúdo editorial, não dado gerado.
  coletado_de: MAPASUS_BASE_URL,
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
