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
        searchByDescription(ncm.Descricao, search) ||
        searchByCode(ncm.Codigo, search)
      );
    });
  }

  response.status(200);
  response.json(ncmData);
};

export default app().get(action);
