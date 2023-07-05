import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getCambio } from '@/services/cambio/getCambio';
import dayjs from 'dayjs';
import { formatDate } from '@/services/date';
import { getMoedas } from '@/services/cambio/getMoedas';
import BaseError from '@/errors/BaseError';
import InternalError from '@/errors/InternalError';

const Action = async (request, response) => {
  const { data, moeda } = request.query;

  try {
    const hoje = dayjs();
    const inicio = dayjs('1984-10-28');
    const newData = dayjs(data);

    if (!newData.isValid()) {
      throw new BadRequestError({
        message: 'Formato de data inválida, utilize: AAAA-MM-DD',
        type: 'format_error',
        name: 'DATE_FORMAT_INCORRECT_PATTERN',
      });
    }

    if (newData.get('day') === 0 || newData.get('day') === 6) {
      throw new BadRequestError({
        message: 'Não existem cotações para os finais de semanas',
        type: 'weekend_error',
        name: 'NO_WEEKEND_PRICE',
      });
    }

    if (newData > hoje) {
      throw new BadRequestError({
        message: 'Datas futuras não são permitidas',
        type: 'future_date_error',
        name: 'NO_FUTURE_DATE',
      });
    }

    if (newData < inicio) {
      throw new BadRequestError({
        message: 'Dados a partir do dia 1984-11-28',
        type: 'data_avaliable_error',
        name: 'NO_DATA_AVALIABLE',
      });
    }

    const { infoMoedas } = await getMoedas();
    const moedas = infoMoedas.value.map((currency) => currency.simbolo);

    if (!moedas.includes(moeda)) {
      throw new BadRequestError({
        message: `Tipo de moeda inválida, os tipos disponíveis são: ${moedas}`,
        type: 'currency_error',
        name: 'INVALID_CURRENCY_VALUE',
      });
    }

    const consultaData = formatDate(newData, 'MM-DD-YYYY');
    const dataRetorno = formatDate(newData, 'YYYY-MM-DD');

    const { info } = await getCambio(consultaData, moeda);

    const tamanhoArray = info.value.length;

    return response.status(200).json({
      price: {
        isoCode: 'BRL',
        symbol: 'R$',
        value: info.value[tamanhoArray - 1].cotacaoVenda,
      },
      currency: moeda,
      date: dataRetorno,
    });
  } catch (error) {
    if (error instanceof BaseError) {
      throw error;
    }

    throw new InternalError({
      message: 'Erro ao buscar cambio',
      type: 'cambio_error',
      name: 'CAMBIO_ERROR',
    });
  }
};

export default app().get(Action);
