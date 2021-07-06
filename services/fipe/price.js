import axios from 'axios';

import { FIPE_URL, VEHICLE_TYPE } from './constants';
import { getLatestReferenceTable } from './referenceTable';

async function getModelYear({ fipeCode, referenceTable }) {
  const vehicleTypes = [
    VEHICLE_TYPE.CAR,
    VEHICLE_TYPE.MOTORCYCLE,
    VEHICLE_TYPE.TRUCK,
  ];

  const result = (
    await Promise.all(
      vehicleTypes.map(async (vehicleType) => {
        const params = new URLSearchParams();
        params.append('codigoTabelaReferencia', referenceTable);
        params.append('codigoTipoVeiculo', vehicleType);
        params.append('modeloCodigoExterno', fipeCode);

        const { data } = await axios.post(
          `${FIPE_URL}/veiculos/ConsultarAnoModeloPeloCodigoFipe`,
          params,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );

        if (!Array.isArray(data)) {
          return undefined;
        }

        return {
          vehicleType,
          models: data.map((item) => ({
            rotulo: item.Label,
            valor: item.Value,
          })),
        };
      })
    )
  ).filter(Boolean);

  if (result.length === 0) {
    throw new Error('Código fipe inválido');
  }

  return result[0];
}

function resolveVehicleType(vehicleType) {
  switch (vehicleType) {
    case '1':
      return 'carro';
    case '2':
      return 'moto';
    case '3':
      return 'caminhao';
    default:
      return '';
  }
}

async function getPrice({ referenceTable, vehicleType, model, fipeCode }) {
  const [yearModel, fuelType] = model.valor.split('-');
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('anoModelo', yearModel);
  params.append('codigoTipoCombustivel', fuelType);
  params.append('tipoVeiculo', resolveVehicleType(vehicleType));
  params.append('modeloCodigoExterno', fipeCode);
  params.append('tipoConsulta', 'codigo');

  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarValorComTodosParametros`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return {
    valor: data.Valor,
    marca: data.Marca,
    modelo: data.Modelo,
    anoModelo: data.AnoModelo,
    combustivel: data.Combustivel,
    codigoFipe: data.CodigoFipe,
    mesReferencia: data.MesReferencia,
    tipoVeiculo: data.TipoVeiculo,
    siglaCombustivel: data.SiglaCombustivel,
    dataConsulta: data.DataConsulta,
  };
}

export async function getFipePrice(
  { referenceTable, fipeCode } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  const { vehicleType, models } = await getModelYear({
    referenceTable: referenceTableCode,
    fipeCode,
  });

  return Promise.all(
    models.map((model) => {
      return getPrice({
        referenceTable: referenceTableCode,
        vehicleType,
        model,
        fipeCode,
      });
    })
  );
}
