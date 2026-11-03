import axios from 'axios';

export const CODIGOS_ESTADOS = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

// A Wikimedia limita (429) clientes sem um User-Agent que os identifique.
// https://meta.wikimedia.org/wiki/User-Agent_policy
export const WIKIPEDIA_USER_AGENT =
  'BrasilAPI/1.0 (https://brasilapi.com.br; https://github.com/BrasilAPI/BrasilAPI)';

export const WIKIPEDIA_API_URL = 'https://pt.wikipedia.org/w/api.php';

export const WIKIPEDIA_TIMEOUT_MS = 4000;

// Títulos exatos das páginas. Buscar o título a cada chamada gastava uma
// requisição a mais e, para MS, devolvia o artigo do estado em vez da lista.
export const PAGINAS_MUNICIPIOS = {
  AC: 'Lista de municípios do Acre',
  AL: 'Lista de municípios de Alagoas',
  AP: 'Lista de municípios do Amapá',
  AM: 'Lista de municípios do Amazonas',
  BA: 'Lista de municípios da Bahia',
  CE: 'Lista de municípios do Ceará',
  ES: 'Lista de municípios do Espírito Santo',
  GO: 'Lista de municípios de Goiás',
  MA: 'Lista de municípios do Maranhão',
  MT: 'Lista de municípios de Mato Grosso',
  MS: 'Lista de municípios de Mato Grosso do Sul',
  MG: 'Lista de municípios de Minas Gerais',
  PA: 'Lista de municípios do Pará',
  PB: 'Lista de municípios da Paraíba',
  PR: 'Lista de municípios do Paraná',
  PE: 'Lista de municípios de Pernambuco',
  PI: 'Lista de municípios do Piauí',
  RJ: 'Lista de municípios do Rio de Janeiro',
  RN: 'Lista de municípios do Rio Grande do Norte',
  RS: 'Lista de municípios do Rio Grande do Sul',
  RO: 'Lista de municípios de Rondônia',
  RR: 'Lista de municípios de Roraima',
  SC: 'Lista de municípios de Santa Catarina',
  SP: 'Lista de municípios de São Paulo',
  SE: 'Lista de municípios de Sergipe',
  TO: 'Lista de municípios do Tocantins',
};

// Os dois primeiros dígitos do código IBGE de um município são os da UF.
const PREFIXOS_IBGE = {
  AC: '12',
  AL: '27',
  AP: '16',
  AM: '13',
  BA: '29',
  CE: '23',
  ES: '32',
  GO: '52',
  MA: '21',
  MT: '51',
  MS: '50',
  MG: '31',
  PA: '15',
  PB: '25',
  PR: '41',
  PE: '26',
  PI: '22',
  RJ: '33',
  RN: '24',
  RS: '43',
  RO: '11',
  RR: '14',
  SC: '42',
  SP: '35',
  SE: '28',
  TO: '17',
};

// O DF não tem municípios: Brasília é a única unidade com código IBGE, e não
// existe página de lista de municípios do DF na Wikipedia.
const DISTRITO_FEDERAL_CITIES = [{ nome: 'Brasília', codigo_ibge: '5300108' }];

// Templates cujo primeiro parâmetro é o próprio texto exibido.
// (`{{ord|...}}` é só a chave de ordenação e não aparece na página.)
const TEXT_TEMPLATES = new Set(['nowrap', 'nobr', 'flag']);

// `{{BR-GO-Abadia de Goiás}}` exibe o nome do município como link.
const MUNICIPIO_TEMPLATE = /^BR-[A-Z]{2}-(.+)$/;

const FILE_LINK = /^(ficheiro|arquivo|imagem|file|image):/i;

const replaceUntilStable = (text, pattern, replacer) => {
  let current = text;
  let previous;
  do {
    previous = current;
    current = current.replace(pattern, replacer);
  } while (current !== previous);
  return current;
};

const renderTemplate = (_, inner) => {
  const [name, ...params] = inner.split('|');
  const templateName = name.split(':')[0].trim().toLowerCase();

  if (templateName === 'formatnum') {
    return name.slice(name.indexOf(':') + 1);
  }
  const municipio = name.trim().match(MUNICIPIO_TEMPLATE);
  if (municipio) {
    return municipio[1];
  }
  if (TEXT_TEMPLATES.has(templateName)) {
    return params[0] ?? '';
  }
  return '';
};

const renderLink = (_, inner) => {
  if (FILE_LINK.test(inner.trim())) {
    return '';
  }
  const parts = inner.split('|');
  return parts[parts.length - 1];
};

// Converte o wikitext de uma célula no texto que aparece na página.
export const toPlainText = (wikitext) => {
  let text = replaceUntilStable(wikitext, /\{\{([^{}]*)\}\}/g, renderTemplate);
  text = replaceUntilStable(text, /\[\[([^[\]]*)\]\]/g, renderLink);

  return text
    .replace(/\[https?:\/\/[^\s\]]+\s+([^\]]+)\]/g, '$1')
    .replace(/\[https?:\/\/[^\]]+\]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/'{2,}/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

