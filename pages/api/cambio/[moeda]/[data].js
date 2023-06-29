import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getCambio } from '@/services/cambio/getCambio';
import dayjs from 'dayjs';

const Action = async (request, response) => {
  const { data, moeda } = request.query;

  try {
    const hoje = dayjs();
    const inicio = dayjs('1984-10-28');
    const newData = dayjs()
      .set('year', data.substring(6, 10))
      .set('month', parseInt(data.substring(3, 5), 10) - 1)
      .set('date', data.substring(0, 2));

    if (newData.get('day') === 0 || newData.get('day') === 6) {
      throw new BadRequestError({
        message: 'Não existem cotações para os finais de semanas',
        type: 'weekend_error',
        name: 'NO_WEEKEND_PRICE',
      });
    }

    if (data.length !== 10) {
      return response
        .status(400)
        .json({ message: 'Formato de data inválida, utilize: DD-MM-AAAA' });
    }

    if (newData > hoje) {
      return response
        .status(400)
        .json({ message: 'Datas futuras não são permitidas' });
    }

    if (newData < inicio) {
      return response
        .status(400)
        .json({ message: 'Dados a partir do dia 28-11-1984' });
    }
  } catch (error) {
    throw new BadRequestError({ message: 'Requisição inválida' });
  }

  try {
    const consultaData = `${data.substring(3, 5)}-${data.substring(
      0,
      2
    )}-${data.substring(6, 10)}`;

    const dataRetorno = `${data.substring(0, 2)}-${data.substring(
      3,
      5
    )}-${data.substring(6, 10)}`;

    const resp = await getCambio(consultaData, moeda);
    const tamanhoArray = resp.data.value.length;

    return response.status(200).json({
      cotacao: resp.data.value[tamanhoArray - 1].cotacaoVenda,
      moeda,
      data: dataRetorno,
    });
  } catch (error) {
    throw new BadRequestError({ message: 'Problema ao realizar a requisição' });
  }
};

export default app(21600).get(Action);
