import { ApolloError } from 'apollo-server-micro';
import { getBanksData } from '../../../services/banco-central';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    banks: async (_parent, _args, _context) => {
      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

        const allBanksData = await getBanksData();
        return allBanksData;
      } catch (err) {
        throw new ApolloError('Erro ao consultar Banco', err.type, err.errors);
      }
    },
  },
};
