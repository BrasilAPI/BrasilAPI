/* eslint-disable no-console */
const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');

const ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_DIR = path.join(ROOT, 'services', 'universities', 'snapshots');
const LATEST_PATH = path.join(SNAPSHOT_DIR, 'latest.json');
const METADATA_PATH = path.join(SNAPSHOT_DIR, 'metadata-latest.json');

/**
 * O provider original (api.universities.com.br) que servia o shape com
 * endereço, IBGE e telefone saiu do ar de forma permanente (NXDOMAIN).
 *
 * A fonte passou a ser o **Censo da Educação Superior (INEP/MEC)** —
 * cadastro público de Instituições de Ensino Superior, gratuito, com
 * endereço completo e código IBGE do município. O telefone não consta
 * no cadastro → `phone: null` no snapshot.
 *
 * O CSV de referência (danielshz/ies-etl, espelho dos MICRODADOS do INEP):
 *   https://raw.githubusercontent.com/danielshz/ies-etl/main/dados/IES/MICRODADOS_CADASTRO_IES_<ANO>.CSV
 *
 * Alternativa oficial quando disponível:
 *   https://www.gov.br/inep/pt-br/acesso-a-informacao/dados-abertos/microdados/censo-da-educacao-superior
 */
const CSV_URL =
  'https://raw.githubusercontent.com/danielshz/ies-etl/main/dados/IES/MICRODADOS_CADASTRO_IES_2021.CSV';

const MINIMUM_EXPECTED_UNIVERSITIES = 2400;

const normalize = (value) => (value || '').trim().toUpperCase();

const mapRow = (row) => ({
  id: Number(row.CO_IES),
  full_name: normalize(row.NO_IES),
  name: normalize(row.SG_IES),
  ibge: normalize(row.CO_MUNICIPIO_IES),
  city: normalize(row.NO_MUNICIPIO_IES),
  uf: normalize(row.SG_UF_IES),
  zipcode: normalize(row.NU_CEP_IES),
  street: normalize(row.DS_ENDERECO_IES),
  number: normalize(row.DS_NUMERO_ENDERECO_IES),
  neighborhood: normalize(row.NO_BAIRRO_IES),
  phone: null,
});

const parseCsv = (content) => {
  const lines = content
    .replace(/\r\n/g, '\n')
    .split('\n')
    .filter((line) => line.trim() !== '');

  const header = lines[0].split(';');
  const rows = lines.slice(1).map((line) => {
    const cells = line.split(';');
    return Object.fromEntries(header.map((key, index) => [key, cells[index]]));
  });

  return rows;
};

async function main() {
  console.log(`Baixando cadastro INEP: ${CSV_URL}`);

  const { data } = await axios.get(CSV_URL, {
    timeout: 120_000,
    responseType: 'text',
    transformResponse: (body) =>
      Buffer.isBuffer(body) ? body : Buffer.from(body, 'binary'),
  });

  const content = data.toString('latin1');
  const rawRows = parseCsv(content);

  const universities = rawRows
    .filter((row) => /^\d+$/.test((row.CO_IES || '').trim()))
    .map(mapRow)
    .filter((university) => Number.isInteger(university.id))
    .sort((a, b) => a.id - b.id);

  console.log(`Registros lidos: ${rawRows.length} → ${universities.length}`);

  if (universities.length < MINIMUM_EXPECTED_UNIVERSITIES) {
    console.error(
      `Falha: esperava ao menos ${MINIMUM_EXPECTED_UNIVERSITIES}, obteve ${universities.length}. Abortando.`
    );
    process.exit(1);
  }

  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  fs.writeFileSync(LATEST_PATH, JSON.stringify(universities, null, 2), 'utf-8');

  const metadata = {
    source: 'Censo da Educação Superior (INEP/MEC)',
    year: '2021',
    generatedAt: new Date().toISOString(),
    count: universities.length,
    url: CSV_URL,
  };

  fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2), 'utf-8');

  console.log(
    `Snapshot gravado em ${LATEST_PATH} (${universities.length} universidades)`
  );
  console.log(`Metadata em ${METADATA_PATH}`);

  const ufmt = universities.find((u) => u.id === 1);
  console.log(
    'Check UFMT:',
    ufmt ? `${ufmt.full_name} · ${ufmt.city}/${ufmt.uf}` : 'não encontrada'
  );
}

main().catch((error) => {
  console.error('Erro ao gerar snapshot de universidades:', error.message);
  process.exit(1);
});
