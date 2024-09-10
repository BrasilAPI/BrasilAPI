/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

const URL = 'https://dadosabertos.camara.leg.br/api/v2/partidos';

export const getParties = async () => {
  try {
    const { data } = await axios.get(URL, {
      headers: {
        Accept: 'application/xml',
      },
    });

    const parser = new XMLParser();
    const jsonData = parser.parse(data);

    if (
      !jsonData ||
      !jsonData.xml ||
      !jsonData.xml.dados ||
      !jsonData.xml.dados.partido_
    ) {
      console.error(
        'Estrutura inesperada de dados ou dados ausentes:',
        jsonData
      );
      return [];
    }

    const partidos = jsonData.xml.dados.partido_.map((partido) => ({
      id: partido.id,
      sigla: partido.sigla,
      nome: partido.nome,
      uri: partido.uri,
    }));

    return partidos;
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return [];
  }
};

export const getParty = async (id) => {
  try {
    const { data } = await axios.get(`${URL}/${id}`, {
      headers: {
        Accept: 'application/xml',
      },
    });
    const parser = new XMLParser();
    const jsonData = parser.parse(data);
    if (!jsonData || !jsonData.xml || !jsonData.xml.dados) {
      console.error(
        'Estrutura inesperada de dados ou dados ausentes:',
        jsonData
      );
      return null;
    }

    const partido = jsonData.xml.dados;

    const partidoData = {
      id: partido.id,
      sigla: partido.sigla,
      nome: partido.nome,
      uri: partido.uri,
      status: {
        data: partido.status?.data,
        idLegislatura: partido.status?.idLegislatura,
        situacao: partido.status?.situacao,
        totalPosse: partido.status?.totalPosse,
        totalMembros: partido.status?.totalMembros,
        uriMembros: partido.status?.uriMembros,
        lider: partido.status?.lider
          ? {
              uri: partido.status.lider.uri,
              nome: partido.status.lider.nome,
              siglaPartido: partido.status.lider.siglaPartido,
              uriPartido: partido.status.lider.uriPartido,
              uf: partido.status.lider.uf,
              idLegislatura: partido.status.lider.idLegislatura,
              urlFoto: partido.status.lider.urlFoto,
            }
          : null,
      },
      numeroEleitoral: partido.numeroEleitoral || null,
      urlLogo: partido.urlLogo || null,
      urlWebSite: partido.urlWebSite || null,
      urlFacebook: partido.urlFacebook || null,
    };

    return partidoData;
  } catch (error) {
    console.error('Erro ao buscar partido da API:', error);
    return null;
  }
};
