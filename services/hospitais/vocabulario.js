// Traduz o que o usuário digita ("cascavel", "radioterapia", "terapia gênica")
// para o vocabulário canônico do dataset. Sem isso a API só responde a quem já
// conhece os termos em inglês — "cascavel" não acharia nenhum hospital com soro
// crotálico. Espelha lib/services/search-normalizer.ts e lib/services/disease-areas.ts
// do MapaSUS; mantenha os dois em sincronia.

// Slug em português usado na URL -> chave da vertical no dataset.
export const VERTICAIS = {
  peconhentos: 'venomous_animals',
  oncologia: 'oncology',
  raras: 'rare_diseases',
};

const normalizarChave = (valor) =>
  String(valor)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
    .trim();

// Soros antiveneno da vertical de peçonhentos.
const SOROS = {
  Bothropic: {
    rotulo: 'Botrópico (jararaca)',
    aliases: ['botropico', 'bothrops', 'jararaca', 'cobra'],
  },
  Crotalic: {
    rotulo: 'Crotálico (cascavel)',
    aliases: ['crotalico', 'crotalus', 'cascavel'],
  },
  Elapidic: {
    rotulo: 'Elapídico (coral)',
    aliases: ['elapidico', 'micrurus', 'coral'],
  },
  Lachetic: {
    rotulo: 'Laquético (surucucu)',
    aliases: ['laquetico', 'lachesis', 'surucucu'],
  },
  Scorpionic: {
    rotulo: 'Escorpiônico',
    aliases: ['escorpionico', 'escorpiao', 'escorpion', 'scorpion', 'tityus'],
  },
  Loxoscelic: {
    rotulo: 'Loxoscélico (aranha-marrom)',
    aliases: ['loxoscelico', 'loxosceles', 'aranha', 'aranha marrom', 'spider'],
  },
  Phoneutric: {
    rotulo: 'Foneútrico (armadeira)',
    aliases: ['foneutrico', 'phoneutria', 'armadeira', 'aranha armadeira'],
  },
  Lonomic: {
    rotulo: 'Lonômico (lagarta)',
    aliases: ['lonomico', 'lonomia', 'lagarta', 'caterpillar'],
  },
  Antiarachnidic: {
    rotulo: 'Antiaracnídico',
    aliases: ['antiaracnidico', 'antiarachnidic'],
  },
};

// Habilitações oficiais, por vertical. Uma capacidade pode ser servida por
// vários códigos de portaria — 17.13 é CACON, radioterapia e oncologia
// pediátrica ao mesmo tempo. O casamento é sempre pelo código numérico, nunca
// pelo texto, que vem cheio de ruído de OCR.
const HABILITACOES = {
  oncologia: {
    prefixo: '17',
    itens: {
      cacon: { rotulo: 'CACON', codigos: ['12', '13'], aliases: [] },
      unacon: {
        rotulo: 'UNACON',
        codigos: ['06', '07', '08', '09', '10', '11'],
        aliases: [],
      },
      radioterapia: {
        rotulo: 'Radioterapia',
        codigos: ['04', '07', '12', '13', '15'],
        aliases: ['radiotherapy'],
      },
      hematologia: {
        rotulo: 'Hematologia',
        codigos: ['08', '10'],
        aliases: ['hematology'],
      },
      oncologia_pediatrica: {
        rotulo: 'Oncologia pediátrica',
        codigos: ['09', '11', '13'],
        aliases: ['pediatric oncology'],
      },
      oncologia_clinica: {
        rotulo: 'Oncologia clínica',
        codigos: ['16'],
        aliases: ['clinical oncology'],
      },
      cirurgia_oncologica: {
        rotulo: 'Cirurgia oncológica',
        codigos: ['14'],
        aliases: ['oncology surgery'],
      },
      tratamento_sincronico: {
        rotulo: 'Tratamento sincrônico',
        codigos: ['22'],
        aliases: ['synchronous treatment'],
      },
      reconstrucao_mamaria: {
        rotulo: 'Reconstrução mamária',
        codigos: ['23'],
        aliases: ['breast reconstruction'],
      },
    },
  },
  raras: {
    prefixo: '35',
    itens: {
      anomalias_congenitas: {
        rotulo: 'Anomalias congênitas ou de manifestação tardia',
        codigos: ['01', '07'],
        aliases: ['congenital anomalies'],
      },
      deficiencia_intelectual: {
        rotulo: 'Deficiência intelectual',
        codigos: ['02', '08'],
        aliases: ['intellectual disability'],
      },
      erros_inatos_metabolismo: {
        rotulo: 'Erros inatos do metabolismo',
        codigos: ['03', '09'],
        aliases: ['inborn metabolism errors'],
      },
      doencas_inflamatorias: {
        rotulo: 'Doenças raras inflamatórias',
        codigos: ['04', '11'],
        aliases: ['inflammatory diseases'],
      },
      doencas_infecciosas: {
        rotulo: 'Doenças raras infecciosas',
        codigos: ['05', '12'],
        aliases: ['infectious diseases'],
      },
      doencas_autoimunes: {
        rotulo: 'Doenças raras autoimunes',
        codigos: ['06', '10'],
        aliases: ['autoimmune diseases'],
      },
      outras_nao_geneticas: {
        rotulo: 'Outras doenças raras de origem não genética',
        codigos: ['13', '14'],
        aliases: ['other non genetic'],
      },
      aconselhamento_genetico: {
        rotulo: 'Aconselhamento genético',
        codigos: ['15'],
        aliases: ['genetic counseling'],
      },
      terapia_genica: {
        rotulo: 'Terapia gênica',
        codigos: ['16'],
        aliases: ['gene therapy'],
      },
    },
  },
};

