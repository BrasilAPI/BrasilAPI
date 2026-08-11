import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { fetchCep } from '@/services/cep/cep';
import {
  getHospitaisProximos,
  getSnapshotMetadata,
} from '@/services/hospitais';
import {
  parseAtendimento,
  parseCoordenada,
  parsePaginacao,
  parseUf,
  parseVertical,
} from '@/services/hospitais/query';
import fetchGeocoordinateFromBrazilLocation from '@/lib/fetchGeocoordinateFromBrazilLocation';

const RAIO_KM_PADRAO = 50;
const RAIO_KM_MAXIMO = 200;
const LIMIT_PADRAO_PROXIMOS = 50;

function parseRaioEmMetros(raioKm) {
  if (raioKm === undefined) {
    return RAIO_KM_PADRAO * 1000;
  }

  const numero = Number(raioKm);

  if (!Number.isFinite(numero) || numero <= 0 || numero > RAIO_KM_MAXIMO) {
    throw new BadRequestError({
      message: `O parâmetro raio_km deve ser um número entre 0 e ${RAIO_KM_MAXIMO}.`,
      type: 'validation_error',
    });
  }

  return numero * 1000;
}

// O cep-promise sinaliza CEP malformado e CEP não encontrado com o mesmo
// CepPromiseError, distinguindo pelo `type`. Sem esta tradução ambos vazariam
// como 500 — a mesma conversão que pages/api/cep/v2/[cep].js faz.
async function buscarCep(cep) {
  try {
    return await fetchCep(cep);
  } catch (error) {
    if (error.name !== 'CepPromiseError') {
      throw error;
    }

    if (error.type === 'validation_error') {
      throw new BadRequestError({
        message: error.message,
        type: 'validation_error',
      });
    }

    throw new NotFoundError({
      message: `CEP ${cep} não encontrado. Informe latitude e longitude, ou municipio e uf.`,
      type: 'not_found',
    });
  }
}

// O geocoding só acontece para a origem informada pelo cliente. As coordenadas
// dos hospitais já vêm resolvidas no snapshot.
async function resolverOrigem({ cep, latitude, longitude, municipio, uf }) {
  if (latitude !== undefined || longitude !== undefined) {
    return {
      latitude: parseCoordenada(latitude, 'latitude', 90),
      longitude: parseCoordenada(longitude, 'longitude', 180),
    };
  }

  const localizacao = cep
    ? await fetchGeocoordinateFromBrazilLocation(await buscarCep(cep))
    : await fetchGeocoordinateFromBrazilLocation({
        city: municipio,
        state: uf,
      });

  const { latitude: lat, longitude: lng } = localizacao.coordinates;

  if (lat === null || lng === null) {
    throw new BadRequestError({
      message:
        'Não foi possível determinar as coordenadas da origem informada. Tente enviar latitude e longitude diretamente.',
      type: 'validation_error',
    });
  }

  return { latitude: Number(lat), longitude: Number(lng) };
}

async function listarHospitaisProximos(request, response) {
  const { cep, latitude, longitude, municipio, uf, vertical, atendimento } =
    request.query;

  const ufValidada = parseUf(uf);

  if (
    cep === undefined &&
    latitude === undefined &&
    longitude === undefined &&
    !(municipio && ufValidada)
  ) {
    throw new BadRequestError({
      message:
        'Informe a origem da busca: cep, latitude e longitude, ou municipio e uf.',
      type: 'validation_error',
    });
  }

  const origem = await resolverOrigem({
    cep,
    latitude,
    longitude,
    municipio,
    uf: ufValidada,
  });

  const raioEmMetros = parseRaioEmMetros(request.query.raio_km);

  const encontrados = getHospitaisProximos({
    ...origem,
    raioEmMetros,
    vertical: parseVertical(vertical),
    atendimento: parseAtendimento(atendimento),
  });

  const { limit, offset } = parsePaginacao(
    request.query,
    LIMIT_PADRAO_PROXIMOS
  );

  return response.status(200).json({
    total: encontrados.length,
    limit,
    offset,
    origem,
    raio_km: raioEmMetros / 1000,
    ...getSnapshotMetadata(),
    items: encontrados.slice(offset, offset + limit),
  });
}

export default app({ cache: 86400 }).get(listarHospitaisProximos);
