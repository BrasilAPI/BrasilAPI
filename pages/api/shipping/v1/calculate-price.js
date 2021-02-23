import microCors from 'micro-cors';
import {
  calculateCorreiosShipping,
  validateCorreiosShippingData,
} from '../../../../services/shipping';

const cors = microCors();

async function shippingPrice(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: {
        message:
          'This method is not allowed for this route, try POST with a valid request body',
        more_info: 'https://brasilapi.com.br/docs',
      },
    });
  }

  try {
    await validateCorreiosShippingData(request.body);
  } catch (err) {
    delete err.value;
    delete err.inner;
    return response.status(422).json(err);
  }

  try {
    const result = await calculateCorreiosShipping(request.body);
    return response.status(200).json(result);
  } catch (err) {
    return response.status(500).json({
      error: {
        message: 'Internal Server Error',
      },
    });
  }
}

export default cors(shippingPrice);
