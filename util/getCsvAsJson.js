import httpClient from '@/lib/http/client';
import Papa from 'papaparse';

export default async function getCsvAsJson(url) {
  const body = await httpClient.get(url, {
    responseType: 'text',
  });

  return Papa.parse(body.data).data;
}
