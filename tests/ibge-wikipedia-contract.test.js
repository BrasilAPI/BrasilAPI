import axios from 'axios';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import {
  CODIGOS_ESTADOS,
  getStateCities,
  PAGINAS_MUNICIPIOS,
  parseCitiesFromWikitext,
  WIKIPEDIA_API_URL,
  WIKIPEDIA_TIMEOUT_MS,
  WIKIPEDIA_USER_AGENT,
} from '@/services/ibge/wikipedia';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const table = (...rows) =>
  [
    '{| class="wikitable sortable"',
    '! # !! Município !! Código<br />IBGE !! Localização',
    ...rows.flatMap((row) => ['|-', row]),
    '|}',
  ].join('\n');

const mockWikitext = (wikitext) =>
  axios.get.mockResolvedValue({ data: { parse: { wikitext } } });

beforeEach(() => {
  vi.clearAllMocks();
  mockWikitext(
    table(
      '| 1 ||style="text-align:left;"| [[Recife]] || 2611606 || [[Imagem:Recife.svg|120px]]'
    )
  );
});

describe('services/ibge/wikipedia: requisição', () => {
  test('pede o wikitext da página exata, identificando a BrasilAPI', async () => {
    await getStateCities('MS');

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(WIKIPEDIA_API_URL, {
      params: expect.objectContaining({
        action: 'parse',
        prop: 'wikitext',
        page: 'Lista de municípios de Mato Grosso do Sul',
      }),
      headers: { 'User-Agent': WIKIPEDIA_USER_AGENT },
      timeout: WIKIPEDIA_TIMEOUT_MS,
    });
    expect(WIKIPEDIA_USER_AGENT).toMatch(/^BrasilAPI\/.+brasilapi\.com\.br/);
  });

  test('tem título de página para toda UF exceto o DF', () => {
    const ufs = Object.keys(CODIGOS_ESTADOS).filter((uf) => uf !== 'DF');

    expect(Object.keys(PAGINAS_MUNICIPIOS).sort()).toEqual(ufs.sort());
  });

  test('retorna Brasília para o DF sem consultar a Wikipedia', async () => {
    await expect(getStateCities('DF')).resolves.toEqual([
      { nome: 'Brasília', codigo_ibge: '5300108' },
    ]);
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('propaga erro quando a API da Wikipedia responde com erro', async () => {
    axios.get.mockResolvedValue({
      data: { error: { code: 'missingtitle', info: 'Página inexistente' } },
    });

    await expect(getStateCities('PE')).rejects.toThrow('Página inexistente');
  });

  test('aceita a UF em minúsculas', async () => {
    await expect(getStateCities('pe')).resolves.toEqual([
      { nome: 'Recife', codigo_ibge: '2611606' },
    ]);
  });
});

describe('services/ibge/wikipedia: leitura do wikitext', () => {
  test('usa o texto exibido do link, sem a desambiguação', () => {
    const wikitext = table(
      '| 1 || [[Cáceres (Mato Grosso)|Cáceres]] || 5102504 || x',
      '| 2 || [[Alto Garças (Mato Grosso)]] || 5100607 || x'
    );

    expect(parseCitiesFromWikitext(wikitext, 'MT')).toEqual([
      { nome: 'Cáceres', codigo_ibge: '5102504' },
      { nome: 'Alto Garças', codigo_ibge: '5100607' },
    ]);
  });

  test('lê o nome de {{BR-XX-...}} e {{flag|...}}, ignorando {{ord|...}} (SC, GO)', () => {
    const wikitext = table(
      '| 1 || style="text-align:left;" | {{ord|Abdon Batista}}{{BR-SC-Abdon Batista}} || 4200051 || x',
      '| 2 || style="text-align:left;" | {{ord|Campos Novos}}{{flag|Campos Novos}} || 4203600 || x'
    );

    expect(parseCitiesFromWikitext(wikitext, 'SC')).toEqual([
      { nome: 'Abdon Batista', codigo_ibge: '4200051' },
      { nome: 'Campos Novos', codigo_ibge: '4203600' },
    ]);
  });

  test('usa as colunas do cabeçalho quando há colunas entre nome e código (RO)', () => {
    const wikitext = [
      '{| class="wikitable"',
      '! # !! [[Municípios do Brasil|Município]] !! Sigla !! Código<br />IBGE',
      '|-',
      "| 1 || [[Alta Floresta d'Oeste]] || AFL || 1100015",
      '|}',
    ].join('\n');

    expect(parseCitiesFromWikitext(wikitext, 'RO')).toEqual([
      { nome: "Alta Floresta d'Oeste", codigo_ibge: '1100015' },
    ]);
  });

  test('lê cabeçalho e células distribuídos em várias linhas (PA)', () => {
    const wikitext = [
      '{| class="wikitable"',
      '|-',
      '! # !! [[Municípios do Brasil|Município]]',
      '!Fundação',
      '!Emancipação',
      "! '''Código<br />IBGE''' !! Localização",
      '|-',
      '| 1 || style="text-align:left;" | [[Abaetetuba]]',
      '|[[1750]]',
      '|[[1895]]',
      '| 1500107 || [[Imagem:Abaetetuba.svg|140px]]',
      '|}',
    ].join('\n');

    expect(parseCitiesFromWikitext(wikitext, 'PA')).toEqual([
      { nome: 'Abaetetuba', codigo_ibge: '1500107' },
    ]);
  });

  test('lê o código quando ele é um link externo para o IBGE', () => {
    const wikitext = table(
      '| 1 || [[Amajari]] || [https://cidades.ibge.gov.br/xtras/perfil.php?codmun=1400050 1400050] || x'
    );

    expect(parseCitiesFromWikitext(wikitext, 'RR')).toEqual([
      { nome: 'Amajari', codigo_ibge: '1400050' },
    ]);
  });

  test('lê o código dentro de {{formatnum:...}}', () => {
    const wikitext = table('| 1 || [[Recife]] || {{formatnum:2611606}} || x');

    expect(parseCitiesFromWikitext(wikitext, 'PE')).toEqual([
      { nome: 'Recife', codigo_ibge: '2611606' },
    ]);
  });

  test('mantém acentos antes de hífen e remove referências e marcador de capital', () => {
    const wikitext = table(
      '| 1 || [[Guajará-Mirim]]<ref name="x">{{citar web|url=a|titulo=b}}</ref> || 1100106 || x',
      '| 2 || [[Porto Velho]]{{dagger}} || 1100205 || x'
    );

    expect(parseCitiesFromWikitext(wikitext, 'RO')).toEqual([
      { nome: 'Guajará-Mirim', codigo_ibge: '1100106' },
      { nome: 'Porto Velho', codigo_ibge: '1100205' },
    ]);
  });

  test('tolera um `{|` duplicado na abertura da tabela (AP)', () => {
    const wikitext = [
      '{| class="wikitable sortable" style="font-size:92%;"',
      table('| 1 ||style="text-align:left;"| [[Calçoene]] || 1600204 || x'),
    ].join('\n');

    expect(parseCitiesFromWikitext(wikitext, 'AP')).toEqual([
      { nome: 'Calçoene', codigo_ibge: '1600204' },
    ]);
  });

  test('aceita células em linhas separadas', () => {
    const wikitext = table(
      ['| 1', '| [[Recife]]', '| 2611606', '| x'].join('\n')
    );

    expect(parseCitiesFromWikitext(wikitext, 'PE')).toEqual([
      { nome: 'Recife', codigo_ibge: '2611606' },
    ]);
  });

  test('ignora linhas sem código, com código de outra UF e duplicadas', () => {
    const wikitext = table(
      '| 1 || [[Boa Esperança do Norte]] ||  || x',
      '| 2 || [[Recife]] || 2611606 || x',
      '| 3 || [[São Paulo]] || 3550308 || x',
      '| 4 || [[Recife]] || 2611606 || x'
    );

    expect(parseCitiesFromWikitext(wikitext, 'PE')).toEqual([
      { nome: 'Recife', codigo_ibge: '2611606' },
    ]);
  });

  test('retorna lista vazia quando não há tabela de municípios', () => {
    expect(parseCitiesFromWikitext('Texto sem tabela.', 'PE')).toEqual([]);
  });
});
