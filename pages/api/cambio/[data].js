import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';

const Action = async (request, response) => {
  const { data } = request.query;

  try {
    const hoje = new Date();
    const inicio = new Date(1984, 11, 28);
    const newData = new Date(
      data.substring(6, 10),
      parseInt(data.substring(3, 5), 10) - 1,
      data.substring(0, 2)
    );

    if (newData > hoje || newData < inicio) {
      return response.status(400).json({ message: 'Data inválida' });
    }
  } catch (error) {
    throw new BadRequestError({ message: 'Requisição inválida' });
  }

  try {
    // const consultaData = `${data.substring(3, 5)}-${data.substring(
    //   0,
    //   2
    // )}-${data.substring(6, 10)}`;

    // const resp = await getCambio(consultaData);
    // return response
    //   .status(200)
    //   .json({ cotacao: resp.data.value[0].cotacaoCompra });
    return response.status(200).json({ teste: 'teste' });
  } catch (error) {
    throw new BadRequestError({ message: 'Problema ao realizar a requisição' });
  }
};

export default app(21600).get(Action);
