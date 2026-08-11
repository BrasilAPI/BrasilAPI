/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const ROOT = path.resolve(__dirname, '..');
const SNAPSHOT_DIR = path.join(ROOT, 'services', 'pix', 'snapshots');
const LATEST_PATH = path.join(SNAPSHOT_DIR, 'latest.json');
const METADATA_PATH = path.join(SNAPSHOT_DIR, 'metadata-latest.json');

/**
 * O BCB descontinuou o CSV público de participantes do Pix (retorna 401) e a
 * lista oficial passou a ser publicada apenas em PDF, disponível somente para
 * os ~2 dias mais recentes. Este script baixa o PDF, extrai a tabela e grava
 * um snapshot JSON já no formato de resposta da rota /api/pix/v1/participants.
 */
const PDF_URL_PREFIX =
  'https://www.bcb.gov.br/content/estabilidadefinanceira/participantes_pix_pdf/lista-participantes-instituicoes-em-adesao-pix-';

const MAX_DAYS_BACK = 7;
const MINIMUM_EXPECTED_PARTICIPANTS = 700;
const MAXIMUM_UNKNOWN_MODALIDADE_RATIO = 0.05;

const KNOWN_MODALIDADES = [
  'Provedor de Conta Transacional',
  'Iniciador',
  'Liquidante Especial',
  'Ente Governamental',
];

const KNOWN_TIPOS = ['Direta', 'Indireta'];

const formatDateForUrl = (daysBack) => {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() - daysBack);

  // O BCB publica o arquivo com a data de Brasília
  const brasiliaDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  return brasiliaDate.replace(/-/g, '');
};

const downloadPdf = async () => {
  const attempts = [];

  for (let daysBack = 0; daysBack <= MAX_DAYS_BACK; daysBack += 1) {
    const date = formatDateForUrl(daysBack);
    const url = `${PDF_URL_PREFIX}${date}.pdf`;

    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await axios.get(url, {
        timeout: 30000,
        responseType: 'arraybuffer',
        headers: { Accept: 'application/pdf' },
      });

      return { buffer: response.data, url, date };
    } catch (error) {
      attempts.push(`${date}: ${error.response?.status || error.message}`);
    }
  }

  throw new Error(`Nenhum PDF disponível. Tentativas: ${attempts.join(', ')}`);
};

const extractTextItems = async (buffer) => {
  // devDependency de propósito: só é usada por este script (local e CI),
  // nunca em request-time nas rotas da API.
  // eslint-disable-next-line import/no-extraneous-dependencies
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const document = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useSystemFonts: true,
  }).promise;

  const pages = [];

  for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
    // eslint-disable-next-line no-await-in-loop
    const page = await document.getPage(pageNumber);
    // eslint-disable-next-line no-await-in-loop
    const content = await page.getTextContent();

    // O BCB publica o PDF em paisagem via rotação de página (rotate: 90):
    // nesse caso transform[4] é o eixo vertical e transform[5] o horizontal.
    const rotated = page.rotate % 180 !== 0;

    const items = content.items
      .map((item) => ({
        text: item.str.trim(),
        x: rotated ? item.transform[5] : item.transform[4],
        y: rotated ? -item.transform[4] : item.transform[5],
        width: item.width,
      }))
      .filter((item) => item.text.length > 0);

    pages.push(items);
  }

  return pages;
};

/**
 * O PDF traz duas tabelas: "participantes ativos" e, ao final, "participantes
 * em processo de adesão" (com outra grade de colunas). O CSV que a rota
 * sempre consumiu continha apenas os ativos, então tudo a partir do início
 * da segunda tabela é descartado.
 */
const isSecondTableMarker = (item) =>
  /processo de adesão/i.test(item.text) || item.text === 'Etapa';

const dropSecondTable = (pages) => {
  let secondTableFound = false;

  return pages.map((pageItems) => {
    if (secondTableFound) {
      return [];
    }

    const markers = pageItems.filter(isSecondTableMarker);

    if (!markers.length) {
      return pageItems;
    }

    secondTableFound = true;
    const cutY = Math.max(...markers.map((item) => item.y));

    return pageItems.filter((item) => item.y > cutY + 2);
  });
};

const groupItemsIntoRows = (items, yTolerance = 2) => {
  const sorted = [...items].sort((a, b) => b.y - a.y || a.x - b.x);
  const rows = [];

  sorted.forEach((item) => {
    const currentRow = rows[rows.length - 1];

    if (currentRow && Math.abs(currentRow.y - item.y) <= yTolerance) {
      currentRow.items.push(item);
      return;
    }

    rows.push({ y: item.y, items: [item] });
  });

  rows.forEach((row) => row.items.sort((a, b) => a.x - b.x));

  return rows;
};

