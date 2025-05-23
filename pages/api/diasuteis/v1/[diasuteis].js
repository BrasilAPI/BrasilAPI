import app from '@/app';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';
import getHolidays from '@/services/holidays';

const diasUteisHandler = (request, response) => {
  const {
    dataInicial = '',
    dataFinal = '',
    incluirFeriadosNacionais = 'true',
    // feriadosEstaduais = [], TODO: usar futuramente para considerar feriados estaduais
    // feriadosMunicipais = [], TODO: usar futuramente para considerar feriados municipais
  } = request.query;

  try {
    if (!dataInicial || !dataFinal) {
      return response.status(400).json({
        message: 'Parâmetros dataInicial e dataFinal são obrigatórios',
        type: 'DATE_PARAM_MISSING',
      });
    }

    const inicio = new Date(dataInicial);
    const fim = new Date(dataFinal);

    // para caso tenha mais de um ano entre as datas
    const anos = [];
    for (let ano = inicio.getFullYear(); ano <= fim.getFullYear(); ano += 1) {
      anos.push(ano);
    }

    const feriados =
      incluirFeriadosNacionais === 'true' ? anos.flatMap(getHolidays) : [];

    const diasUteis = [];

    for (
      let data = new Date(inicio);
      data <= fim;
      data.setDate(data.getDate() + 1)
    ) {
      const dia = data.getDay();
      const dataString = data.toISOString().split('T')[0];
      const isFeriado = feriados.some((feriado) => feriado.date === dataString);

      // segunda-feira é index 0
      const isDiaUtil = dia !== 5 && dia !== 6;

      if (isDiaUtil && !isFeriado) diasUteis.push(dataString);
    }

    return response.status(200).json({ diasUteis });
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar dias úteis',
      type: 'business_days_error',
    });
  }
};

export default app().get(diasUteisHandler);
