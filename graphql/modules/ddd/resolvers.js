import { ApolloError } from 'apollo-server-micro';
import { getDddsData } from '@/services/ddd';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    citiesOfDdd: async (_parent, _args, _context) => {
      if (_args.ddd.length !== 2) {
        throw new ApolloError('DDD inválido', 'validation_error');
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const allDddData = await getDddsData();
        const dddData = allDddData.filter(({ ddd }) => ddd === _args.ddd);
        if (dddData.length === 0) {
          throw new ApolloError('DDD não encontrado', 'validation_error');
        }
        const { state } = dddData[0];

        const cities = dddData
          .map((ddd) => ddd.city)
          .sort((c1, c2) => c1.localeCompare(c2));

        const dddResult = {
          state,
          cities,
        };
        return dddResult;
      } catch (err) {
        throw new ApolloError('Erro ao consultar DDD', err.type, err.errors);
      }
    },
  },
};
