/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Papa = require('papaparse');

const ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_DIR = path.join(ROOT, 'services', 'banco-central', 'snapshots');
const LATEST_PATH = path.join(SNAPSHOT_DIR, 'latest.json');
const METRICS_PATH = path.join(SNAPSHOT_DIR, 'metrics-latest.json');

const BCB_PARTICIPANTES_STR_URL =
  'https://www.bcb.gov.br/content/estabilidadefinanceira/str1/ParticipantesSTR.csv';

const BCB_SEDES_URLS = [
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesBancoComMultCE?$format=json',
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesCooperativas?$format=json',
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesSociedades?$format=json',
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesConsorcios?$format=json',
];

const ADDRESS_CONFIDENCE = {
  BCB_EXACT: 'high',
  CNPJ_EXACT: 'medium',
  NAME_BASED: 'low',
  NO_MATCH: 'none',
};

const normalizeText = (text = '') =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatZipCode = (zipCode) => {
  if (!zipCode) {
    return null;
  }

  const onlyNumbers = String(zipCode).replace(/\D/g, '');

  if (!onlyNumbers) {
    return null;
  }

  if (onlyNumbers.length === 8) {
    return `${onlyNumbers.slice(0, 5)}-${onlyNumbers.slice(5)}`;
  }

  return onlyNumbers;
};

const parseAddress = (record = {}) => {
  const street = record.ENDERECO || record.logradouro || null;
  const number = record.numero || null;
  const complement = record.COMPLEMENTO || record.complemento || null;
  const district = record.BAIRRO || record.bairro || null;
  const city = record.MUNICIPIO || record.municipio || null;
  const state = record.UF || record.uf || null;
  const zipCode = formatZipCode(record.CEP || record.cep);

  const hasAddressData = [
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  ].some(Boolean);

  if (!hasAddressData) {
    return null;
  }

  return {
    street,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
  };
};

const formatCsvFile = (rows) => {
  rows.shift();

  return rows
    .filter(([ispb, , code]) => ispb && code)
    .map(([ispb, name, code, , , fullName]) => ({
      ispb,
      name: name && name.trim(),
      code: Number(code),
      fullName: fullName && fullName.trim().replace(/\\"|"/g, ''),
    }));
};

const buildNoAddressMetadata = (bank, syncDate) => ({
  ...bank,
  cnpj: null,
  headquarters_address: null,
  address_source: null,
  address_last_sync: syncDate,
  address_confidence: ADDRESS_CONFIDENCE.NO_MATCH,
});

const normalizeCnpj = (rawCnpj) => {
  const cnpj = String(rawCnpj || '').replace(/\D/g, '');

  if (cnpj.length !== 14) {
    return null;
  }

  return cnpj;
};

const buildSedesIndexes = (sedesRecords) => {
  const byNormalizedName = new Map();
  const normalizedRecords = sedesRecords
    .map((record) => {
      const normalizedName = normalizeText(record.NOME_INSTITUICAO);

      if (!normalizedName) {
        return null;
      }

      return {
        ...record,
        normalizedName,
      };
    })
    .filter(Boolean);

  normalizedRecords.forEach((record) => {
    const existing = byNormalizedName.get(record.normalizedName) || [];
    existing.push(record);
    byNormalizedName.set(record.normalizedName, existing);
  });

  return {
    byNormalizedName,
    normalizedRecords,
  };
};

const findUniqueFuzzyMatch = (normalizedTarget, normalizedRecords) => {
  if (!normalizedTarget || normalizedTarget.length < 12) {
    return null;
  }

  const matches = normalizedRecords.filter((record) => {
    return (
      record.normalizedName.includes(normalizedTarget) ||
      normalizedTarget.includes(record.normalizedName)
    );
  });

  if (matches.length !== 1) {
    return null;
  }

  return matches[0];
};

const findSedesMatch = (bank, sedesIndexes) => {
  const normalizedFullName = normalizeText(bank.fullName);
  const normalizedName = normalizeText(bank.name);
  const fullNameMatches =
    sedesIndexes.byNormalizedName.get(normalizedFullName) || [];
  const nameMatches = sedesIndexes.byNormalizedName.get(normalizedName) || [];

  if (fullNameMatches.length === 1) {
    return {
      record: fullNameMatches[0],
      source: 'bcb_sedes_exact_match',
      confidence: ADDRESS_CONFIDENCE.BCB_EXACT,
    };
  }

  if (nameMatches.length === 1) {
    return {
      record: nameMatches[0],
      source: 'bcb_sedes_exact_match',
      confidence: ADDRESS_CONFIDENCE.BCB_EXACT,
    };
  }

  const fuzzyByFullName = findUniqueFuzzyMatch(
    normalizedFullName,
    sedesIndexes.normalizedRecords
  );

  if (fuzzyByFullName) {
    return {
      record: fuzzyByFullName,
      source: 'name_based_match',
      confidence: ADDRESS_CONFIDENCE.NAME_BASED,
    };
  }

  const fuzzyByName = findUniqueFuzzyMatch(
    normalizedName,
    sedesIndexes.normalizedRecords
  );

  if (fuzzyByName) {
    return {
      record: fuzzyByName,
      source: 'name_based_match',
      confidence: ADDRESS_CONFIDENCE.NAME_BASED,
    };
  }

  return null;
};

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

