import axios from 'axios';
import { z } from 'zod';

const URL =
  'https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetInitialCompanies';

const PAGE_SIZE = 120;

const rawTickerSchema = z.object({
  codeCVM: z.string(),
  issuingCompany: z.string(),
  companyName: z.string(),
  tradingName: z.string(),
  cnpj: z.string(),
  marketIndicator: z.string(),
  typeBDR: z.string(),
  dateListing: z.string(),
  status: z.string(),
  segment: z.string(),
  segmentEng: z.string(),
  type: z.string(),
  market: z.string(),
});

const rawResponseSchema = z.object({
  page: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalRecords: z.number(),
  }),
  results: z.array(rawTickerSchema),
});

const tickerSchema = z.object({
  code_CVM: z.string(),
  issuing_company: z.string(),
  company_name: z.string(),
  trading_name: z.string(),
  cnpj: z.string(),
  market_indicator: z.string(),
  type_BDR: z.string(),
  date_listing: z.string(),
  status: z.string(),
  segment: z.string(),
  segment_eng: z.string(),
  type: z.string(),
  market: z.string(),
});

async function fetchTickers({ pageNumber, pageSize, language = 'pt-br' }) {
  const paramsB64 = Buffer.from(
    JSON.stringify({ language, pageNumber, pageSize })
  ).toString('base64');

  const { data } = await axios.get(`${URL}/${paramsB64}`);

  const parsedResponse = rawResponseSchema.parse(data);
  const tickers = parsedResponse.results.map((ticker) => {
    return tickerSchema.parse({
      code_CVM: ticker.codeCVM,
      issuing_company: ticker.issuingCompany,
      company_name: ticker.companyName,
      trading_name: ticker.tradingName,
      cnpj: ticker.cnpj,
      market_indicator: ticker.marketIndicator,
      type_BDR: ticker.typeBDR,
      date_listing: ticker.dateListing,
      status: ticker.status,
      segment: ticker.segment,
      segment_eng: ticker.segmentEng,
      type: ticker.type,
      market: ticker.market,
    });
  });
  return {
    page: parsedResponse.page,
    tickers,
  };
}

export async function listTickers() {
  const { tickers, page } = await fetchTickers({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(page.totalRecords / PAGE_SIZE);
  const promises = [];
  for (let i = 2; i <= totalPages; i += 1) {
    promises.push(fetchTickers({ pageNumber: i, pageSize: PAGE_SIZE }));
  }

  const results = await Promise.all(promises);

  for (let i = 0; i < results.length; i += 1) {
    const { tickers: newTickers } = results[i];
    tickers.push(...newTickers);
  }

  return tickers;
}
