// Calling http because limitations on tls of webservice
export const CPTEC_URL = 'http://servicos.cptec.inpe.br/XML';

export const MIN_DAYS = 1;

// Max numbers of days (CPTEC limitations)
export const MAX_SWELL_DAYS = 6;
export const MAX_WEATHER_DAYS = 14;

// Descriptions extracted from CPTEC docs: http://servicos.cptec.inpe.br/XML/#condicoes-tempo
export const CONDITION_DESCRIPTIONS = {
  ec: 'Encoberto com Chuvas Isoladas',
  ci: 'Chuvas Isoladas',
  c: 'Chuva',
  in: 'Instável',
  pp: 'Poss. de Pancadas de Chuva',
  cm: 'Chuva pela Manhã',
  cn: 'Chuva a Noite',
  pt: 'Pancadas de Chuva a Tarde',
  pm: 'Pancadas de Chuva pela Manhã',
  np: 'Nublado e Pancadas de Chuva',
  pc: 'Pancadas de Chuva',
  pn: 'Parcialmente Nublado',
  cv: 'Chuvisco',
  ch: 'Chuvoso',
  t: 'Tempestade',
  ps: 'Predomínio de Sol',
  e: 'Encoberto',
  n: 'Nublado',
  cl: 'Céu Claro',
  nv: 'Nevoeiro',
  g: 'Geada',
  ne: 'Neve',
  nd: 'Não Definido',
  pnt: 'Pancadas de Chuva a Noite',
  psc: 'Possibilidade de Chuva',
  pcm: 'Possibilidade de Chuva pela Manhã',
  pct: 'Possibilidade de Chuva a Tarde',
  pcn: 'Possibilidade de Chuva a Noite',
  npt: 'Nublado com Pancadas a Tarde',
  npn: 'Nublado com Pancadas a Noite',
  ncn: 'Nublado com Poss. de Chuva a Noite',
  nct: 'Nublado com Poss. de Chuva a Tarde',
  ncm: 'Nubl. c/ Poss. de Chuva pela Manhã',
  npm: 'Nublado com Pancadas pela Manhã',
  npp: 'Nublado com Possibilidade de Chuva',
  vn: 'Variação de Nebulosidade',
  ct: 'Chuva a Tarde',
  ppn: 'Poss. de Panc. de Chuva a Noite',
  ppt: 'Poss. de Panc. de Chuva a Tarde',
  ppm: 'Poss. de Panc. de Chuva pela Manhã',
};
