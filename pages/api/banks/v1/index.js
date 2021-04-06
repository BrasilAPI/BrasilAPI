import app from '@/app';
import { getBanksData } from '@/services/banco-central';

const action = async (request, response) => {
  const allBanksData = await getBanksData();

  if (request.query.search) {
    const { search } = request.query;
    const formatedSearch = search.toLowerCase();

    const filteredBanks = allBanksData.filter((bank) => {
      const { code, name } = bank;

      // Checagem se search é parte do código do banco (number)
      const checkCode = String(code).toLowerCase().indexOf(formatedSearch) > -1;

      // Checagem se search é parte do nome do banco (string)
      const checkName = String(name.toLowerCase()).indexOf(formatedSearch) > -1;

      return checkCode || checkName;
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
