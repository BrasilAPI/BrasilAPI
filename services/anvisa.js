const { Agent } = require('https');

const fetchFromAnvisa = async (url) => {
  const response = await fetch(url, {
    headers: {
      Authorization: 'Guest',
    },
    referrer: 'https://consultas.anvisa.gov.br',
    agent: new Agent({
      rejectUnauthorized: false,
    }),
  });
  return response;
};

export const getProtocolAnvisa = async (record) => {
  return fetchFromAnvisa(
    `https://consultas.anvisa.gov.br/api/consulta/saude?filter%5BnumeroRegistro%5D=${record}`
  );
};

export const getAnvisa = async (protocol) => {
  return fetchFromAnvisa(
    `https://consultas.anvisa.gov.br/api/consulta/saude/${protocol}`
  );
};
