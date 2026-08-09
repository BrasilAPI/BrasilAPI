import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.universities.com.br'
});

export const getUniversities = async () => {
  const endpoint = '/universities';

  const { data: body } = await axiosInstance.get(endpoint);

  return body.map(filterUniversitiesResponse);
}

export const getUniversitiesById = async id => {
  const endpoint = `/universities/${id}`;

  const { data: body } = await axiosInstance.get(endpoint);

  const data = filterUniversitiesResponse(body);

  if (JSON.stringify(data) === "{}" || !data) {
    return null;
  }

  return data;
}

const filterUniversitiesResponse = university => {
  const {
    id,
    full_name,
    name,
    ibge,
    city,
    uf,
    zipcode,
    street,
    number,
    neighborhood,
    phone
  } = university

  return {
    id,
    full_name,
    name,
    ibge,
    city,
    uf,
    zipcode,
    street,
    number,
    neighborhood,
    phone
  }
}