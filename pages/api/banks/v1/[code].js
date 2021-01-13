import ApiError from 'errors/api-error';
import handle from 'handler';

import { getBanksData } from 'services/banco-central';

const action = async (request) => {
  const bankCode = Number(request.query.code);

  const allBanksData = await getBanksData();

  const bankData = allBanksData.find(({ code }) => code === bankCode);

  if (!bankData) {
    throw new ApiError({
      status: 404,
      message: 'Código bancário não encontrado',
      type: 'BANK_CODE_NOT_FOUND',
    });
  }

  return {
    status: 200,
    body: bankData,
  };
};

export default handle(action);
