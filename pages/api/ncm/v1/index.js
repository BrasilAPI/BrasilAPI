import app from '@/app';
import { getNcmData } from '@/services/sefaz';

const searchByDescription = (input, search) => {
  return String(input).toLowerCase().includes(search.toLowerCase());
};

const searchByCode = (input, search) => {
  return input.replace(/\D/g, '').startsWith(search.replace(/[,.]/, ''));
};

const action = async (request, response) => {
  let ncmData = await getNcmData();

  if (request.query.search) {
    const { search } = request.query;

    ncmData = ncmData.filter((ncm) => {
      return (
        searchByDescription(ncm.descricao, search) ||
        searchByCode(ncm.codigo, search)
      );
    });

    if (!ncmData) {
      response.status(404);
      response.json({
        message: 'Código NCM não encontrado',
        type: 'NCM_CODE_NOT_FOUND',
      });
      return;
    }
  }

  response.status(200);
  response.json(ncmData);
};

export default app().get(action);
