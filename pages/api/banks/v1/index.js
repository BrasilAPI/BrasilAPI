import handle from 'handler';

import { getBanksData } from 'services/banco-central';

const action = async () => {
  const allBanksData = await getBanksData();

  return {
    status: 200,
    body: allBanksData,
  };
};

export default handle(action);
