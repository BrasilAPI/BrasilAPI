import axios from 'axios';

export async function get(url) {
  const response = await axios.get(url);
  const { data, status } = response;

  if (status !== 200) {
    throw data;
  }

  return data;
}
