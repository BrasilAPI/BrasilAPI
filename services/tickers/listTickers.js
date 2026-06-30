import axios from 'axios';
import { z } from 'zod';

const URL = 'https://sistemaswebb3-listados.b3.com.br';
const PAGE_SIZE = 120;

const rawStockTickerSchema = z.object({
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

const rawResponseStocksSchema = z.object({
  page: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalRecords: z.number(),
  }),
  results: z.array(rawStockTickerSchema),
});

const stockTickerSchema = z.object({
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

const rawTickerInvestmentFundSchema = z.object({
  id: z.number(),
  typeName: z.string().nullable(),
  acronym: z.string(),
  fundName: z.string(),
  tradingName: z.string(),
});

const rawResponseInvestmentFundsSchema = z.object({
  page: z.object({
    pageNumber: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    totalRecords: z.number(),
  }),
  results: z.array(rawTickerInvestmentFundSchema),
});

const tickerInvestmentFundSchema = z.object({
  id: z.number(),
  type_name: z.string().nullable(),
  acronym: z.string(),
  fund_name: z.string(),
  trading_name: z.string(),
});

async function fetchStockTickers({ pageNumber, pageSize, language = 'pt-br' }) {
  const paramsB64 = Buffer.from(
    JSON.stringify({ language, pageNumber, pageSize })
  ).toString('base64');

  const { data } = await axios.get(
    `${URL}/listedCompaniesProxy/CompanyCall/GetInitialCompanies/${paramsB64}`
  );

  const parsedResponse = rawResponseStocksSchema.parse(data);
  const tickers = parsedResponse.results.map((ticker) => {
    return stockTickerSchema.parse({
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

async function fetchInvestmentFundTickers({
  typeFund,
  pageNumber,
  pageSize,
  language = 'pt-br',
}) {
  const paramsB64 = Buffer.from(
    JSON.stringify({ language, pageNumber, pageSize, typeFund })
  ).toString('base64');

  const { data } = await axios.get(
    `${URL}/fundsListedProxy/Search/GetListFunds/${paramsB64}`
  );

  const parsedResponse = rawResponseInvestmentFundsSchema.parse(data);
  const tickers = parsedResponse.results.map((ticker) => {
    return tickerInvestmentFundSchema.parse({
      id: ticker.id,
      type_name: ticker.typeName,
      acronym: ticker.acronym,
      fund_name: ticker.fundName,
      trading_name: ticker.tradingName,
    });
  });
  return {
    page: parsedResponse.page,
    tickers,
  };
}

export async function listStockTickers() {
  const { tickers, page } = await fetchStockTickers({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(page.totalRecords / PAGE_SIZE);
  const promises = [];
  for (let i = 2; i <= totalPages; i += 1) {
    promises.push(fetchStockTickers({ pageNumber: i, pageSize: PAGE_SIZE }));
  }

  const results = await Promise.all(promises);

  for (let i = 0; i < results.length; i += 1) {
    const { tickers: newTickers } = results[i];
    tickers.push(...newTickers);
  }

  return tickers;
}

export async function listInvestmentFundTickers({ typeFund }) {
  const { tickers, page } = await fetchInvestmentFundTickers({
    typeFund,
    pageNumber: 1,
    pageSize: PAGE_SIZE,
  });

  const totalPages = Math.ceil(page.totalRecords / PAGE_SIZE);
  const promises = [];
  for (let i = 2; i <= totalPages; i += 1) {
    promises.push(
      fetchInvestmentFundTickers({
        typeFund,
        pageNumber: i,
        pageSize: PAGE_SIZE,
      })
    );
  }

  const results = await Promise.all(promises);

  for (let i = 0; i < results.length; i += 1) {
    const { tickers: newTickers } = results[i];
    tickers.push(...newTickers);
  }

  return tickers;
}
