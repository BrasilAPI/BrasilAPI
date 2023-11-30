const https = require('https');
const axios = require('axios');
import { parse } from 'node-html-parser';

let cacheAgent;

function getAgent() {
  if (!cacheAgent) {
    cacheAgent = new https.Agent({ keepAlive: true });
  }

  return cacheAgent;
}

export async function getTeamsBySeries(series) {
  const agent = getAgent();
  try {
    const response = await axios.get(`https://ge.globo.com/futebol/brasileirao-serie-${series}/`).then(res => res.data);

    console.log(response);

    const teams = [];
    root.querySelectorAll(".classificacao__pontos-corridos .tabela__equipes tbody tr .classificacao__equipes--nome").forEach(element => {
      teams.push(element.text.trim());
    });

    return response;
  } catch (error) {
    console.error('Erro ao obter times: ', error);
    throw error;
  }
}
