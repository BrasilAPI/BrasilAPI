import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getQuantitativosPessoal } from '@/services/dados-publicos-senado/servidores/index';

async function getQuantitativosPessoais(request, response) {
    try {
        
        const result = await getQuantitativosPessoal();

        response.status(200);
        return response.json(result);

        } catch (error) {

        console.log(error.message);

        if (error.response.status === 400) {
          throw new BadRequestError({ message: 'Bad Request.' });
        }
        
        throw error;
      }
    }
    
export default app().get(getQuantitativosPessoais);