import cep from 'cep-promise';

import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';

const providers = ['correios', 'viacep', 'widenet', 'correios-alt'];

const tempBlockedIps = [];

const pathToBlock = '/api/cep/v1/52';

const tempBlockedUserAgents = ['Go-http-client/2.0'];

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
