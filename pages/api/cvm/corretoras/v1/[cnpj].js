import microCors from 'micro-cors';
import { getExchangesData } from '../../../../../services/cvm/corretoras';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';
const cors = microCors();

const action = async (request, response) => {
  const exchangeCode = request.query.cnpj.replace(/\D/gim, '');

  const allExchangesData = await getExchangesData();

  const exchangeData = allExchangesData.find(
    ({ cnpj }) => cnpj === exchangeCode
  );

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  if (!exchangeData) {
    response.status(404);
    response.json({
      message: 'CNPJ não encontrado',
      type: 'CNPJ_NOT_FOUND',
    });

    return;
  }

  response.status(200);
  response.json(exchangeData);
};

export default cors(action);
