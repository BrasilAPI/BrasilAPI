import app from '@/app';
import { getUfByCode } from '@/services/ibge/gov';
import NotFoundError from '@/errors/NotFoundError';
import getStateHolidays from '@/services/holidays/state';

const action = async (request, response) => {
  const { uf, ano } = request.query;
  const { data, status } = await getUfByCode(uf);

  if (Array.isArray(data) && !data.length) {
    throw new NotFoundError({ message: 'UF não encontrada.' });
  }

  const info = getStateHolidays(uf, ano);

  response.status(status);
  return response.json(info);
};

export default app().get(action);
