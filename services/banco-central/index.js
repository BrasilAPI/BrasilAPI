import getCsvAsJson from '@/util/getCsvAsJson';
import axios from 'axios';
import { getCnpjData } from '@/services/cnpj';
import fs from 'fs';
import path from 'path';

import banksList from './banksList.json';
import logoUrls from './logo-urls.json';

const BCB_SEDES_URLS = [
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesBancoComMultCE?$format=json',
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesCooperativas?$format=json',
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesSociedades?$format=json',
  'https://olinda.bcb.gov.br/olinda/servico/Instituicoes_em_funcionamento/versao/v1/odata/SedesConsorcios?$format=json',
];

const BANKS_DATA_CACHE_TTL_IN_MS = 6 * 60 * 60 * 1000;
const LATEST_SNAPSHOT_PATH = path.join(
  process.cwd(),
  'services',
  'banco-central',
  'snapshots',
  'latest.json'
);

let banksDataCache = {
  data: null,
  expiresAt: 0,
};

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

const parseAddress = ({
  ENDERECO,
  logradouro,
  COMPLEMENTO,
  complemento,
  BAIRRO,
  bairro,
  MUNICIPIO,
  municipio,
  UF,
  uf,
  CEP,
  cep,
  numero,
}) => {
  const street = ENDERECO || logradouro || null;
  const number = numero || null;
  const complement = COMPLEMENTO || complemento || null;
  const district = BAIRRO || bairro || null;
  const city = MUNICIPIO || municipio || null;
  const state = UF || uf || null;
  const zipCode = formatZipCode(CEP || cep);

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

const fetchSedesData = async () => {
  const requests = BCB_SEDES_URLS.map((url) =>
    axios.get(url, {
      timeout: 15000,
    })
  );

  const responses = await Promise.allSettled(requests);

  return responses.reduce((allRecords, response) => {
    if (response.status !== 'fulfilled') {
      return allRecords;
    }

    const values = response.value?.data?.value;

    if (!Array.isArray(values)) {
      return allRecords;
    }

    return allRecords.concat(values);
  }, []);
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

const getCnpjAddress = async (cnpj) => {
  const response = await getCnpjData(cnpj);
  return parseAddress(response?.data || {});
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

const enrichBanksWithHeadquartersAddress = async (banksData) => {
  const syncDate = new Date().toISOString();

  try {
    const sedesRecords = await fetchSedesData();
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

    const cnpjLookups = cnpjCandidates.map(async (cnpj) => {
      try {
        const cnpjAddress = await getCnpjAddress(cnpj);
        cnpjToAddress.set(cnpj, cnpjAddress);
      } catch (error) {
        cnpjToAddress.set(cnpj, null);
      }
    });

    await Promise.all(cnpjLookups);

    return preEnrichedBanks.map((bank) => {
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
  } catch (error) {
    return banksData.map((bank) => buildNoAddressMetadata(bank, syncDate));
  }
};

const formatCsvFile = (file) => {
  // Remove o cabeçalho
  file.shift();

  return file
    .filter(([ispb, , code]) => ispb && code)
    .map(
      ([
        ispb, // ISPB
        name, // Nome_Reduzido
        code, // Número_Código // Participa_da_Compe // Acesso_Principal
        ,
        ,
        fullName, // Nome_Extenso // Início_da_Operação
        ,
      ]) => {
        // Busca o banco no banksList para obter a localização da sede
        const bankData = banksList.find((bank) => bank.ispb === ispb);

        return {
          ispb,
          name: name && name.trim(),
          code: Number(code),
          fullName: fullName && fullName.trim().replace(/\\"|"/g, ''), // Remove aspas
          localizacao_sede: bankData?.localizacao_sede || '', // Endereço da sede do banco
        };
      }
    );
};

const readLatestSnapshotFromDisk = () => {
  try {
    if (!fs.existsSync(LATEST_SNAPSHOT_PATH)) {
      return null;
    }

    const snapshotRaw = fs.readFileSync(LATEST_SNAPSHOT_PATH, 'utf8');
    const snapshotData = JSON.parse(snapshotRaw);

    if (!Array.isArray(snapshotData) || snapshotData.length === 0) {
      return null;
    }

    return snapshotData;
  } catch (error) {
    return null;
  }
};

const getAddressCoverage = (banksData = []) => {
  if (!Array.isArray(banksData) || banksData.length === 0) {
    return 0;
  }

  const withAddressCount = banksData.filter(
    (bank) => bank.headquarters_address !== null
  ).length;

  return withAddressCount / banksData.length;
};

// Adiciona logo_url (CDN logos-bancos-br) quando o ISPB tem logo mapeado;
// caso contrário, o campo fica null (campo novo, compatível retroativo)
const enrichBanksWithLogoUrl = (banksData) =>
  banksData.map((bank) => ({
    ...bank,
    logo_url: logoUrls[bank.ispb] || null,
  }));

export const getBanksData = async () => {
  if (banksDataCache.data && banksDataCache.expiresAt > Date.now()) {
    return banksDataCache.data;
  }

  const latestSnapshot = readLatestSnapshotFromDisk();
  let banksData = [];

  try {
    const response = await getCsvAsJson(
      'https://www.bcb.gov.br/content/estabilidadefinanceira/str1/ParticipantesSTR.csv'
    );
    banksData = formatCsvFile(response);
  } catch (err) {
    banksData = latestSnapshot || banksList;
  }

  if (banksData === latestSnapshot) {
    const enrichedSnapshot = enrichBanksWithLogoUrl(latestSnapshot);
    banksDataCache = {
      data: enrichedSnapshot,
      expiresAt: Date.now() + BANKS_DATA_CACHE_TTL_IN_MS,
    };

    return enrichedSnapshot;
  }

  const enrichedBanksData = await enrichBanksWithHeadquartersAddress(banksData);
  const shouldUseSnapshotFallback =
    Array.isArray(latestSnapshot) &&
    latestSnapshot.length > 0 &&
    getAddressCoverage(enrichedBanksData) === 0 &&
    getAddressCoverage(latestSnapshot) > 0;

  const stableBanksData = shouldUseSnapshotFallback
    ? latestSnapshot
    : enrichedBanksData;

  const finalBanksData = enrichBanksWithLogoUrl(stableBanksData);

  banksDataCache = {
    data: finalBanksData,
    expiresAt: Date.now() + BANKS_DATA_CACHE_TTL_IN_MS,
  };

  return finalBanksData;
};
