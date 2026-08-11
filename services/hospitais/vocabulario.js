// Traduz o que o usuário digita ("cascavel", "radioterapia", "terapia gênica")
// para o vocabulário canônico do dataset. Sem isso a API só responde a quem já
// conhece os termos em inglês — "cascavel" não acharia nenhum hospital com soro
// crotálico. Espelha lib/services/search-normalizer.ts e lib/services/disease-areas.ts
// do MapaSUS; mantenha os dois em sincronia.

export const normalizarChave = (valor) =>
  String(valor)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-_\s]+/g, ' ')
    .trim();

// Soros antiveneno da vertical de peçonhentos.
export const SOROS = {
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
export const HABILITACOES = {
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

export const normalizarSoro = (valor) =>
  INDICE_SOROS.get(normalizarChave(valor)) || null;

export const resolverHabilitacao = (valor) =>
  INDICE_HABILITACOES.get(normalizarChave(valor)) || null;

// Um código de portaria informado direto, como "17.07" ou "35.16".
export const parsearCodigoDePortaria = (valor) => {
  const match = /^(17|35)\.?\s?(\d{2})$/.exec(String(valor).trim());

  return match ? { prefixo: match[1], codigos: [match[2]] } : null;
};

// O texto de qualification_codes vem sujo — vários códigos concatenados por
// quebra de linha, espaçamento irregular de OCR, e o ponto às vezes ausente.
// Extrair por regex é o único jeito estável de saber quais códigos um
// estabelecimento tem.
export const extrairCodigos = (specialties, prefixo) => {
  const encontrados = new Set();
  const regex = new RegExp(`${prefixo}\\.?\\s?(\\d{2})`, 'g');

  (specialties || []).forEach((specialty) => {
    (specialty.qualification_codes || []).forEach((texto) => {
      const alvo = String(texto);
      let match = regex.exec(alvo);

      while (match !== null) {
        encontrados.add(match[1]);
        match = regex.exec(alvo);
      }

      regex.lastIndex = 0;
    });
  });

  return encontrados;
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