// Divide `text` em `separator` ignorando separadores dentro de [[...]] e {{...}}.
const splitTopLevel = (text, separator) => {
  const parts = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < text.length; i += 1) {
    const pair = text.slice(i, i + 2);
    if (pair === '[[' || pair === '{{') {
      depth += 1;
      i += 1;
    } else if ((pair === ']]' || pair === '}}') && depth > 0) {
      depth -= 1;
      i += 1;
    } else if (depth === 0 && text.startsWith(separator, i)) {
      parts.push(text.slice(start, i));
      start = i + separator.length;
      i += separator.length - 1;
    }
  }

  parts.push(text.slice(start));
  return parts;
};

// Remove os atributos de célula (`style="..." | conteúdo`).
const cellContent = (cell) => {
  const parts = splitTopLevel(cell, '|');
  return parts.length > 1 && parts[0].includes('=')
    ? parts.slice(1).join('|')
    : cell;
};

const parseRowCells = (row) => {
  const cells = [];

  row.split('\n').forEach((line) => {
    // Abertura, fechamento e legenda da tabela não são células.
    if (/^(\{\||\|\}|\|\+)/.test(line)) {
      return;
    }
    if (/^[|!]/.test(line)) {
      // Linhas de cabeçalho (`!`) separam células com `!!`, mas também
      // aceitam `||`.
      const parts =
        line[0] === '!'
          ? splitTopLevel(line.slice(1), '!!').flatMap((part) =>
              splitTopLevel(part, '||')
            )
          : splitTopLevel(line.slice(1), '||');
      parts.forEach((cell) => cells.push(cellContent(cell)));
    } else if (cells.length > 0) {
      cells[cells.length - 1] += `\n${line}`;
    }
  });

  return cells;
};

const formatName = (name) => name.replace(/\s*\([^)]*\)\s*$/, '').trim();

const isHeaderNameCell = (cell) => /^munic[ií]pio/i.test(cell);
const isHeaderCodeCell = (cell) => /ibge/i.test(cell);

// Lê as linhas de tabela do wikitext. As colunas do nome e do código vêm do
// cabeçalho ("Município" e "Código IBGE"), já que algumas páginas têm colunas
// entre as duas (sigla, fundação). Sem cabeçalho reconhecível, o código é a
// primeira célula com sete dígitos e o prefixo da UF, e o nome é a célula
// anterior. Não depende da abertura e do fechamento das tabelas, o que
// tolera marcação quebrada (como um `{|` duplicado).
export const parseCitiesFromWikitext = (wikitext, uf) => {
  const prefix = PREFIXOS_IBGE[uf];
  const cleaned = wikitext
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<ref[^>]*\/>/gi, '')
    .replace(/<ref[^>]*>[\s\S]*?<\/ref>/gi, '');

  const isCode = (cell) =>
    typeof cell === 'string' && /^\d{7}$/.test(cell) && cell.startsWith(prefix);

  const seen = new Set();
  const cities = [];
  let columns = null;

  cleaned.split(/\n\|-[^\n]*/).forEach((row) => {
    const cells = parseRowCells(row).map(toPlainText);
    const nameColumn = cells.findIndex(isHeaderNameCell);
    const codeColumn = cells.findIndex(isHeaderCodeCell);

    if (nameColumn !== -1 && codeColumn !== -1 && !cells.some(isCode)) {
      columns = { name: nameColumn, code: codeColumn };
      return;
    }

    const codeIndex =
      columns && isCode(cells[columns.code])
        ? columns.code
        : cells.findIndex(isCode);
    const nameIndex =
      codeIndex === columns?.code ? columns.name : codeIndex - 1;

    if (codeIndex < 1 || nameIndex < 0) {
      return;
    }

    const codigo = cells[codeIndex];
    const nome = formatName(cells[nameIndex]);

    if (!nome || /^\d+$/.test(nome) || seen.has(codigo)) {
      return;
    }

    seen.add(codigo);
    cities.push({ nome, codigo_ibge: codigo });
  });

  return cities;
};

const fetchWikitext = async (pageTitle) => {
  const { data } = await axios.get(WIKIPEDIA_API_URL, {
    params: {
      action: 'parse',
      page: pageTitle,
      prop: 'wikitext',
      redirects: 1,
      format: 'json',
      formatversion: 2,
    },
    headers: { 'User-Agent': WIKIPEDIA_USER_AGENT },
    timeout: WIKIPEDIA_TIMEOUT_MS,
  });

  if (data?.error) {
    throw new Error(`Wikipedia: ${data.error.info}`);
  }

  return data?.parse?.wikitext ?? '';
};

export const getStateCities = async (uf) => {
  const formattedUF = uf.toUpperCase();

  if (formattedUF === 'DF') {
    return DISTRITO_FEDERAL_CITIES.map((city) => ({ ...city }));
  }

  const pageTitle = PAGINAS_MUNICIPIOS[formattedUF];

  if (!pageTitle) {
    return [];
  }

  const wikitext = await fetchWikitext(pageTitle);
  return parseCitiesFromWikitext(wikitext, formattedUF);
};
