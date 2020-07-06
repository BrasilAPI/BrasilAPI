import microCors from 'micro-cors';
import { getBanksData } from '../../../../services/banco-central';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const bankCode = Number(request.query.code);

  const allBanksData = await getBanksData();

  const bankData = allBanksData.find(({ code }) => code === bankCode);

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

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

export default cors(action);
