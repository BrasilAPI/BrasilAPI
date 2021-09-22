import { getDddsData } from '@/services/cachedDDD';
import { ApolloError } from 'apollo-server-micro';

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
        let allDddData;
        try {
          allDddData = await getDddsData();
        } catch (err) {
          throw new ApolloError(
            'Todos os serviços de DDD retornaram erro',
            'service_error'
          );
        }
        const dddData = allDddData.filter(
          ({ ddd }) => Number(ddd) === Number(_args.ddd)
        );
        console.log(dddData);
        if (dddData.length === 0) {
          throw new ApolloError('DDD não encontrado', 'validation_error');
        }
        const { state } = dddData[0];

        let cities = dddData.map((ddd) => ddd.city);

        if (_args.sort) {
          cities = cities.sort((c1, c2) =>
            _args.sort === 'asc' ? c1.localeCompare(c2) : c2.localeCompare(c1)
          );
        }

        const dddResult = {
          state,
          cities,
        };
        return dddResult;
      } catch (err) {
        throw new ApolloError(
          err.message ? err.message : 'Erro ao consultar DDD',
          err.type,
          err.errors
        );
      }
    },
  },
};
