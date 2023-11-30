const https = require('https');
const axios = require('axios');

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

export async function getTeamsBySeries(series) {
  const agent = getAgent();
  let url;

  // As URLs são referentes a arquivos JSON armazenados no drive, gerados frequentemente a partir de um script de scraping no site
  // https://ge.globo.com/futebol/brasileirao-serie-{serie}/, utilizando Python
  try {
    switch (series) {
      case 'a':
        url = 'https://drive.google.com/uc?export=download&id=1Xx325sVS3YJ3qV_UdQumAT6nXPlCpigP';
        break;
      case 'b':
        url = 'https://drive.google.com/uc?export=download&id=1WZLEFg9QavI1l0HshZ7PmM_wc-TIKzVx';
        break;

      default:
        url = 'https://drive.google.com/uc?export=download&id=1Xx325sVS3YJ3qV_UdQumAT6nXPlCpigP';
        break;
    }

    const response = await axios.get(url);
    const data = response.data;

    return data;
  } catch (error) {
    console.error('Erro ao obter times: ', error);
    throw error;
  }
}
