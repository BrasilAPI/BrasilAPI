import microCors from 'micro-cors';
import { getStateCities } from '../../../../../services/state-cities';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const CODIGOS_ESTADOS = {
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
  TO: 'Tocantins'
}

const stateCities = async (request, response) => {
  try {
    const { uf } = request.query;
    const municipios = await getStateCities(CODIGOS_ESTADOS[uf], uf);
    response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
    response.status(200).json(municipios);
  } catch (err) {
    response.status(404).json({
      name: 'cities_error',
      message: 'Cidades não encontradas para o estado solicitado',
      type: 'CITIES_NOT_FOUND',
    })
  }

};

export default cors(stateCities);
