import app from '@/app';
import { getUfByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';
import getStateHolidays from '@/services/holidays/state';
import BadRequestError from '@/errors/BadRequestError';

const action = async (request, response) => {
  const { uf, ano } = request.query;
  const { data, status } = await getUfByCode(uf);

  if (Array.isArray(data) && !data.length) {
    throw new BadRequestError({
      name: 'BadRequestError',
      message: `Uf inexistente`,
      type: 'state_does_not_exist_error',
    });
  }

  const info = getStateHolidays(uf, ano);

  response.status(status);
  return response.json(info);
};

export default app().get(action);
