import app from '@/app';
import { getBanksData } from '@/services/banco-central';

const action = async (request, response) => {
  const allBanksData = await getBanksData();

  if (request.query.search) {
    const { search } = request.query;
    const formatedSearch = search.toLowerCase();

    const filteredBanks = [];

    allBanksData.map((bank) => {
      const { code, name } = bank;

      // Checagem se search é parte do código do banco (number)
      const checkCode = String(code).toLowerCase().includes(formatedSearch);

      // Checagem se search é parte do nome do banco (string)
      const checkName = String(name.toLowerCase()).includes(formatedSearch);

      if (checkCode || checkName) {
        filteredBanks.push(bank);
      }

      return bank;
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
