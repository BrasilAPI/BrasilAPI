import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getCambio } from '@/services/cambio/getCambio';
import dayjs from 'dayjs';
import { formatDate } from '@/services/date';
import { getMoedas } from '@/services/cambio/getMoedas';

const DATA_PATTERN = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;

const Action = async (request, response) => {
  const { data, moeda } = request.query;
  const { infoMoedas, statusMoedas } = await getMoedas();

  try {
    const moedas = [];
    const hoje = dayjs();
    const inicio = dayjs('1984-10-28');
    const newData = dayjs()
      .set('year', data.substring(0, 4))
      .set('month', parseInt(data.substring(5, 7), 10) - 1)
      .set('date', data.substring(8, 10));

    if (statusMoedas === 200) {
      infoMoedas.value.map((currency) => {
        moedas.push(currency.simbolo);
        return true;
      });
    } else {
      throw new BadRequestError({
        message: 'Serviço indisponível',
        type: 'service_error',
        name: 'SERVICE_NOT_AVALIABLE',
      });
    }

    if (!moedas.includes(moeda)) {
      throw new BadRequestError({
        message: `Tipo de moeda inválida, os tipos disponíveis são: ${moedas}`,
        type: 'currency_error',
        name: 'INVALID_CURRENCY_VALUE',
      });
    }

    if (newData.get('day') === 0 || newData.get('day') === 6) {
      throw new BadRequestError({
        message: 'Não existem cotações para os finais de semanas',
        type: 'weekend_error',
        name: 'NO_WEEKEND_PRICE',
      });
    }

    if (data.length !== 10) {
      throw new BadRequestError({
        message: 'Formato de data inválida, utilize: AAAA-MM-DD',
        type: 'format_error',
        name: 'DATE_FORMAT_INCORRECT',
      });
    }

    if (!data.match(DATA_PATTERN)) {
      throw new BadRequestError({
        message: 'Formato de data inválida, utilize: AAAA-MM-DD',
        type: 'format_error',
        name: 'DATE_FORMAT_INCORRECT_PATTERN',
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

    const consultaData = formatDate(newData, 'MM-DD-YYYY');
    const dataRetorno = formatDate(newData, 'YYYY-MM-DD');

    const { info, status } = await getCambio(consultaData, moeda);

    if (status !== 200) {
      throw new BadRequestError({
        message: 'Requisição inválida',
        type: 'invalid_request',
        name: 'INVALID_REQUEST',
      });
    }

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
    throw new BadRequestError({
      message: error.message,
      type: error.type,
      name: error.name,
    });
  }
};

export default app().get(Action);
