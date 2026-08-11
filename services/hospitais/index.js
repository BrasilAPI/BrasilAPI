import removeSpecialChars from '@/util/removeSpecialChars';
import haversine from '@/util/haversine';
import snapshot from './snapshots/latest.json';
import {
  extrairCodigos,
  normalizarSoro,
  opcoesDeAtendimento,
  parsearCodigoDePortaria,
  resolverHabilitacao,
} from './vocabulario';

// O dataset vem de um snapshot commitado, gerado diariamente por
// scripts/generate-hospitais-snapshot.js. O MapaSUS roda inteiramente em free
// tier, então nenhuma rota do BrasilAPI pode chamá-lo em request-time: sob
// pico, cada cold start de lambda viraria uma rajada de requests no serviço.
// Ver docs/HOSPITAIS_MAPASUS.md.

export const VERTICAIS = {
  peconhentos: 'venomous_animals',
  oncologia: 'oncology',
  raras: 'rare_diseases',
};

const hospitais = Array.isArray(snapshot.hospitais) ? snapshot.hospitais : [];
const ciatox = Array.isArray(snapshot.ciatox) ? snapshot.ciatox : [];

// Procedência e aviso vivem aqui, não no snapshot: é texto editorial que
// precisa passar por review, não dado gerado por script.
export const FONTE = {
  nome: 'MapaSUS',
  url: 'https://mapasus.com.br',
  oficial: false,
  documentos_de_origem: 'Ministério da Saúde — gov.br/saude',
  aviso:
    'O MapaSUS e a BrasilAPI não são serviços oficiais do Ministério da Saúde e não possuem vínculo com o órgão. Os dados são extraídos automaticamente de documentos públicos publicados pelo Ministério da Saúde e podem conter erros de extração ou estar desatualizados em relação à fonte oficial.',
};

// Alguém pode consultar esta API no meio de um acidente. A orientação oficial
// para animais peçonhentos é ligar antes de se deslocar — a unidade mais
// próxima pode não ter o soro em estoque no momento.
export const EMERGENCIA = {
  aviso:
    'Esta API não substitui atendimento médico. Em emergência, ligue 192 (SAMU). Em caso de acidente com animal peçonhento ou intoxicação, ligue para o CIATOX da sua região antes de se deslocar — a unidade listada pode não ter o soro disponível no momento.',
  samu: '192',
  disque_intoxicacao: '0800 722 6001',
  ciatox: '/api/hospitais/v1/ciatox',
};

export const getSnapshotMetadata = () => ({
  atualizado_em: snapshot.generated_at || null,
  fonte: FONTE,
  emergencia: EMERGENCIA,
});

const matchesText = (haystack, needle) =>
  removeSpecialChars(String(haystack || '')).includes(needle);

const temSoro = (hospital, soro) => (hospital.treatments || []).includes(soro);

const temHabilitacao = (hospital, { prefixo, codigos }) => {
  const doHospital = extrairCodigos(hospital.specialties, prefixo);

  return codigos.some((codigo) => doHospital.has(codigo));
};

// `atendimento` é o parâmetro único que atravessa as três verticais: resolve
// primeiro contra os soros antiveneno, depois contra as habilitações de
// oncologia e doenças raras, e por fim aceita um código de portaria cru.
// Retorna null quando o termo não existe em nenhum vocabulário, para o handler
// devolver 400 em vez de uma lista vazia silenciosa.
export function resolverAtendimento(valor) {
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
}

const atendeA = (hospital, atendimento) =>
  atendimento.tipo === 'soro'
    ? temSoro(hospital, atendimento.soro)
    : temHabilitacao(hospital, atendimento);

// `atendimentos` já chega resolvido pelo handler (ver services/hospitais/query.js),
// que devolve 400 para termos fora do vocabulário. Todos os informados precisam
// casar.
export function getHospitais({
  vertical,
  uf,
  municipio,
  atendimentos = [],
  q,
} = {}) {
  const verticalKey = vertical ? VERTICAIS[vertical] : null;
  const ufKey = uf ? String(uf).toUpperCase() : null;
  const municipioKey = municipio ? removeSpecialChars(municipio) : null;
  const qKey = q ? removeSpecialChars(q) : null;

  return hospitais.filter((hospital) => {
    if (verticalKey && !(hospital.verticals || []).includes(verticalKey)) {
      return false;
    }

    if (ufKey && hospital.state_code !== ufKey) {
      return false;
    }

    if (municipioKey && !matchesText(hospital.city, municipioKey)) {
      return false;
    }

    if (!atendimentos.every((a) => atendeA(hospital, a))) {
      return false;
    }

    if (
      qKey &&
      !matchesText(hospital.name, qKey) &&
      !matchesText(hospital.address, qKey)
    ) {
      return false;
    }

    return true;
  });
}

export const contarPorAtendimento = () =>
  opcoesDeAtendimento().map((opcao) => {
    const resolvido = resolverAtendimento(opcao.valor);

    return {
      ...opcao,
      total: hospitais.filter((h) => atendeA(h, resolvido)).length,
    };
  });

export const contarPorVertical = () =>
  Object.entries(VERTICAIS).map(([slug, chave]) => ({
    valor: slug,
    total: hospitais.filter((h) => (h.verticals || []).includes(chave)).length,
  }));

export function getHospitaisProximos({
  latitude,
  longitude,
  raioEmMetros,
  ...filtros
}) {
  const origem = { latitude, longitude };

  return getHospitais(filtros)
    .filter(
      (hospital) =>
        typeof hospital.lat === 'number' && typeof hospital.lng === 'number'
    )
    .map((hospital) => {
      const distanciaEmMetros = haversine(origem, {
        latitude: hospital.lat,
        longitude: hospital.lng,
      });

      return {
        ...hospital,
        distancia_metros: Math.round(distanciaEmMetros),
        distancia_km: Math.round((distanciaEmMetros / 1000) * 10) / 10,
      };
    })
    .filter((hospital) => hospital.distancia_metros <= raioEmMetros)
    .sort((a, b) => a.distancia_metros - b.distancia_metros);
}

export function getCiatox({ uf } = {}) {
  if (!uf) {
    return ciatox;
  }

  const ufKey = String(uf).toUpperCase();
  return ciatox.filter((centro) => centro.state_code === ufKey);
}
