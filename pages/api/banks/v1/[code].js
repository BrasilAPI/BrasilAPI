import app from '../../../../app';
import { getBanksData } from '../../../../services/banco-central';

const action = async (request, response) => {
  const bankCode = Number(request.query.code);

  const allBanksData = await getBanksData();

  const bankData = allBanksData.find(({ code }) => code === bankCode);

  if (!bankData) {
    response.status(404);
    response.json({
      message: 'Código bancário não encontrado',
      type: 'BANK_CODE_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(bankData);
};

export default app().get(action);
