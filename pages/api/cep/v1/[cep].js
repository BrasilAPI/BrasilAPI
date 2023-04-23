import cep from 'cep-promise';

import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';

const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

const tempBlockedIps = [
  '172.71.234.133',
  '172.71.234.57',
  '172.71.234.132',
  '172.71.234.56',
  '172.71.234.152',
  '172.71.234.153',
  '172.71.234.161',
  '172.71.234.160',
  '172.70.105.180',
  '172.70.105.181',
  '172.69.3.230',
  '172.69.3.229',
  '172.70.105.163',
  '172.70.105.162',
  '172.71.11.118',
  '172.71.10.17',
  '172.71.10.16',
  '172.71.11.117',
  '172.71.11.67',
  '172.71.11.68',
  '172.71.10.240',
  '172.71.10.241',
  '172.70.105.188',
  '172.70.105.189',
];

const tempBlockedUserAgents = ['Go-http-client/2.0'];

async function Cep(request, response) {
  const clientIp =
    request.headers['x-forwarded-for'] || request.connection.remoteAddress;

  if (
    clientIp &&
    tempBlockedUserAgents.includes(request.headers['user-agent']) &&
    tempBlockedIps.includes(clientIp)
  ) {
    response.status(508);
    return response.send(
      'please stop abusing our public API, join our slack to chat a bit https://join.slack.com/t/brasilapi/shared_invite/zt-1k9w5h27p-4yLWoOQqIMgwqunnHCyWCQ'
    );
  }

  try {
    const requestedCep = request.query.cep;

    const cepResult = await cep(requestedCep, {
      providers,
    });

    response.status(200);
    return response.json(cepResult);
  } catch (error) {
    if (error.name !== 'CepPromiseError') {
      throw error;
    }

    if (error.type === 'validation_error') {
      throw new BadRequestError(error);
    }

    if (error.type === 'service_error') {
      throw new NotFoundError(error);
    }
  }
}

export default app({ cache: 172800 }).get(Cep);
