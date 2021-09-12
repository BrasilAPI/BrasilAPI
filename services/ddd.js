import axios from 'axios';

export const getDddsData = async () => {
  const url = process.env.ANATEL_URL;
  const LINE_BREAK = '\r\n';

  const { data: reponseData } = await axios({
    url,
    method: 'get',
    responseEncoding: 'binary',
  });

  const body = reponseData.toString('binary');

  const lines = body.split(LINE_BREAK);

  lines.shift();

  return lines
    .map((line) => line.split(';'))
    .map(([ibgeCode, state, city, ddd]) => {
      return {
        ibgeCode,
        state,
        city,
        ddd,
      };
    });
};
