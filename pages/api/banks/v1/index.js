import app from '@/app';
import { getBanksData } from '@/services/banco-central';

const action = async (request, response) => {
  const allBanksData = await getBanksData();

  if (request.query.search) {
    const { search } = request.query;

    const filteredBanks = allBanksData.filter(
      ({ code, name }) =>
        String(code).toLowerCase().includes(search.toLowerCase()) ||
        String(name.toLowerCase()).includes(search.toLowerCase())
    );

    response.status(200);
    response.json(filteredBanks);
  } else {
    response.status(200);
    response.json(allBanksData);
  }
};

export default app().get(action);
