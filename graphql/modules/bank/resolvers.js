import { ApolloError } from 'apollo-server-micro';
import { getBanksData } from '../../../services/banco-central';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

export default {
  Query: {
    bank: async (_parent, _args, _context) => {
      if (_args.code?.length < 1000 && !!_args.ispb) {
        throw new ApolloError('Código do banco é inválido', 'validation_error');
      }

      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

        const bankCode = _args.code || '';
        const bankIspb = _args.ispb || '';
        const allBanksData = await getBanksData();
        const bankData = allBanksData.find(({ code, ispb }) => code === bankCode || ispb === bankIspb);
        if(!bankData){
          return new ApolloError('Banco não encontrado');
        }

        return bankData;
      } catch (err) {
        throw new ApolloError('Erro ao consultar Banco', err.type, err.errors);
      }
    },
  },
};
