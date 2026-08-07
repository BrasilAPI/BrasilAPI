import { fipePost } from './http';
import { parallelumPreco } from './parallelum';
import { VEHICLE_TYPE } from './constants';
import { getLatestReferenceTable } from './referenceTable';

function resolveVehicleType(vehicleType) {
  const vehicleTypeMap = {
    [VEHICLE_TYPE.CAR]: 'carro',
    [VEHICLE_TYPE.MOTORCYCLE]: 'moto',
    [VEHICLE_TYPE.TRUCK]: 'caminhao',
  };

  return vehicleTypeMap[vehicleType] || '';
}

export async function getPriceByModelAndYear({
  vehicleType,
  makerCode,
  modelCode,
  yearCode,
  referenceTable,
}) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  const [yearModel, fuelType] = yearCode.split('-');

  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTableCode);
  params.append('codigoTipoVeiculo', vehicleType);
  params.append('codigoMarca', makerCode);
  params.append('codigoModelo', modelCode);
  params.append('anoModelo', yearModel);
  params.append('codigoTipoCombustivel', fuelType);
  params.append('tipoVeiculo', resolveVehicleType(vehicleType));
  params.append('tipoConsulta', 'tradicional');

  const { data } = await fipePost(
    '/veiculos/ConsultarValorComTodosParametros',
    params,
    () => parallelumPreco(vehicleType, makerCode, modelCode, yearCode)
  );

  if (data.erro || !data.Valor) {
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

export const getCarPriceByModelAndYear = (
  makerCode,
  modelCode,
  yearCode,
  referenceTable
) =>
  getPriceByModelAndYear({
    makerCode,
    modelCode,
    yearCode,
    referenceTable,
    vehicleType: VEHICLE_TYPE.CAR,
  });

export const getMotorcyclePriceByModelAndYear = (
  makerCode,
  modelCode,
  yearCode,
  referenceTable
) =>
  getPriceByModelAndYear({
    makerCode,
    modelCode,
    yearCode,
    referenceTable,
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
  });

export const getTruckPriceByModelAndYear = (
  makerCode,
  modelCode,
  yearCode,
  referenceTable
) =>
  getPriceByModelAndYear({
    makerCode,
    modelCode,
    yearCode,
    referenceTable,
    vehicleType: VEHICLE_TYPE.TRUCK,
  });
