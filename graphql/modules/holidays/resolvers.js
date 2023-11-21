import getHolidays from '@/services/holidays';
import { ApolloError } from 'apollo-server-micro';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    holidaysOnYear: async (_parent, _args, _context) => {
      if (_args.year.length !== 4 || _args.year < 1900) {
        throw new ApolloError('Ano inválido', 'validation_error');
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);
        const holidays = getHolidays(_args.year);
        return holidays;
      } catch (err) {
        throw new ApolloError(
          'Erro ao consultar feriados',
          err.type,
          err.errors
        );
      }
    },
  },
};
