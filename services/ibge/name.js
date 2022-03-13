import axios from 'axios';
import BadRequestError from '@/errors/BadRequestError';
import NotFoundError from '@/errors/NotFoundError';

function isValidGender(_gender) {
  const gender = _gender.toLowerCase();
  if (gender === 'm' || gender === 'f') return true;

  return false;
}

async function getFrequencyByName(name, gender, groupBy, locality) {
  if (!name)
    throw new BadRequestError({
      status: 400,
      message: 'O parametro "nome" não foi fornecido.',
      type: 'name.required',
    });

  const url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/${name}`;

  const { data: response } = await axios.get(url, {
    params: {
      sexo: gender,
      groupBy,
      localidade: locality,
    },
  });

  if (response.length > 1) {
    return response;
  }

  if (response[0] === undefined) {
    throw new NotFoundError({
      status: 404,
      message: 'Nome não encontrado.',
    });
  }
  return response[0];
}

async function getRanking(decade, gender, locality) {
  const url = `https://servicodados.ibge.gov.br/api/v2/censos/nomes/ranking`;

  if (decade) {
    // eslint-disable-next-line radix
    const numberDecade = parseInt(decade);

    if (Number.isNaN(numberDecade))
      throw new BadRequestError({
        status: 400,
        message: 'O parametro "decada" tem que ser do tipo "number".',
        type: 'decade.mustbe.number',
      });

    if (numberDecade < 1930) {
      throw new BadRequestError({
        status: 400,
        message: 'O parametro "decada" tem que ser maior que 1930.',
        type: 'decade.mustbe.number',
      });
    }

    if (numberDecade % 10 !== 0) {
      throw new BadRequestError({
        status: 400,
        message: 'O parametro "decada" tem que ser multiplo de 10.',
        type: 'decade.mustbe.multiple',
      });
    }
  }

  if (gender) {
    if (isValidGender())
      throw new BadRequestError({
        status: 400,
        message: 'O parametro "sexo" tem que ser "f" ou "m".',
        type: 'sexo.invalid',
      });
  }

  const { data: response } = await axios.get(url, {
    params: {
      decada: decade,
      sexo: gender,
      localidade: locality,
    },
  });

  if (response.length > 1) {
    return response;
  }

  return response[0];
}

export { getFrequencyByName, getRanking };