const indexar = () => {
  const soros = new Map();
  Object.entries(SOROS).forEach(([canonico, { aliases }]) => {
    soros.set(normalizarChave(canonico), canonico);
    aliases.forEach((alias) => soros.set(normalizarChave(alias), canonico));
  });

  const habilitacoes = new Map();
  Object.entries(HABILITACOES).forEach(([vertical, { prefixo, itens }]) => {
    Object.entries(itens).forEach(([chave, { codigos, aliases }]) => {
      const entrada = { vertical, prefixo, codigos, chave };
      habilitacoes.set(normalizarChave(chave), entrada);
      aliases.forEach((alias) =>
        habilitacoes.set(normalizarChave(alias), entrada)
      );
    });
  });

  return { soros, habilitacoes };
};

const { soros: INDICE_SOROS, habilitacoes: INDICE_HABILITACOES } = indexar();

const normalizarSoro = (valor) =>
  INDICE_SOROS.get(normalizarChave(valor)) || null;

const resolverHabilitacao = (valor) =>
  INDICE_HABILITACOES.get(normalizarChave(valor)) || null;

// Um código de portaria informado direto, como "17.07" ou "35.16".
const parsearCodigoDePortaria = (valor) => {
  const match = /^(17|35)\.?\s?(\d{2})$/.exec(String(valor).trim());

  return match ? { prefixo: match[1], codigos: [match[2]] } : null;
};

// Compiladas uma vez: extrairCodigos roda para cada hospital em cada busca por
// habilitação.
const REGEX_POR_PREFIXO = Object.fromEntries(
  Object.values(HABILITACOES).map(({ prefixo }) => [
    prefixo,
    new RegExp(`${prefixo}\\.?\\s?(\\d{2})`, 'g'),
  ])
);

// O texto de qualification_codes vem sujo — vários códigos concatenados por
// quebra de linha, espaçamento irregular de OCR, e o ponto às vezes ausente.
// Extrair por regex é o único jeito estável de saber quais códigos um
// estabelecimento tem.
export const extrairCodigos = (specialties, prefixo) => {
  const regex = REGEX_POR_PREFIXO[prefixo];
  const encontrados = new Set();

  if (!regex) {
    return encontrados;
  }

  (specialties || []).forEach((specialty) => {
    (specialty.qualification_codes || []).forEach((texto) => {
      // matchAll não depende de lastIndex, que precisaria ser zerado à mão
      // entre chamadas numa regex global compartilhada.
      [...String(texto).matchAll(regex)].forEach(([, codigo]) =>
        encontrados.add(codigo)
      );
    });
  });

  return encontrados;
};

// Resolve o termo do usuário contra os três vocabulários, em ordem: soros
// antiveneno, habilitações e, por fim, código de portaria cru. Devolve null
// quando não existe em nenhum, para o chamador responder 400 em vez de uma
// lista vazia silenciosa. É lógica puramente de vocabulário — não toca o
// dataset.
export const resolverAtendimento = (valor) => {
  const soro = normalizarSoro(valor);
  if (soro) {
    return { tipo: 'soro', soro };
  }

  const habilitacao = resolverHabilitacao(valor);
  if (habilitacao) {
    return { tipo: 'habilitacao', ...habilitacao };
  }

  const codigo = parsearCodigoDePortaria(valor);
  if (codigo) {
    return { tipo: 'habilitacao', ...codigo };
  }

  return null;
};

export const opcoesDeAtendimento = () => [
  ...Object.entries(SOROS).map(([canonico, { rotulo, aliases }]) => ({
    vertical: 'peconhentos',
    valor: canonico,
    rotulo,
    aliases,
  })),
  ...Object.entries(HABILITACOES).flatMap(([vertical, { itens }]) =>
    Object.entries(itens).map(([chave, { rotulo, codigos, aliases }]) => ({
      vertical,
      valor: chave,
      rotulo,
      codigos,
      aliases,
    }))
  ),
];
