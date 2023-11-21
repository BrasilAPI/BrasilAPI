import { getBanksData } from '@/services/banco-central';
import { ApolloError } from 'apollo-server-micro';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    allBanks: async (_parent, _args, _context) => {
      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const allBanksData = await getBanksData();

        return allBanksData.map((bank) => {
          if (Number.isNaN(bank.code)) {
            return { ...bank, code: null };
          }
          return bank;
        });
      } catch (err) {
        throw new ApolloError('Erro ao consultar Bancos', err.type, err.errors);
      }
    },

    bank: async (_parent, _args, _context) => {
      if (!_args.code) {
        throw new ApolloError(
          'Código bancário não encontrado',
          'validation_error'
        );
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const allBanksData = await getBanksData();

        const bankData = allBanksData.find(({ code }) => code === _args.code);

        if (!bankData) {
          throw new ApolloError(
            'Código bancário não encontrado',
            'validation_error'
          );
        }

        return bankData;
      } catch (err) {
        throw new ApolloError('Erro ao consultar Bancos', err.type, err.errors);
      }
    },
  },
};
