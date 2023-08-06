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
  '172.69.3.251',
  '172.70.105.151',
  '172.69.3.251',
  '172.69.3.193',
  '172.69.3.194',
  '172.69.3.210',
  '172.69.3.209',
  '172.69.3.252',
  '172.70.105.151',
  '172.71.11.67',
  '172.71.10.241',
  '172.71.11.118',
  '172.71.6.139',
  '172.71.10.16',
  '172.71.10.17',
  '172.71.11.117',
  '172.71.10.240',
  '172.71.234.133',
  '172.71.234.152',
  '172.68.18.218',
  '172.71.238.154',
  '172.71.234.56',
  '172.71.11.68',
  '172.71.6.165',
  '172.71.6.138',
  '172.71.6.235',
  '172.68.18.27',
  '172.68.19.164',
  '172.71.234.153',
  '172.71.6.164',
  '172.70.254.203',
  '172.68.19.36',
  '172.71.238.98',
  '172.68.18.178',
  '172.68.18.52',
  '172.71.16.211',
  '172.71.6.92',
  '172.68.18.22',
  '172.71.16.173',
  '172.71.238.21',
  '172.71.16.172',
  '172.71.234.132',
  '172.71.238.20',
  '172.71.238.118',
  '172.68.19.45',
  '172.70.38.173',
  '172.68.18.147',
  '172.71.234.57',
  '172.68.19.129',
  '172.68.19.130',
  '172.68.19.33',
  '172.71.166.243',
  '172.68.18.18',
  '172.71.6.93',
  '172.71.6.234',
  '172.68.19.46',
  '172.68.34.160',
  '172.68.19.166',
  '172.68.19.174',
  '172.71.238.155',
  '172.70.91.233',
  '172.68.19.173',
  '172.68.18.179',
  '172.71.16.204',
  '172.68.18.19',
  '172.71.234.161',
  '172.70.42.101',
  '172.70.55.66',
  '172.70.105.150',
  '172.68.18.51',
  '172.70.254.227',
  '172.68.19.6',
  '172.71.16.200',
  '172.68.18.146',
  '172.71.16.205',
  '172.71.16.210',
  '172.68.113.140',
  '172.71.238.119',
  '172.70.54.171',
  '172.71.222.110',
  '172.70.193.138',
  '172.70.135.61',
];

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
