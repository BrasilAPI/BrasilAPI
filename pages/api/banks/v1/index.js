import app from '@/app';
import { getBanksData } from '@/services/banco-central';

const containStringCaseInsensitive = (input, search) => {
  return String(input).toLowerCase().includes(search.toLowerCase());
};

const action = async (request, response) => {
  let banksData = await getBanksData();

  if (request.query.search) {
    const { search } = request.query;

    banksData = banksData.filter((bank) => {
      const { code, name } = bank;

      return (
        containStringCaseInsensitive(code, search) ||
        containStringCaseInsensitive(name, search)
      );
    });
  }

  response.status(200);
  response.json(banksData);
  return response;
};

export default app().get(action);
