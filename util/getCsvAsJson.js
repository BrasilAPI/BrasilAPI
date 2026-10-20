import axios from 'axios';
import Papa from 'papaparse';

export default async function getCsvAsJson(url) {
  const body = await axios.get(url, {
    responseType: 'blob',
  });

  return Papa.parse(body.data).data;
}
