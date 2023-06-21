import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getCambio } from '@/services/cambio/getCambio';

const Action = async (request, response) => {
  const { data, moeda } = request.query;

  try {
    const hoje = new Date();
    const inicio = new Date(1984, 10, 28);
    const newData = new Date(
      data.substring(6, 10),
      parseInt(data.substring(3, 5), 10) - 1,
      data.substring(0, 2)
    );

    if (newData.getDay() === 0 || newData.getDay() === 6) {
      return response
        .status(400)
        .json({ message: 'Não existem cotações para os finais de semanas' });
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
