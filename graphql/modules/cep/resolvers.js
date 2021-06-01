import { ApolloError } from 'apollo-server-micro';
import cep from 'cep-promise';

export default {
  Query: {
    cep: async (_parent, _args) => {
      if (_args.cep.length !== 8) {
        throw new ApolloError('CEP inválido', 'validation_error');
      }

      try {
        const cepResult = await cep(_args.cep);
        return cepResult;
      } catch (err) {
        throw new ApolloError('Erro ao consultar CEP', err.type, err.errors);
      }
    },
  },
};
