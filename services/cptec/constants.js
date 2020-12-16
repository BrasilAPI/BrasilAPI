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
    wind:   'vento_int',
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
    wind:   'vento_int',
    wind_direction: 'vento_dir',
    humidity: 'umidade',
    weather_code: 'tempo',
    weather_desc: 'tempo_desc',
    temp: 'temperatura'
}];
