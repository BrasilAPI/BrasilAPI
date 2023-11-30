import app from '@/app';;
import InternalError from '@/errors/InternalError';
import getLocation from '@/services/pluscode/pluscode.js';

const action = async (request, response) => {
  try {
    const plusCode = request.query.pluscode;
    const data = await getLocation(plusCode);

    response.status(200);
    response.json(data);
  } catch (error) {
    
    throw new InternalError({
      status: 400,
      message: `Plus Code inválido`,
      name: 'PLUS_CODE_ERROR',
      type: 'PLUS_CODE_ERROR',
    });
  }
};


export default app().get(action);
