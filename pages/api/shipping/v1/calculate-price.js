import microCors from 'micro-cors';
import {
  calculateCorreiosShipping,
  validateCorreiosShippingData,
  ValidationError,
} from '../../../../services/shipping';

const cors = microCors();

async function shippingPrice(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      message:
        'This method is not allowed for this route, try POST with a valid request body',
      more_info: 'https://brasilapi.com.br/docs',
    });
  }

  try {
    await validateCorreiosShippingData(request.body);
    const result = await calculateCorreiosShipping(request.body);
    return response.status(200).json(result);
  } catch (err) {
    if (err instanceof ValidationError) {
      return response.status(422).json({
        message: 'validation error',
        errors: err.errors,
      });
    }

    return response.status(500).json({
      message: 'Internal Server Error',
    });
  }
}

export default cors(shippingPrice);
