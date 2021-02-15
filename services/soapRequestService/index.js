import { Parser } from 'xml2js';
import axios from 'axios';

function mountSearchParams(obj) {
  return Object.getOwnPropertyNames(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join('&');
}

function parseResponse(xml) {
  return new Promise((resolve, reject) => {
    const xmlParser = new Parser();
    xmlParser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

export default async function makeRequest(url, method, obj) {
  const data = mountSearchParams(obj);
  const options = {
    url,
    method,
    data,
  };

  const response = await axios(options);
  return parseResponse(response.data);
}