const getCsvAsJson = async (url) => {
  const body = await axios.get(url, {
    timeout: 30000,
    responseType: 'text',
  });

  return Papa.parse(body.data).data;
};

const fetchSedesData = async () => {
  const requests = BCB_SEDES_URLS.map((url) =>
    axios.get(url, {
      timeout: 20000,
    })
  );

  const responses = await Promise.allSettled(requests);
  const failedSources = responses
    .map((response, index) => ({
      response,
      url: BCB_SEDES_URLS[index],
    }))
    .filter(({ response }) => response.status === 'rejected')
    .map(({ url }) => url);

  const records = responses.reduce((allRecords, response) => {
    if (response.status !== 'fulfilled') {
      return allRecords;
    }

    const values = response.value?.data?.value;

    if (!Array.isArray(values)) {
      return allRecords;
    }

    return allRecords.concat(values);
  }, []);

  return {
    records,
    failedSources,
  };
};

const getCnpjAddress = async (cnpj) => {
  const response = await axios.get(`https://minhareceita.org/${cnpj}`, {
    timeout: 15000,
  });

  return parseAddress(response?.data || {});
};

const enrichBanksWithHeadquartersAddress = async (banksData) => {
  const syncDate = new Date().toISOString();
  const { records: sedesRecords, failedSources: failedBcbSources } =
    await fetchSedesData();
  const sedesIndexes = buildSedesIndexes(sedesRecords);

  const preEnrichedBanks = banksData.map((bank) => {
    const match = findSedesMatch(bank, sedesIndexes);

    if (!match) {
      return buildNoAddressMetadata(bank, syncDate);
    }

    const cnpj = normalizeCnpj(match.record.CNPJ);
    const headquartersAddress = parseAddress(match.record);

    if (!headquartersAddress) {
      return {
        ...bank,
        cnpj,
        headquarters_address: null,
        address_source: null,
        address_last_sync: syncDate,
        address_confidence: ADDRESS_CONFIDENCE.NO_MATCH,
      };
    }

    return {
      ...bank,
      cnpj,
      headquarters_address: headquartersAddress,
      address_source: match.source,
      address_last_sync: syncDate,
      address_confidence: match.confidence,
    };
  });

  const cnpjToAddress = new Map();
  const cnpjCandidates = [
    ...new Set(
      preEnrichedBanks
        .filter(
          (bank) =>
            !bank.headquarters_address && bank.cnpj && bank.cnpj.length === 14
        )
        .map((bank) => bank.cnpj)
    ),
  ];

  const cnpjResults = await Promise.allSettled(
    cnpjCandidates.map(async (cnpj) => {
      const cnpjAddress = await getCnpjAddress(cnpj);
      cnpjToAddress.set(cnpj, cnpjAddress);
    })
  );

  const failedCnpjLookups = cnpjResults
    .map((result, index) => ({
      cnpj: cnpjCandidates[index],
      result,
    }))
    .filter(({ result }) => result.status === 'rejected')
    .map(({ cnpj }) => cnpj);

  const enriched = preEnrichedBanks.map((bank) => {
    if (bank.headquarters_address) {
      return bank;
    }

    if (!bank.cnpj || !cnpjToAddress.has(bank.cnpj)) {
      return bank;
    }

    const cnpjAddress = cnpjToAddress.get(bank.cnpj);

    if (!cnpjAddress) {
      return bank;
    }

    return {
      ...bank,
      headquarters_address: cnpjAddress,
      address_source: 'cnpj_exact_match',
      address_last_sync: syncDate,
      address_confidence: ADDRESS_CONFIDENCE.CNPJ_EXACT,
    };
  });

  return {
    data: enriched,
    diagnostics: {
      failedBcbSources,
      failedCnpjLookups,
      cnpjLookupCandidates: cnpjCandidates.length,
      usedSources: {
        bcb: BCB_SEDES_URLS,
        cnpj: 'https://minhareceita.org/{cnpj}',
      },
    },
  };
};

const countConflicts = (banksData) => {
  const byNormalizedName = new Map();

  banksData.forEach((bank) => {
    const key = normalizeText(bank.fullName || bank.name || '');

    if (!key) {
      return;
    }

    const existing = byNormalizedName.get(key) || [];
    existing.push(bank);
    byNormalizedName.set(key, existing);
  });

  return [...byNormalizedName.values()].filter((banksGroup) => {
    const distinctSources = new Set(
      banksGroup.map((bank) => bank.address_source || 'no_source')
    );

    return distinctSources.size > 1;
  }).length;
};

