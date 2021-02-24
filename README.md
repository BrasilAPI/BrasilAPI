<h1 align="center"><img src="./public/brasilapi-logo-small.png"></h1>

<div align="center">
  <p>
    <strong>Vamos transformar o Brasil em uma API?</strong>
  </p>
  <p>
    <a href="https://vercel.com/?utm_source=brasilapi" target="_blank" rel="noopener">
      <img src="./public/powered-by-vercel.svg" width="175" alt="Powered by Vercel" />
    </a>
  </p>
</div>

<div align="center">
  <img src="https://github.com/BrasilAPI/BrasilAPI/workflows/Testes%20E2E/badge.svg">
</div>

<div align="center">
  <a href="https://github.com/BrasilAPI/BrasilAPI/issues/186"><img src="https://files.readme.io/e23f0e0-Slack_RGB.png" width="160px"></a>
</div>

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=BrasilAPI_BrasilAPI&metric=alert_status)](https://sonarcloud.io/dashboard?id=BrasilAPI_BrasilAPI)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=BrasilAPI_BrasilAPI&metric=code_smells)](https://sonarcloud.io/dashboard?id=BrasilAPI_BrasilAPI)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=BrasilAPI_BrasilAPI&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=BrasilAPI_BrasilAPI)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=BrasilAPI_BrasilAPI&metric=security_rating)](https://sonarcloud.io/dashboard?id=BrasilAPI_BrasilAPI)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=BrasilAPI_BrasilAPI&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=BrasilAPI_BrasilAPI)

## Motivo
Acesso programático de informações é algo fundamental na comunicação entre sistemas mas, para nossa surpresa, uma informação tão útil e pública quanto um CEP não consegue ser acessada diretamente por um navegador por conta da API dos Correios não possuir CORS habilitado.

Dado a isso, este projeto experimental tem como objetivo centralizar e disponibilizar endpoints modernos com baixíssima latência utilizando tecnologias como [Vercel Smart CDN](https://vercel.com/smart-cdn/?utm_source=brasilapi) responsável por fazer o cache das informações em atualmente 23 regiões distribuídas ao longo do mundo (incluindo Brasil). Então não importa o quão devagar for a fonte dos dados, nós queremos disponibilizá-la da forma mais rápida e moderna possível.

## Como contribuir
Através do [Next.js](https://nextjs.org/?utm_source=brasilapi), um framework utilizado por empresas como Marvel, Twitch, Nike, Hulu, TypeForm, Nubank, Ferrari, TikTok, Square Enix, entre outras, estamos construindo a página de apresentação do projeto e, por ser um framework híbrido, ele possibilita a construção e deploy de APIs com o mínimo de configuração possível em uma infraestrutura autoescalável da [Vercel](https://vercel.com/?utm_source=brasilapi), a mesma que conta com recursos sensacionais como a [Vercel Smart CDN](https://vercel.co/smart-cdn/?utm_source=brasilapi).

Caso você esteja lendo esta versão de README, você está pegando o projeto num estágio extremamente inicial, porém empolgante, pois há várias coisas a serem definidas. Então caso queira contribuir, utilize as issues para entender quais pontos ainda não foram resolvidos, conversar conosco e contribuir tanto com idéias técnicas, quanto de quais APIs podem ser criadas.

Veja mais detalhes sobre **Como contribuir** no arquivo [CONTRIBUTING.md](CONTRIBUTING.md)


## Endpoints
O primeiro endpoint a ser implementado precisava ser o que estava nos dando a maior dor de cabeça: busca de um endereço através do CEP. É um endpoint extremamente simples de implementar, mas vários detalhes ainda não foram resolvidos, como garantir seu comportamento através de testes E2E utilizando a Preview URL que a Vercel retorna a cada Pull Request. Depois de consolidarmos as melhores práticas para esse endpoint, poderemos replicar para todos os outros que irão vir.

### CEP
Busca por CEP com múltiplos providers de fallback.

**GET** `https://brasilapi.com.br/api/cep/v1/`**[cep]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/cep/v1/05010000

{
  "cep": "05010000",
  "state": "SP",
  "city": "São Paulo",
  "neighborhood": "Perdizes",
  "street": "Rua Caiubi"
}
```

#### Consulta com erro

```json
// GET https://brasilapi.com.br/api/cep/v1/00000000

{
  "name": "CepPromiseError",
  "message": "Todos os serviços de CEP retornaram erro.",
  "type": "service_error",
  "errors": [
    {
      "name": "ServiceError",
      "message": "CEP INVÁLIDO",
      "service": "correios"
    },
    {
      "name": "ServiceError",
      "message": "CEP não encontrado na base do ViaCEP.",
      "service": "viacep"
    }
  ]
}
```

### Banks
Busca por dados dos bancos brasileiros direto na base de dados do Bacen.

**GET** `https://brasilapi.com.br/api/banks/v1/`**[code]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/banks/v1/260

{
  "ispb": "18236120",
  "name": "NU PAGAMENTOS S.A.",
  "code": 260,
  "fullName": "Nu Pagamentos S.A."
}
```

#### Consulta com código incorreto

```json
// GET https://brasilapi.com.br/api/banks/v1/1111111

{
  "message": "Código bancário não encontrado",
  "type": "BANK_CODE_NOT_FOUND"
}
```

**GET** `https://brasilapi.com.br/api/banks/v1`

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/banks/v1

[
  {
    "ispb": "18236120",
    "name": "NU PAGAMENTOS S.A.",
    "code": 260,
    "fullName": "Nu Pagamentos S.A."
  },
  ...
]
```

### DDD
Busca as cidades brasileiras referente a um DDD.

**GET** `https://brasilapi.com.br/api/ddd/v1/11`**[code]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/ddd/v1/11

{
  "state": "SP",
  "cities": [
    "EMBU",
    "VÁRZEA PAULISTA",
    "VARGEM GRANDE PAULISTA",
    "VARGEM",
    "TUIUTI",
    "TABOÃO DA SERRA",
    "SUZANO",
    "SÃO ROQUE",
    "SÃO PAULO",
    ...
  ]
}
```

#### Consulta com ddd incorreto

```json
// GET https://brasilapi.com.br/api/ddd/v1/01

{
  "name": "ddd_error",
  "message": "DDD não encontrado",
  "type": "DDD_NOT_FOUND"
}
```

#### Consulta com erro

```json
// GET https://brasilapi.com.br/api/ddd/v1/17

{
  "name": "ddd_error",
  "message": "Todos os serviços de DDD retornaram erro.",
  "type": "service_error"
}
```

### CNPJ
Busca de detalhes de pessoas jurídicas pelo número do CNPJ utilizando a [API Minha Receita](https://github.com/cuducos/minha-receita)..

**GET** `https://brasilapi.com.br/api/cnpj/v1/19131243000197`**[code]**

#### Consulta com sucesso

```json

// GET https://brasilapi.com.br/api/cnpj/v1/19131243000197

{
  "cnpj": "19131243000197",
  "identificador_matriz_filial": 1,
  "descricao_matriz_filial": "Matriz",
  "razao_social": "OPEN KNOWLEDGE BRASIL",
  "nome_fantasia": "REDE PELO CONHECIMENTO LIVRE",
  "situacao_cadastral": 2,
  "descricao_situacao_cadastral": "Ativa",
  "data_situacao_cadastral": "2013-10-03",
  "motivo_situacao_cadastral": 0,
  ...
}
```

#### Consulta com CNPJ inexistente

```json
// GET https://brasilapi.com.br/api/cnpj/v1/00000000000000

{"message": "CNPJ 00000000000000 não encontrado."}
```

#### Consulta com CNPJ inválido

```json
// GET https://brasilapi.com.br/api/cnpj/v1/000

{"message": "CNPJ 000 inválido."}
```

### Feriados nacionais
Lista feriados nacionais de determinado ano.

**GET** `https://brasilapi.com.br/api/feriados/v1/`**[ano]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/feriados/v1/2021
[
  {
    "date": "2021-01-01",
    "name": "Confraternização mundial",
    "type": "national"
  },
  {
    "date": "2021-02-16",
    "name": "Carnaval",
    "type": "national"
  },
  // ...
]
```

#### Consultas com erro

```json
// GET https://brasilapi.com.br/api/feriados/v1/3000
// HTTP/1.1 404 Not Found
{
  "type": "feriados_range_error",
  "message": "Ano fora do intervalo suportado entre 1900 e 2199."
}
```
```json
// GET https://brasilapi.com.br/api/feriados/v1/erro
// HTTP/1.1 500 Internal Server Error
{
  "type": "feriados_error",
  "message": "Erro ao calcular feriados."
}
```

## Termos de Uso
O BrasilAPI é uma iniciativa feita de brasileiros para brasileiros, por favor, não abuse deste serviço. Estamos em beta e ainda elaborando os Termos de Uso, mas por enquanto por favor não utilize formas automatizadas para fazer "crawling" dos dados da API. Um exemplo prático disto é um dos maiores provedores de telefonia do Brasil estar revalidando, neste exato momento, todos os Ceps (de `00000000` até `99999999`) e estourando em 5 vezes o limite atual da nossa conta no servidor. O volume de consulta dever ter a natureza de uma pessoa real requisitando um determinado dado. E para consultas com um alto volume automatizado, iremos mais para frente fornecer alguma solução, como por exemplo, conseguir fazer o download de toda a base de Ceps em uma única request.

## Contribuidores

| [<img src="https://github.com/kevenleone.png?size=115" width="115"><br><sub>@kevenleone</sub>](https://github.com/kevenleone) | [<img src="https://github.com/OtavioCapila.png?size=115" width="115"><br><sub>@OtavioCapila</sub>](https://github.com/OtavioCapila) | [<img src="https://github.com/rafamancan.png?size=115" width="115"><br><sub>@rafamancan</sub>](https://github.com/rafamancan) | [<img src="https://github.com/lucas-eduardo.png?size=115" width="115"><br><sub>@lucas-eduardo</sub>](https://github.com/lucas-eduardo) | [<img src="https://github.com/eliseumds.png?size=115" width="115"><br><sub>@eliseumds</sub>](https://github.com/eliseumds) | [<img src="https://github.com/evertoncastro.png?size=115" width="115"><br><sub>@evertoncastro</sub>](https://github.com/evertoncastro) |
| :---: |  :---: |  :---: |  :---: |  :---: |  :---: |
| [<img src="https://github.com/mukaschultze.png?size=115" width="115"><br><sub>@mukaschultze</sub>](https://github.com/mukaschultze) | [<img src="https://github.com/paulogdm.png?size=115" width="115"><br><sub>@paulogdm</sub>](https://github.com/paulogdm) | [<img src="https://github.com/mathleite.png?size=115" width="115"><br><sub>@mathleite</sub>](https://github.com/mathleite) |  [<img src="https://github.com/WeslleyNasRocha.png?size=115" width="115"><br><sub>@WeslleyNasRocha</sub>](https://github.com/WeslleyNasRocha) | [<img src="https://github.com/paulo-santana.png?size=115" width="115"><br><sub>@paulo-santana</sub>](https://github.com/paulo-santana) | [<img src="https://github.com/RaphaelOliveiraMoura.png?size=115" width="115"><br><sub>@RaphaelOliveiraMoura</sub>](https://github.com/RaphaelOliveiraMoura) |
| [<img src="https://github.com/guiaramos.png?size=115" width="115"><br><sub>@guiaramos</sub>](https://github.com/guiaramos) | [<img src="https://github.com/marceloF5.png?size=115" width="115"><br><sub>@marceloF5</sub>](https://github.com/marceloF5) | [<img src="https://github.com/tupizz.png?size=115" width="115"><br><sub>@tupizz</sub>](https://github.com/tupizz) | [<img src="https://github.com/FlavioAndre.png?size=115" width="115"><br><sub>@FlavioAndre</sub>](https://github.com/FlavioAndre) | [<img src="https://github.com/matheusvellone.png?size=115" width="115"><br><sub>@matheusvellone</sub>](https://github.com/matheusvellone) | [<img src="https://github.com/danielramosbh74.png?size=115" width="115"><br><sub>@danielramosbh74</sub>](https://github.com/danielramosbh74) |
| [<img src="https://github.com/juniorpb.png?size=115" width="115"><br><sub>@juniorpb</sub>](https://github.com/juniorpb) | [<img src="https://github.com/CarlosZiegler.png?size=115" width="115"><br><sub>@CarlosZiegler</sub>](https://github.com/CarlosZiegler) | [<img src="https://github.com/otaciliolacerda.png?size=115" width="115"><br><sub>@otaciliolacerda</sub>](https://github.com/otaciliolacerda) | [<img src="https://github.com/RodriAndreotti.png?size=115" width="115"><br><sub>@RodriAndreotti</sub>](https://github.com/RodriAndreotti) | [<img src="https://github.com/lucasbastianik.png?size=115" width="115"><br><sub>@lucasbastianik</sub>](https://github.com/lucasbastianik) | [<img src="https://github.com/paulosales.png?size=115" width="115"><br><sub>@paulosales</sub>](https://github.com/paulosales) |
| [<img src="https://github.com/eklauberg.png?size=115" width="115"><br><sub>@eklauberg</sub>](https://github.com/eklauberg) |


## Autores

| [<img src="https://github.com/filipedeschamps.png?size=115" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://github.com/lucianopf.png?size=115" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
