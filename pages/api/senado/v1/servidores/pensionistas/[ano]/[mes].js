import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getRemuneracoesPensionistas } from '@/services/dados-publicos-senado/servidores/index';

function isYearValid(year){
    const currentYear = new Date().getFullYear();
    const yearN = parseInt(year, 10);   

    return !isNaN(yearN) && year <= currentYear && yearN >= 2012;
}

function isMonthValid(month){
  const currentMonth = new Date().getMonth();
  month = parseInt(month, 10); 

  return !isNaN(month) || month < currentMonth || month >= 1;
}

async function getAllRemuneracoesPensionistas(request, response) {
    try {
        const { ano, mes } = request.query;
        if(!ano || !mes)
          throw new BadRequestError({message: 'Ano e mês obrigatórios'});
        
        if(!isYearValid(ano) || !isMonthValid(mes) || (mes < 8 && ano === 2012))
          throw new BadRequestError({message: 'Ano e/ou mês inválido(s)'})
        
        const result = await getRemuneracoesPensionistas(ano, mes);

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
    
export default app().get(getAllRemuneracoesPensionistas);