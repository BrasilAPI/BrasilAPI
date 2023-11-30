import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getPensioners } from '@/services/dados-publicos-senado/servidores/index';

async function getAllPensioners(request, response) {
    try {
        const result = await getPensioners();

        return response.status(200).json(result.data);

      } catch (error) {

        console.log(error.message);

        if (error.response.status === 400) {
          throw new BadRequestError({ message: 'Bad Request.' });
        }
        
        throw error;
      }
    }
    
export default app().get(getAllPensioners);