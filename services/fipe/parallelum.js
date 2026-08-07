import axios from 'axios';

const PARALLELUM_URL = 'https://parallelum.com.br/fipe/api/v1';

const TYPE_MAP = {
  1: 'carros',
  2: 'motos',
  3: 'caminhoes',
};

// Fallback para quando o veiculos.fipe.org.br bloqueia os IPs da Vercel.
// O parallelum espelha a mesma base de dados (dados abertos FIPE) e não
// tem WAF anti-datacenter. Retorna no mesmo formato do upstream oficial.
export async function parallelumListMarcas(vehicleType) {
  const { data } = await axios.get(
    `${PARALLELUM_URL}/${TYPE_MAP[vehicleType]}/marcas`
  );

  return data.map((item) => ({ Label: item.nome, Value: item.codigo }));
}

export async function parallelumListModelos(vehicleType, makerCode) {
  const { data } = await axios.get(
    `${PARALLELUM_URL}/${TYPE_MAP[vehicleType]}/marcas/${makerCode}/modelos`
  );

  return {
    Modelos: data.modelos.map((item) => ({
      Label: item.nome,
      Value: String(item.codigo),
    })),
  };
}
