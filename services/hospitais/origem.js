import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';
import { fetchCep } from '@/services/cep/cep';
import fetchGeocoordinateFromBrazilLocation from '@/lib/fetchGeocoordinateFromBrazilLocation';
import { parseLatitude, parseLongitude, parseUf } from './query';

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

// Converte o que o cliente informou em um par de coordenadas, aceitando três
// formas: latitude+longitude direto, cep, ou municipio+uf. O geocoding só
// acontece para essa origem — as coordenadas dos hospitais já vêm resolvidas
// no snapshot.
export async function resolverOrigem({
  cep,
  latitude,
  longitude,
  municipio,
  uf,
}) {
  if (latitude !== undefined || longitude !== undefined) {
    return {
      latitude: parseLatitude(latitude),
      longitude: parseLongitude(longitude),
    };
  }

  const ufValidada = parseUf(uf);

  if (cep === undefined && !(municipio && ufValidada)) {
    throw new BadRequestError({
      message:
        'Informe a origem da busca: cep, latitude e longitude, ou municipio e uf.',
      type: 'validation_error',
    });
  }

  const localizacao = cep
    ? await fetchGeocoordinateFromBrazilLocation(await buscarCep(cep))
    : await fetchGeocoordinateFromBrazilLocation({
        city: municipio,
        state: ufValidada,
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
