import axios from 'axios';

import { FIPE_URL, VEHICLE_TYPE } from './constants';

function resolveVehicleType(vehicleType) {
  const vehicleTypeMap = {
    1: 'carro',
    2: 'moto',
    3: 'caminhao',
  };

  return vehicleTypeMap[vehicleType] || '';
}

async function getPrice({
  referenceTable,
  vehicleType,
  makerCode,
  modelCode,
  yearCode,
}) {
  const [yearModel, fuelType] = yearCode.split('-');
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('codigoMarca', makerCode);
  params.append('codigoModelo', modelCode);
  params.append('anoModelo', yearModel);
  params.append('codigoTipoCombustivel', fuelType);
  params.append('tipoVeiculo', resolveVehicleType(vehicleType));
  params.append('modeloCodigoExterno', '');
  params.append('tipoConsulta', 'tradicional');

  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarValorComTodosParametros`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  if (data.erro) {
    throw new Error('Parâmetros inválidos');
  }

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

export async function getCarPriceByModelAndYear(
  makerCode,
  modelCode,
  yearCode,
  referenceTableCode
) {
  return getPrice({
    vehicleType: VEHICLE_TYPE.CAR,
    referenceTable: referenceTableCode,
    makerCode,
    modelCode,
    yearCode,
  });
}

export async function getMotorcyclePriceByModelAndYear(
  makerCode,
  modelCode,
  yearCode,
  referenceTableCode
) {
  return getPrice({
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
    referenceTable: referenceTableCode,
    makerCode,
    modelCode,
    yearCode,
  });
}

export async function getTruckPriceByModelAndYear(
  makerCode,
  modelCode,
  yearCode,
  referenceTableCode
) {
  return getPrice({
    vehicleType: VEHICLE_TYPE.TRUCK,
    referenceTable: referenceTableCode,
    makerCode,
    modelCode,
    yearCode,
  });
}
