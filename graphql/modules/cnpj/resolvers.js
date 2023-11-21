import { getCnpjData } from '@/services/cnpj';
import { ApolloError } from 'apollo-server-micro';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    cnpjData: async (_parent, _args, _context) => {
      if (!_args.cnpj) {
        throw new ApolloError('CNPJ inválido', 'validation_error');
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const { data } = await getCnpjData(_args.cnpj);

        return data;
      } catch (err) {
        throw new ApolloError('Erro ao consultar CNPJ', err.type, err.errors);
      }
    },
  },
};
