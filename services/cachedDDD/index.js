import axios from 'axios';
import { existsSync } from 'fs';
import { readFile, rm, writeFile } from 'fs/promises';
import path from 'path';
import fallbackddd from './fallbackddd.json';

export const getDddsData = async () => {
  // O endpoint vive dando erro e timeout, então para garantir a resposta,
  // salva o ultimo arquivo com sucesso
  const today = new Date();
  const todayFile = path.resolve(
    'data',
    `ddd_${today.getDate()}_${today.getMonth()}_${today.getFullYear()}.csv`
  );

  if (!existsSync(todayFile)) {
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const yesterdayFile = path.resolve(
      'data',
      `ddd_${yesterday.getDate()}_${yesterday.getMonth()}_${yesterday.getFullYear()}.csv`
    );
    if (existsSync(yesterdayFile)) {
      await rm(yesterdayFile);
    }
  }

  if (!existsSync(todayFile)) {
    try {
      const url =
        'https://www.anatel.gov.br/dadosabertos/PDA/Codigo_Nacional/PGCN.csv';

      const { data: reponseData } = await axios({
        url,
        method: 'get',
        responseEncoding: 'binary',
      });

      const body = reponseData.toString('binary');

      await writeFile(todayFile, body);
      // eslint-disable-next-line no-empty
    } catch (err) {
      return fallbackddd;
    }
  }

  const LINE_BREAK = '\r\n';

  const dddData = await readFile(todayFile, 'utf-8');

  const lines = dddData.split(LINE_BREAK);

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
