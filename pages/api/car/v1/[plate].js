import microCors from 'micro-cors';
import sinespApi from 'sinesp-api';

const CACHE_CONTROL_HEADER_VALUE =
  'max-age=0, s-maxage=86400, stale-while-revalidate, public';

const cors = microCors();

// Esta função nos ajuda em tratar os códigos referentes à situação do veículo.
// Até então, sabemos que 0 é situação regular e 1 é roubado/furtado.
export function getSituation(code) {
  if (code === '0') {
    return 'Veículo sem restrições.';
  }

  if (code === '1') {
    return 'Veículo roubado ou furtado.';
  }

  return code;
}

// Esta função nos ajuda a melhorar a normalização de dados vindas do Sinesp.
// Como já mapeamos alguns comportamentos, podemos tratar alguns casos.
export function formatBrandModel(brand, model) {
  // caso os campos de marca e modelo sejam iguais
  if (brand === model) {
    // se possui prefixo I/
    if (model.match(new RegExp('^(I/)'))) {
      const removedPrefix = model.replace(new RegExp('^(I/)'), '').split(' ');

      return {
        brand: removedPrefix[0],
        model: removedPrefix.slice(1).join(' '),
      };
    }

    // se possui prefixo IMP/
    if (model.match(new RegExp('^(IMP/)'))) {
      const removedPrefix = model.replace(new RegExp('^(IMP/)'), '').split(' ');

      return {
        brand: removedPrefix[0],
        model: removedPrefix.slice(1).join(' '),
      };
    }

    // se possui pelo menos uma barra, pois sabemos que neste caso a palavra a esquerda da barra é a marca.
    if (model.includes('/')) {
      const [brandName, modelName] = model.split('/');

      return {
        brand: brandName,
        model: modelName,
      };
    }
  } else {
    // caso os campos de modelo e marca sejam diferentes.
    if (brand === 'T') {
      const splittedModel = model.split(' ');

      return {
        brand: splittedModel[0],
        model: splittedModel.slice(1).join(' '),
      };
    }

    return {
      brand,
      model,
    };
  }
}

// retorna informações de um veículo pela placa.

// exemplos da rota:
// - /api/car/v1/AAA9999 (para placas anteriores ao padrão Mercosul).
// - /api/car/v1/AAA9A99 (para placas do padrão Mercosul).
// em que A são letras e 9 são números.

async function Car(request, response) {
  const carPlate = request.query.plate;

  response.setHeader('Cache-Control', CACHE_CONTROL_HEADER_VALUE);

  try {
    const vehicle = await sinespApi.search(carPlate);

    const {
      anoModelo,
      chassi,
      cor,
      marca,
      modelo,
      municipio,
      uf,
      placa,
      data,
      codigoSituacao,
    } = vehicle;

    const { brand, model } = formatBrandModel(marca, modelo);

    const responsePayload = {
      year: anoModelo,
      chassis: chassi,
      color: cor,
      brand,
      model,
      city: municipio,
      state: uf,
      plate: placa,
      lastCharacteristicsUpdate: data,
      situation: {
        code: Number(codigoSituacao),
        description: getSituation(codigoSituacao),
      },
    };

    response.status(200);
    response.json(responsePayload);
  } catch (error) {
    response.status(500);
    response.json({ error: error.message });
  }
}

export default cors(Car);
