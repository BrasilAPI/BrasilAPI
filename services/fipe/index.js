import axios from 'axios';

const FIPE_URL = 'https://veiculos.fipe.org.br/api';

const VEHICLE_TYPE = {
  CAR: 1,
  MOTORCYCLE: 2,
  TRUCK: 3,
};

async function listAutomakers({ vehicleType, referenceTable }) {
  const params = new URLSearchParams();
  params.append('codigoTabelaReferencia', referenceTable);
  params.append('codigoTipoVeiculo', vehicleType);

  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarMarcas`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data
    .map((item) => ({ nome: item.Label, valor: item.Value }))
    .sort((a, b) => parseInt(a.valor, 10) - parseInt(b.valor, 10));
}

async function listReferenceTables() {
  const { data } = await axios.post(
    `${FIPE_URL}/veiculos/ConsultarTabelaDeReferencia`,
    {},
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return data
    .map((item) => ({ codigo: item.Codigo, mes: item.Mes }))
    .sort((a, b) => b.codigo - a.codigo);
}

async function getLatestReferenceTable() {
  const tables = await listReferenceTables();
  return tables[0].codigo;
}

export async function listCarAutomakers(
  { referenceTable } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.CAR,
    referenceTable: referenceTableCode,
  });
}

export async function listMotorcycleAutomakers(
  { referenceTable } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.MOTORCYCLE,
    referenceTable: referenceTableCode,
  });
}

export async function listTruckAutomakers(
  { referenceTable } = { referenceTable: undefined }
) {
  const referenceTableCode =
    referenceTable || (await getLatestReferenceTable());

  return listAutomakers({
    vehicleType: VEHICLE_TYPE.TRUCK,
    referenceTable: referenceTableCode,
  });
}
