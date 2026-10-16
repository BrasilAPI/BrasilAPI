import app from '@/app';
import BadRequestError from '@/errors/BadRequestError';
import { getBanksData } from '@/services/banco-central';

const MAX_SEARCH_LENGTH = 100;

const normalize = (text) =>
  String(text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

const parseSearch = (search) => {
  const term = typeof search === 'string' ? normalize(search) : '';

  if (!term || term.length > MAX_SEARCH_LENGTH) {
    throw new BadRequestError({
      message: `O parâmetro search deve ser um texto entre 1 e ${MAX_SEARCH_LENGTH} caracteres`,
      type: 'BANK_SEARCH_INVALID',
    });
  }

  return term;
};

const matchesSearch = (bank, term) => {
  if (/^\d+$/.test(term)) {
    return bank.code === Number(term) || String(bank.ispb).includes(term);
  }

  return (
    normalize(bank.name).includes(term) ||
    normalize(bank.fullName).includes(term)
  );
};

const action = async (request, response) => {
  const { search } = request.query;
  const term = search === undefined ? null : parseSearch(search);

  const allBanksData = await getBanksData();

  if (term === null) {
    return response.status(200).json(allBanksData);
  }

  return response
    .status(200)
    .json(allBanksData.filter((bank) => matchesSearch(bank, term)));
};

export default app().get(action);
