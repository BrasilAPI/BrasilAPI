import cep from 'cep-promise';
import csvToJson from 'csvtojson';
import microCors from 'micro-cors';

import fetchGeocoordinateFromBrazilLocation from '../../../../lib/fetchGeocoordinateFromBrazilLocation';

const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

const tempBlockedIps = [];

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const pathToBlock = '/api/cep/v1/52';

const tempBlockedUserAgents = ['Go-http-client/2.0'];

// função retorna a estrutura de dados da cidade alvo formatada
const formataCidade = (cidade) => {
  const cidadeData = {
    state: cidade.state,
    city: cidade.locality,
    cep_interval: cidade.postcode_range,
  };

  return cidadeData;
};

async function Cep(request, response) {
  const clientIp =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  if (
    clientIp &&
    tempBlockedUserAgents.includes(request.headers['user-agent']) &&
    tempBlockedIps.includes(clientIp)
  ) {
    response.status(429);
    return response.send(
      'please stop abusing our public API, join our slack to chat a bit https://join.slack.com/t/brasilapi/shared_invite/zt-1k9w5h27p-4yLWoOQqIMgwqunnHCyWCQ'
    );
  }

  if (
    tempBlockedUserAgents.includes(request.headers['user-agent']) &&
    request.url.includes(pathToBlock)
  ) {
    response.status(429);
    return response.send(
      'please stop abusing our public API, join our slack to chat a bit https://join.slack.com/t/brasilapi/shared_invite/zt-1k9w5h27p-4yLWoOQqIMgwqunnHCyWCQ'
    );
  }

  try {
    const requestedCep = request.query.cep;

    // ler o .csv dos ranges das cidades
    const csvFilePath = `${process.cwd()}/public/range.csv`;
    const json = await csvToJson().fromFile(csvFilePath);
    const ranges = JSON.stringify(json, null, 2);
    const rangesList = JSON.parse(ranges);

    // comparar o requestCep
    const resultado = [];

    // se o cep vir inteiro
    if (requestedCep.length >= 8) {
      response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

      const cepResult = await cep(requestedCep, {
        providers,
      });
      const location = await fetchGeocoordinateFromBrazilLocation(cepResult);

      response.status(200);
      return response.json({ ...cepResult, location });
    }

    // se não for o cep inteiro
    if (requestedCep.length < 8) {
      rangesList.forEach(async (cidade) => {
        // testando diretamente uma subquery de cep
        const regex = new RegExp(`^${requestedCep}`);
        if (regex.test(cidade.postcode_range)) {
          if (cidade.range_type !== 'Exclusiva da sede urbana') {
            resultado.push(formataCidade(cidade));
          }
        }

        // testando valor dentro do range
        const range = cidade.postcode_range.split(' ');
        const start = range[0].replace('-', '');
        const end = range[2].replace('-', '');

        if (requestedCep >= start && requestedCep <= end)
          if (cidade.range_type !== 'Exclusiva da sede urbana') {
            resultado.push(formataCidade(cidade));
          }
      });
    }

    response.status(200);
    return response.json(resultado);
  } catch (error) {
    if (error.name === 'CepPromiseError') {
      switch (error.type) {
        case 'validation_error':
          response.status(400);
          break;
        case 'service_error':
          response.status(404);
          break;
        default:
          break;
      }

      return response.json(error);
    }

    response.status(500);
    return response.json(error);
  }
}

export default cors(Cep);