const computeMetrics = ({
  current,
  previous,
  diagnostics,
  runId,
  snapshotFile,
}) => {
  const currentWithAddress = current.filter(
    (bank) => bank.headquarters_address !== null
  ).length;
  const previousWithAddress = previous.filter(
    (bank) => bank.headquarters_address !== null
  ).length;
  const currentNulls = current.length - currentWithAddress;
  const previousNulls = previous.length - previousWithAddress;

  return {
    generated_at: new Date().toISOString(),
    run_id: runId,
    snapshot_file: snapshotFile,
    totals: {
      banks: current.length,
      with_address: currentWithAddress,
      without_address: currentNulls,
      coverage_total: current.length ? currentWithAddress / current.length : 0,
    },
    deltas: {
      previous_with_address: previousWithAddress,
      previous_without_address: previousNulls,
      new_nulls: Math.max(0, currentNulls - previousNulls),
      recovered_addresses: Math.max(0, previousNulls - currentNulls),
    },
    conflicts: {
      count: countConflicts(current),
      method: 'same_normalized_name_with_different_address_source',
    },
    sources: {
      bcb_failed_sources: diagnostics.failedBcbSources,
      cnpj_lookup_candidates: diagnostics.cnpjLookupCandidates,
      cnpj_failed_lookups: diagnostics.failedCnpjLookups.length,
      cnpj_failed_samples: diagnostics.failedCnpjLookups.slice(0, 20),
      used: diagnostics.usedSources,
    },
  };
};

const shouldPromoteSnapshot = (metrics, previous) => {
  const hasCoverage = metrics.totals.with_address > 0;
  const previousCoverage = previous.length
    ? previous.filter((bank) => bank.headquarters_address !== null).length /
      previous.length
    : 0;

  const minimumAcceptableCoverage =
    previousCoverage > 0 ? previousCoverage * 0.8 : 0.2;

  return (
    hasCoverage && metrics.totals.coverage_total >= minimumAcceptableCoverage
  );
};

const main = async () => {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const runDate = new Date();
  const runId = runDate.toISOString().replace(/[:.]/g, '-');
  const snapshotFileName = `banks-headquarters-${runId}.json`;
  const snapshotFilePath = path.join(SNAPSHOT_DIR, snapshotFileName);

  const previousSnapshot = readJsonFile(LATEST_PATH, []);

  let enrichedResult;
  try {
    const csvRows = await getCsvAsJson(BCB_PARTICIPANTES_STR_URL);
    const banksData = formatCsvFile(csvRows);
    enrichedResult = await enrichBanksWithHeadquartersAddress(banksData);
  } catch (error) {
    console.error(
      'Snapshot generation failed while collecting sources:',
      error
    );

    const fallbackMetrics = {
      generated_at: new Date().toISOString(),
      run_id: runId,
      snapshot_file: null,
      totals: {
        banks: previousSnapshot.length,
        with_address: previousSnapshot.filter(
          (bank) => bank.headquarters_address !== null
        ).length,
        without_address: previousSnapshot.filter(
          (bank) => bank.headquarters_address === null
        ).length,
        coverage_total: previousSnapshot.length
          ? previousSnapshot.filter(
              (bank) => bank.headquarters_address !== null
            ).length / previousSnapshot.length
          : 0,
      },
      deltas: {
        previous_with_address: previousSnapshot.filter(
          (bank) => bank.headquarters_address !== null
        ).length,
        previous_without_address: previousSnapshot.filter(
          (bank) => bank.headquarters_address === null
        ).length,
        new_nulls: 0,
        recovered_addresses: 0,
      },
      conflicts: {
        count: countConflicts(previousSnapshot),
        method: 'same_normalized_name_with_different_address_source',
      },
      sources: {
        bcb_failed_sources: ['all'],
        cnpj_lookup_candidates: 0,
        cnpj_failed_lookups: 0,
        cnpj_failed_samples: [],
        used: {
          bcb: BCB_SEDES_URLS,
          cnpj: 'https://minhareceita.org/{cnpj}',
        },
      },
      fallback: {
        used_previous_snapshot: true,
        reason: 'source_collection_failure',
      },
    };

    writeJsonFile(METRICS_PATH, fallbackMetrics);

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

    return;
  }

  writeJsonFile(snapshotFilePath, enrichedResult.data);

  const metrics = computeMetrics({
    current: enrichedResult.data,
    previous: previousSnapshot,
    diagnostics: enrichedResult.diagnostics,
    runId,
    snapshotFile: path.basename(snapshotFilePath),
  });

  const promoteSnapshot = shouldPromoteSnapshot(metrics, previousSnapshot);

  if (promoteSnapshot) {
    writeJsonFile(LATEST_PATH, enrichedResult.data);
  }

  writeJsonFile(METRICS_PATH, {
    ...metrics,
    fallback: {
      used_previous_snapshot: !promoteSnapshot,
      reason: promoteSnapshot ? null : 'coverage_guardrail',
    },
  });

  console.log(
    JSON.stringify(
      {
        status: promoteSnapshot ? 'promoted' : 'kept_previous_latest',
        snapshot_file: path.basename(snapshotFilePath),
        coverage_total: metrics.totals.coverage_total,
        new_nulls: metrics.deltas.new_nulls,
        conflicts: metrics.conflicts.count,
      },
      null,
      2
    )
  );
};

main();
