import { getServerSideSitemap } from 'next-sitemap';

const BASE_URL = 'https://brasilapi.com.br';
const sMaxAge = 24 * 60 * 60;

const getDate = () => {
  const date = new Date();

  return date.toISOString().split('T')[0];
};

const getDocs = () => {
  return [
    'BANKS',
    'CEP',
    'CEP-V2',
    'CNPJ',
    'CVM',
    'DDD',
    'Feriados-Nacionais',
    'FIPE',
    'IBGE',
    'NCM',
    'ISBN',
    'CPTEC',
    'PIX',
    'CPF',
  ];
};

const buildDate = getDate();

export const getServerSideProps = async (context) => {
  const currentDate = getDate();

  const tagsDoc = getDocs();

  const staticPaths = [
    {
      loc: `${BASE_URL}`,
      lastmod: buildDate,
      changefreq: 'weekly',
      priority: '1',
    },
    {
      loc: `${BASE_URL}/docs`,
      lastmod: buildDate,
      changefreq: 'weekly',
      priority: '0.9',
    },
  ];

  const docs = tagsDoc.map((tag) => ({
    loc: `${BASE_URL}/docs#tag/${tag}`,
    lastmod: currentDate,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  context.res.setHeader(
    'Cache-Control',
    `max-age=0, s-maxage=${sMaxAge}, stale-while-revalidate, public`
  );

  return getServerSideSitemap(context, staticPaths.concat(docs));
};

// Default export to prevent next.js errors
const Component = () => {};

export default Component;
