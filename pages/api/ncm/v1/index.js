import app from '@/app';
import { getNcmData } from '@/services/sefaz';

const searchByDescription = (input, search) => {
  return String(input).toLowerCase().includes(search.toLowerCase());
};

const searchByCode = (input, search) => {
  return input.replace(/\D/g, '').startsWith(search.replace(/[,.]/, ''));
};

async function getAllNcmData(request, response) {
  let ncmData = await getNcmData();

  if (request.query.search) {
    const { search } = request.query;

    ncmData = ncmData.filter((ncm) => {
      return (
        searchByDescription(ncm.descricao, search) ||
        searchByCode(ncm.codigo, search)
      );
    });

    // For search queries, return empty array if no results (preserving original behavior)
    if (!ncmData || ncmData.length === 0) {
      return response.status(200).json([]);
    }
  }

  return response.status(200).json(ncmData);
}

export default app().get(getAllNcmData);
