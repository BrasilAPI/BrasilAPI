import removeSpecialChars from '@/util/removeSpecialChars';
import haversine from '@/util/haversine';
import snapshot from './snapshots/latest.json';
import metrics from './snapshots/metrics-latest.json';
import {
  extrairCodigos,
  opcoesDeAtendimento,
  resolverAtendimento,
  VERTICAIS,
} from './vocabulario';

// O dataset vem de um snapshot commitado, gerado diariamente por
// scripts/generate-hospitais-snapshot.js. O MapaSUS roda inteiramente em free
// tier, então nenhuma rota do BrasilAPI pode chamá-lo em request-time: sob
// pico, cada cold start de lambda viraria uma rajada de requests no serviço.
// Ver docs/HOSPITAIS_MAPASUS.md.

const hospitais = Array.isArray(snapshot.hospitais) ? snapshot.hospitais : [];
const ciatox = Array.isArray(snapshot.ciatox) ? snapshot.ciatox : [];

// Procedência e aviso vivem aqui, não no snapshot: é texto editorial que
// precisa passar por review, não dado gerado por script.
const FONTE = {
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
const EMERGENCIA = {
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

const atendeA = (hospital, atendimento) =>
  atendimento.tipo === 'soro'
    ? temSoro(hospital, atendimento.soro)
    : temHabilitacao(hospital, atendimento);

// `atendimento` já chega resolvido pelo handler (ver services/hospitais/query.js),
// que devolve 400 para termos fora do vocabulário.
export function getHospitais({ vertical, uf, municipio, atendimento, q } = {}) {
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

    if (atendimento && !atendeA(hospital, atendimento)) {
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
  vertical,
  atendimento,
}) {
  const origem = { latitude, longitude };

  return getHospitais({ vertical, atendimento })
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

// O CNES oficial tem 7 dígitos, mas a extração dos PDFs do Ministério perde
// zeros à esquerda (e ocasionalmente deixa separadores) em parte dos
// registros — a comparação normaliza os dois lados.
const normalizarCnes = (valor) =>
  String(valor || '')
    .replace(/\D/g, '')
    .replace(/^0+/, '');

// Devolve lista, não objeto único: o mesmo CNES pode aparecer em mais de um
// registro (estabelecimento habilitado em verticais diferentes que a fonte
// não consolidou).
export function getHospitaisPorCnes(cnes) {
  const chave = normalizarCnes(cnes);

  if (!chave) {
    return [];
  }

  return hospitais.filter(
    (hospital) => normalizarCnes(hospital.cnes) === chave
  );
}

// Frescor por UF reportado pelo MapaSUS no momento da coleta do snapshot
// (vazio em snapshots gerados antes dessa coleta existir).
const SINCRONIA_POR_UF = new Map(
  (metrics.sincronia_da_fonte || []).map((estado) => [
    estado.state_code,
    estado,
  ])
);

export function getEstados() {
  const totaisPorUf = new Map();

  const somar = (uf, campo) => {
    const atual = totaisPorUf.get(uf) || { hospitais: 0, ciatox: 0 };
    atual[campo] += 1;
    totaisPorUf.set(uf, atual);
  };

  hospitais.forEach((hospital) => somar(hospital.state_code, 'hospitais'));
  ciatox.forEach((centro) => somar(centro.state_code, 'ciatox'));

  return [...totaisPorUf.entries()]
    .sort(([ufA], [ufB]) => ufA.localeCompare(ufB))
    .map(([uf, totais]) => {
      const sincronia = SINCRONIA_POR_UF.get(uf) || {};

      return {
        uf,
        total_hospitais: totais.hospitais,
        total_ciatox: totais.ciatox,
        // synced_at é a última checagem da fonte pelo MapaSUS; updated_at é a
        // data de publicação informada pelo gov.br (null quando a fonte está
        // despublicada ou o snapshot é anterior a essa coleta).
        status: sincronia.status ?? null,
        synced_at: sincronia.synced_at ?? null,
        updated_at: sincronia.updated_at ?? null,
      };
    });
}