const isRecordIndexToken = (token) => /^\d{1,4}$/.test(token.text);

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

/**
 * Deriva as faixas horizontais (eixo x) das colunas a partir dos próprios
 * dados, em vez de posições fixas, para tolerar pequenas mudanças de layout.
 */
const deriveColumnRanges = (pages) => {
  const allItems = pages.flat();

  const ispbXs = allItems
    .filter((item) => /^\d{8}$/.test(item.text))
    .map((item) => item.x);

  const modalidadeItems = allItems.filter((item) =>
    /^(Provedor de Conta|Transacional|Iniciador|Liquidante Especial|Ente Governamental)$/.test(
      item.text
    )
  );

  const tipoItems = allItems.filter((item) => KNOWN_TIPOS.includes(item.text));

  if (!ispbXs.length || !modalidadeItems.length || !tipoItems.length) {
    throw new Error(
      'Não foi possível identificar as colunas do PDF (layout mudou?)'
    );
  }

  const modalidadeMinX = Math.min(...modalidadeItems.map((item) => item.x));
  const modalidadeMaxX = Math.max(
    ...modalidadeItems.map((item) => item.x + item.width)
  );

  const tipoMinX = Math.min(...tipoItems.map((item) => item.x));
  const tipoMaxX = Math.max(...tipoItems.map((item) => item.x + item.width));

  return {
    ispbColumnX: median(ispbXs),
    modalidade: { min: modalidadeMinX - 5, max: modalidadeMaxX + 5 },
    tipo: { min: tipoMinX - 5, max: tipoMaxX + 5 },
  };
};

/**
 * Distância vertical máxima entre a âncora do primeiro/último registro da
 * página e as linhas de continuação acima/abaixo dela. As linhas de uma
 * célula ficam a 8pt umas das outras (offset de até 12pt em nomes de 5
 * linhas), enquanto o cabeçalho da página 1 fica a 16pt da primeira âncora.
 */
const EDGE_CONTINUATION_DISTANCE = 14;

/**
 * Divide as linhas de uma página em registros. Cada registro é ancorado na
 * linha que contém o número sequencial (primeira coluna). Como as células são
 * centralizadas verticalmente, linhas de continuação podem aparecer acima ou
 * abaixo da linha âncora — inclusive antes da âncora do primeiro registro da
 * página — e cada linha é atribuída ao registro cuja âncora está mais
 * próxima. Nas bordas da página (antes da primeira âncora e depois da
 * última), linhas longe demais de uma âncora são descartadas: é onde ficam
 * título e cabeçalho da tabela.
 */
const groupRowsIntoRecords = (rows) => {
  const anchorRowIndexes = rows
    .map((row, index) => ({ row, index }))
    .filter(({ row }) => isRecordIndexToken(row.items[0]))
    .map(({ index }) => index);

  if (!anchorRowIndexes.length) {
    return [];
  }

  const anchorYs = anchorRowIndexes.map((rowIndex) => rows[rowIndex].y);
  const firstAnchorY = Math.max(...anchorYs);
  const lastAnchorY = Math.min(...anchorYs);

  const records = anchorRowIndexes.map(() => []);

  rows.forEach((row) => {
    let nearestAnchor = 0;
    let nearestDistance = Infinity;

    anchorYs.forEach((anchorY, anchorIndex) => {
      const distance = Math.abs(anchorY - row.y);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestAnchor = anchorIndex;
      }
    });

    const outsideAnchorSpan = row.y > firstAnchorY || row.y < lastAnchorY;

    if (outsideAnchorSpan && nearestDistance > EDGE_CONTINUATION_DISTANCE) {
      return;
    }

    records[nearestAnchor].push(row);
  });

  return records;
};

