import app from '@/app';
import { getBanksData } from '@/services/banco-central';

const checkSubstrings = (input, search) => {
  return String(input).toLowerCase().includes(search.toLowerCase());
};

const action = async (request, response) => {
  const allBanksData = await getBanksData();

  if (request.query.search) {
    const { search } = request.query;

    const filteredBanks = allBanksData.filter((bank) => {
      const { code, name } = bank;

      return (
        (checkSubstrings(code, search) || checkSubstrings(name, search)) && bank
      );
    });

    response.status(200);
    response.json(filteredBanks);
    return response;
  }

  response.status(200);
  response.json(allBanksData);
  return response;
};

export default app().get(action);
