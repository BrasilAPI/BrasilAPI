import { getUfByCode, getUfs } from '@/services/ibge/gov';
import { ApolloError } from 'apollo-server-micro';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    getAllUFs: async (_parent, _args, _context) => {
      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const { data } = await getUfs();

        return data;
      } catch (err) {
        throw new ApolloError('Erro ao consultar UFs', err.type, err.errors);
      }
    },

    ibgeDataByUF: async (_parent, _args, _context) => {
      if (!_args.uf || _args.uf.length !== 2) {
        throw new ApolloError('UF inválido', 'validation_error');
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const { data } = await getUfByCode(_args.uf);

        if (Array.isArray(data) && !data.length) {
          throw new ApolloError('UF não encontrado', 'validation_error');
        }

        return data;
      } catch (err) {
        throw new ApolloError('Erro ao consultar UF', err.type, err.errors);
      }
    },
  },
};
