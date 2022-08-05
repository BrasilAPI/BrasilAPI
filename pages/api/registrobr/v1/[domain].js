import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import InternalError from '@/errors/InternalError';
import getRegistroBrAvail from '@/services/registro';

const descriptions = [
  'AVAILABLE',
  'AVAILABLE_WITH_TICKET',
  'REGISTERED',
  'UNAVAILABLE',
  'INVALID_QUERY',
  'RELEASE_WAITING',
  'RELEASE_IN_PROGRESS',
  'RELEASE_IN_PROGRESS_WITH_TICKETS',
  'ERROR',
  'DOMAIN_PROCESS_RELEASE',
  'UNKNOW',
];

async function data(request, response) {
  try {
    const result = await getRegistroBrAvail(request.query.domain);
    const { status = 10, ...rest } = result.data;
    return response.status(result.status).json({
      status_code: status,
      status: descriptions[status >= 0 && status < 10 ? status : 10],
      ...rest,
    });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message)
      throw new BadRequestError({ message: error.response.data.message });
    else if (error.message)
      throw new BadRequestError({ message: error.message });
    else throw new InternalError(error);
  }
}

export default app({ cache: 7200 }).get(data);
