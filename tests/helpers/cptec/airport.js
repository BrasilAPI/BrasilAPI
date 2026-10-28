import { EventEmitter } from 'events';
import { vi } from 'vitest';

export const airportXml = (code = 'SBGR') => `
  <metar>
    <codigo>${code}</codigo>
    <pressao>1013</pressao>
    <vento_int>0</vento_int>
    <vento_dir>0</vento_dir>
    <tempo>ps</tempo>
    <tempo_desc>Predomínio de Sol</tempo_desc>
    <temperatura>0</temperatura>
    <umidade>80</umidade>
    <visibilidade>10000</visibilidade>
    <atualizacao>15/10/2026 12:00:00</atualizacao>
  </metar>`;

// Resposta pública do CPTEC para SBGR em 2026-10-28, sem observações.
export const airportWithoutObservationsXml = `<?xml version='1.0' encoding='ISO-8859-1'?>
<metar><codigo>SBGR</codigo><atualizacao>00/00/0000 00:00:00</atualizacao><pressao>undefined</pressao><temperatura>undefined</temperatura><tempo>undefined</tempo><tempo_desc>undefined</tempo_desc><umidade>undefined</umidade><vento_dir>undefined</vento_dir><vento_int>undefined</vento_int><visibilidade>undefined</visibilidade></metar>`;

export async function requestAirport(handler, version, airport) {
  const request = {
    method: 'GET',
    url: `/api/cptec/${version}/clima/aeroporto/${airport}`,
    headers: { origin: 'https://example.com' },
    query: { airport },
  };
  const response = new EventEmitter();
  response.setHeader = vi.fn();
  response.status = vi.fn((status) => {
    response.statusCode = status;
    return response;
  });
  response.json = vi.fn((body) => {
    response.body = JSON.parse(JSON.stringify(body));
    response.emit('finish');
    return response;
  });

  await handler(request, response);
  return response;
}