const joinColumnTokens = (rows, range) =>
  rows
    .flatMap((row) =>
      row.items.filter((item) => item.x >= range.min && item.x <= range.max)
    )
    .map((item) => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

const parseRecord = (recordRows, columnRanges) => {
  const allItems = recordRows.flatMap((row) => row.items);

  const ispbItem = allItems.find(
    (item) =>
      /^\d{8}$/.test(item.text) &&
      Math.abs(item.x - columnRanges.ispbColumnX) <= 10
  );

  if (!ispbItem) {
    // Mesmo comportamento do parser antigo do CSV: participantes sem ISPB
    // (ex.: iniciadores sem acesso ao SPI) ficam fora da lista.
    return null;
  }

  const anchorRow = recordRows.find((row) => isRecordIndexToken(row.items[0]));
  const indexTokenX = anchorRow ? anchorRow.items[0].x : -Infinity;

  const nome = allItems
    .filter(
      (item) =>
        item.x < columnRanges.ispbColumnX - 2 &&
        !(isRecordIndexToken(item) && item.x <= indexTokenX + 2)
    )
    .map((item) => item.text)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  const modalidade = joinColumnTokens(recordRows, columnRanges.modalidade);
  const tipo = joinColumnTokens(recordRows, columnRanges.tipo);

  return {
    ispb: ispbItem.text,
    nome,
    nome_reduzido: nome,
    modalidade_participacao: modalidade || null,
    tipo_participacao: tipo || null,
    inicio_operacao: null,
  };
};

const parsePdf = async (buffer) => {
  const pages = dropSecondTable(await extractTextItems(buffer));
  const columnRanges = deriveColumnRanges(pages);

  const participants = [];

  pages.forEach((pageItems) => {
    const rows = groupItemsIntoRows(pageItems);
    const records = groupRowsIntoRecords(rows);

    records.forEach((recordRows) => {
      const participant = parseRecord(recordRows, columnRanges);

      if (participant) {
        participants.push(participant);
      }
    });
  });

  return participants;
};

const validateParticipants = (participants) => {
  const problems = [];

  if (participants.length < MINIMUM_EXPECTED_PARTICIPANTS) {
    problems.push(
      `apenas ${participants.length} participantes (mínimo esperado: ${MINIMUM_EXPECTED_PARTICIPANTS})`
    );
  }

  const invalidIspb = participants.filter(
    (participant) => !/^\d{8}$/.test(participant.ispb)
  );

  if (invalidIspb.length) {
    problems.push(`${invalidIspb.length} participantes com ISPB inválido`);
  }

  const emptyNames = participants.filter((participant) => !participant.nome);

  if (emptyNames.length) {
    problems.push(`${emptyNames.length} participantes sem nome`);
  }

  const duplicatedIspbCount =
    participants.length - new Set(participants.map((p) => p.ispb)).size;

  if (duplicatedIspbCount > 0) {
    problems.push(`${duplicatedIspbCount} ISPBs duplicados`);
  }

  const unknownModalidades = participants.filter(
    (participant) =>
      participant.modalidade_participacao !== null &&
      !KNOWN_MODALIDADES.includes(participant.modalidade_participacao)
  );

  if (
    unknownModalidades.length >
    participants.length * MAXIMUM_UNKNOWN_MODALIDADE_RATIO
  ) {
    const samples = [
      ...new Set(unknownModalidades.map((p) => p.modalidade_participacao)),
    ].slice(0, 5);
    problems.push(
      `${
        unknownModalidades.length
      } participantes com modalidade desconhecida (ex.: ${samples.join(' | ')})`
    );
  }

  const unknownTipos = participants.filter(
    (participant) =>
      participant.tipo_participacao !== null &&
      !KNOWN_TIPOS.includes(participant.tipo_participacao)
  );

  if (unknownTipos.length) {
    const samples = [
      ...new Set(unknownTipos.map((p) => p.tipo_participacao)),
    ].slice(0, 5);
    problems.push(
      `${
        unknownTipos.length
      } participantes com tipo de participação desconhecido (ex.: ${samples.join(
        ' | '
      )})`
    );
  }

  return problems;
};

const writeJsonFile = (filePath, value) => {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

const countBy = (participants, field) =>
  participants.reduce((counts, participant) => {
    const key = participant[field] === null ? 'null' : participant[field];
    return { ...counts, [key]: (counts[key] || 0) + 1 };
  }, {});

const main = async () => {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const { buffer, url, date } = await downloadPdf();
  console.log(`PDF baixado: ${url} (${buffer.length} bytes)`);

  const participants = await parsePdf(buffer);
  participants.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  const problems = validateParticipants(participants);

  if (problems.length) {
    console.error('Snapshot rejeitado pelas validações:');
    problems.forEach((problem) => console.error(`- ${problem}`));
    process.exitCode = 1;
    return;
  }

  writeJsonFile(LATEST_PATH, participants);
  writeJsonFile(METADATA_PATH, {
    generated_at: new Date().toISOString(),
    source_url: url,
    source_published_date: `${date.slice(0, 4)}-${date.slice(
      4,
      6
    )}-${date.slice(6, 8)}`,
    total_participants: participants.length,
    by_modalidade_participacao: countBy(
      participants,
      'modalidade_participacao'
    ),
    by_tipo_participacao: countBy(participants, 'tipo_participacao'),
  });

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        total_participants: participants.length,
        source_published_date: date,
      },
      null,
      2
    )
  );
};

main().catch((error) => {
  console.error('Falha ao gerar snapshot de participantes do Pix:', error);
  process.exitCode = 1;
});
