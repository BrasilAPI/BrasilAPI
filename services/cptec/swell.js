import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

import normalizeBrazilianDate from '@/util/normalizeBrazilianDate';
import { CPTEC_URL, WIND_SWELL_DIRECTIONS } from './constants';

const parser = new XMLParser();

export const getSwellData = async (cityCode, days) => {
  const url = `${CPTEC_URL}/cidade/${cityCode}/todos/tempos/ondas.xml`;

  try {
    const swellData = await axios.get(url, {
      responseType: 'application/xml',
      responseEncoding: 'binary',
    });

    const jsonData = parser.parse(swellData.data);
    const newSwellArr = {
      cidade: jsonData.cidade.nome,
      estado: jsonData.cidade.uf,
      atualizado_em: jsonData.cidade.atualizacao,
      ondas: [],
    };

    // group data by day
    let oldDate = '';

    let newItem = {};

    newSwellArr.ondas = [];

    jsonData.cidade.previsao.forEach((oneDay) => {
      const datePart = oneDay.dia.split(' ');
      const [date, hour, tz] = datePart;

      if (date !== oldDate) {
        [oldDate] = datePart;

        newItem = {};
        [newItem.data] = normalizeBrazilianDate(oldDate, '-', false)
          .toISOString()
          .split('T');
        newItem.dados_ondas = [];
        newSwellArr.ondas.push(newItem);
      }

      newItem.dados_ondas.push({
        hora: `${hour.replace('h', ':')}00${tz}`,
        vento: oneDay.vento,
        direcao_vento: oneDay.vento_dir,
        direcao_vento_desc: WIND_SWELL_DIRECTIONS[oneDay.vento_dir],
        altura_onda: oneDay.altura,
        direcao_onda: oneDay.direcao,
        direcao_onda_desc: WIND_SWELL_DIRECTIONS[oneDay.direcao],
        agitation: oneDay.agitacao,
      });

      return newItem;
    });

    // IF total data greater than requested number of days, slice array into correct size
    if (newSwellArr.ondas.length > days) {
      newSwellArr.ondas = newSwellArr.ondas.slice(0, days);
    }

    return newSwellArr;
  } catch (error) {
    // If city code don't have info about waves, remove service throw an exception
    return null;
  }
};
