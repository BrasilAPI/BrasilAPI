export const CPTEC_URL = 'http://servicos.cptec.inpe.br/XML/';

export const CITY_TEMPLATE = ['cidades/cidade', {
    name: 'nome',
    state: 'uf',
    code: 'id'
}];

export const CAPITAL_TEMPLATE = ['capitais/metar', {
    icao_code: 'codigo',
    last_update: 'atualizacao',
    pressure: 'pressao',
    visibility: 'intensidade', // this property should be "visibilidade", but it comes from the webservice as "intensidade"
    wind: 'vento_int',
    wind_direction: 'vento_dir',
    humidity: 'umidade',
    weather_code: 'tempo',
    weather_desc: 'tempo_desc',
    temp: 'temperatura'
}];

export const AIRPORT_TEMPLATE = ['metar', {
    icao_code: 'codigo',
    last_update: 'atualizacao',
    pressure: 'pressao',
    visibility: 'visibilidade',
    wind: 'vento_int',
    wind_direction: 'vento_dir',
    humidity: 'umidade',
    weather_code: 'tempo',
    weather_desc: 'tempo_desc',
    temp: 'temperatura'
}];


export const PREDICTION_TEMPLATE = {
    city_name: '/cidade/nome',
    state: '/cidade/uf',
    last_update: '/cidade/atualizacao',
    weather: ['/cidade/previsao', {
        date: 'dia',
        condition: 'tempo',
        min: 'minima',
        max: 'maxima',
        uv_index: 'iuv'
    }]
};

export const SWELL_TEMPLATE = {
    city_name: '/cidade/nome',
    state: '/cidade/uf',
    last_update: '/cidade/atualizacao',
    swell: ['/cidade/previsao', {
        date_time: 'dia',
        wind: 'vento',
        wind_direction: 'vento_dir',
        wave_height: 'altura',
        wave_direction: 'direcao',
        agitation: 'agitacao' // If someone know better therm for this property
    }]
}

export const CONDITION_DESCRIPTIONS = {
    ec: "Encoberto com Chuvas Isoladas",
    ci: "Chuvas Isoladas",
    c: "Chuva",
    in: "Instável",
    pp: "Poss. de Pancadas de Chuva",
    cm: "Chuva pela Manhã",
    cn: "Chuva a Noite",
    pt: "Pancadas de Chuva a Tarde",
    pm: "Pancadas de Chuva pela Manhã",
    np: "Nublado e Pancadas de Chuva",
    pc: "Pancadas de Chuva",
    pn: "Parcialmente Nublado",
    cv: "Chuvisco",
    ch: "Chuvoso",
    t: "Tempestade",
    ps: "Predomínio de Sol",
    e: "Encoberto",
    n: "Nublado",
    cl: "Céu Claro",
    nv: "Nevoeiro",
    g: "Geada",
    ne: "Neve",
    nd: "Não Definido",
    pnt: "Pancadas de Chuva a Noite",
    psc: "Possibilidade de Chuva",
    pcm: "Possibilidade de Chuva pela Manhã",
    pct: "Possibilidade de Chuva a Tarde",
    pcn: "Possibilidade de Chuva a Noite",
    npt: "Nublado com Pancadas a Tarde",
    npn: "Nublado com Pancadas a Noite",
    ncn: "Nublado com Poss. de Chuva a Noite",
    nct: "Nublado com Poss. de Chuva a Tarde",
    ncm: "Nubl. c/ Poss. de Chuva pela Manhã",
    npm: "Nublado com Pancadas pela Manhã",
    npp: "Nublado com Possibilidade de Chuva",
    vn: "Variação de Nebulosidade",
    ct: "Chuva a Tarde",
    ppn: "Poss. de Panc. de Chuva a Noite",
    ppt: "Poss. de Panc. de Chuva a Tarde",
    ppm: "Poss. de Panc. de Chuva pela Manhã"
}
