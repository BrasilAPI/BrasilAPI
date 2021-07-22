import {
  listCarAutomakers,
  listMotorcycleAutomakers,
  listTruckAutomakers,
} from '@/services/fipe/automakers';
import { getFipePrice } from '@/services/fipe/price';
import { listReferenceTables } from '@/services/fipe/referenceTable';
import { ApolloError } from 'apollo-server-micro';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

const VEHICLE_TYPES = {
  caminhoes: listTruckAutomakers,
  carros: listCarAutomakers,
  motos: listMotorcycleAutomakers,
};

const checkReferenceTable = async (referenceTableCode) => {
  const referenceTables = await listReferenceTables();

  const hasReferenceTable = !!referenceTables.find(
    (table) => table.codigo === referenceTableCode
  );

  if (!hasReferenceTable) {
    throw new ApolloError('Tabela de referência inválida', 'validation_error');
  }
};

export default {
  Query: {
    vehicleBrands: async (_parent, _args, _context) => {
      if (!Object.keys(VEHICLE_TYPES).includes(_args.vehicleType)) {
        throw new ApolloError('Tipo do veiculo inválido', 'validation_error');
      }
      if (_args.referenceTableCode) {
        await checkReferenceTable(_args.referenceTableCode);
      }
      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

        const listAutomakers = VEHICLE_TYPES[_args.vehicleType];

        return await listAutomakers({
          referenceTable: _args.referenceTableCode,
        });
      } catch (err) {
        throw new ApolloError('Erro ao consultar marcas', err.type, err.errors);
      }
    },

    vehicleData: async (_parent, _args, _context) => {
      if (!_args.code) {
        throw new ApolloError('Código do veiculo inválido', 'validation_error');
      }
      if (_args.referenceTableCode) {
        await checkReferenceTable(_args.referenceTableCode);
      }
      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

        return await getFipePrice({
          referenceTable: _args.referenceTableCode,
          fipeCode: _args.code,
        });
      } catch (err) {
        throw new ApolloError(
          'Erro ao consultar Dados do veiculo',
          err.type,
          err.errors
        );
      }
    },

    fipeReferenceTables: async (_parent, _args, _context) => {
      try {
        _context.res.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

        return await listReferenceTables();
      } catch (err) {
        throw new ApolloError(
          'Erro ao consultar tabelas de referência',
          err.type,
          err.errors
        );
      }
    },
  },
};
