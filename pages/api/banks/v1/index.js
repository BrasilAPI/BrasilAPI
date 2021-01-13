import handle from 'handler';
import { cache } from 'handler/middlewares/cache';

import { getBanksData } from 'services/banco-central';

const action = async () => {
  const allBanksData = await getBanksData();

  return {
    status: 200,
    body: allBanksData,
  };
};

export default handle(cache(), action);
