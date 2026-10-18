import httpClient from '@/lib/http/client';

const BASE_URL = 'https://api.universities.com.br';

const filterUniversitiesResponse = (university) => {
  const {
    id,
    full_name: fullName,
    name,
    ibge,
    city,
    uf,
    zipcode,
    street,
    number,
    neighborhood,
    phone,
  } = university;

  return {
    id,
    full_name: fullName,
    name,
    ibge,
    city,
    uf,
    zipcode,
    street,
    number,
    neighborhood,
    phone,
  };
};

export const getUniversities = async () => {
  const endpoint = '/universities';

  const { data: body } = await httpClient.get(BASE_URL + endpoint);

  return body.map(filterUniversitiesResponse);
};

export const getUniversitiesById = async (id) => {
  const endpoint = `/universities/${id}`;

  const { data: body } = await httpClient.get(BASE_URL + endpoint);

  const data = filterUniversitiesResponse(body);

  if (JSON.stringify(data) === '{}' || !data) {
    return null;
  }

  return data;
};
