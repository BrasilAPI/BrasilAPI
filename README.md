<h1 align="center"><img src="./public/brasilapi-logo-small.png"> Brasil API</h1>

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

### Universities
Busca por dados de universidades brasileiras.

**GET** `https://brasilapi.com.br/api/universities/v1/`**[id]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/universities/v1/1

{
  "id": 1,
  "full_name": "UNIVERSIDADE FEDERAL DE MATO GROSSO",
  "name": "UFMT",
  "ibge": "5103403",
  "city": "CUIABA",
  "uf": "MT",
  "zipcode": "78060900",
  "street": "AVENIDA FERNANDO CORREA DA COSTA",
  "number": "2367",
  "neighborhood": "BOA ESPERANÇA",
  "phone": "(65) 3615 8302"
}
```

#### Consulta com código incorreto

```json
// GET https://brasilapi.com.br/api/universities/v1/199920

{
  "message": "Universidade não encontrada",
  "type": "UNIVERSITY_NOT_FOUND"
}
```

**GET** `https://brasilapi.com.br/api/universities/v1`

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/universities/v1

[
  {
    "id": 1,
    "full_name": "UNIVERSIDADE FEDERAL DE MATO GROSSO",
    "name": "UFMT",
    "ibge": "5103403",
    "city": "CUIABA",
    "uf": "MT",
    "zipcode": "78060900",
    "street": "AVENIDA FERNANDO CORREA DA COSTA",
    "number": "2367",
    "neighborhood": "BOA ESPERANÇA",
    "phone": "(65) 3615 8302"
  },
  ...
]
```

## Termos de Uso
O BrasilAPI é uma iniciativa feita de brasileiros para brasileiros, por favor, não abuse deste serviço. Estamos em beta e ainda elaborando os Termos de Uso, mas por enquanto por favor não utilize formas automatizadas para fazer "crawling" dos dados da API. Um exemplo prático disto é um dos maiores provedores de telefonia do Brasil estar revalidando, neste exato momento, todos os Ceps (de `00000000` até `99999999`) e estourando em 5 vezes o limite atual da nossa conta no servidor. O volume de consulta dever ter a natureza de uma pessoa real requisitando um determinado dado. E para consultas com um alto volume automatizado, iremos mais para frente fornecer alguma solução, como por exemplo, conseguir fazer o download de toda a base de Ceps em uma única request.

## Contribuidores

| [<img src="https://avatars0.githubusercontent.com/u/22279592?s=400&v=4" width="115"><br><sub>@kevenleone</sub>](https://github.com/kevenleone) | [<img src="https://avatars0.githubusercontent.com/u/29285724?s=400&v=4" width="115"><br><sub>@OtavioCapila</sub>](https://github.com/OtavioCapila) | [<img src="https://avatars2.githubusercontent.com/u/6341210?s=400&v=4" width="115"><br><sub>@rafamancan</sub>](https://github.com/rafamancan) | [<img src="https://avatars2.githubusercontent.com/u/22918282?s=400&v=4" width="115"><br><sub>@lucas-eduardo</sub>](https://github.com/lucas-eduardo) | [<img src="https://avatars1.githubusercontent.com/u/640840?s=400&v=4" width="115"><br><sub>@eliseumds</sub>](https://github.com/eliseumds) | [<img src="https://avatars1.githubusercontent.com/u/11640028?s=400&v=4" width="115"><br><sub>@evertoncastro</sub>](https://github.com/evertoncastro) |
| :---: |  :---: |  :---: |  :---: |  :---: |  :---: |
| [<img src="https://avatars3.githubusercontent.com/u/13923364?s=400&v=4" width="115"><br><sub>@mukaschultze</sub>](https://github.com/mukaschultze) | [<img src="https://avatars2.githubusercontent.com/u/7690649?s=400&v=4" width="115"><br><sub>@paulogdm</sub>](https://github.com/paulogdm) | [<img src="https://avatars2.githubusercontent.com/u/34130446?s=400&u=ce853ec1d505c15b78ffa7d64a4c2a419f9dfdf8&v=4" width="115"><br><sub>@mathleite</sub>](https://github.com/mathleite) |  [<img src="https://avatars0.githubusercontent.com/u/19312651?s=400&u=38b984e80c3c6a59fee61676c504f02313e2212d&v=4" width="115"><br><sub>@WeslleyNasRocha</sub>](https://github.com/WeslleyNasRocha) | [<img src="https://avatars2.githubusercontent.com/u/7424845?s=400&u=346acdf662dbb880ecf659ce27097f5c13bd9dc3&v=4" width="115"><br><sub>@paulo-santana</sub>](https://github.com/paulo-santana) | [<img src="https://avatars2.githubusercontent.com/u/41276009?s=400&u=109f02852994de760c8f0014ef556cafad7429a1&v=4" width="115"><br><sub>@RaphaelOliveiraMoura</sub>](https://github.com/RaphaelOliveiraMoura) |
| [<img src="https://avatars3.githubusercontent.com/u/49703106?s=400&u=364f6affc0b28fee107bc7542a9408fa70da2208&v=4" width="115"><br><sub>@guiaramos</sub>](https://github.com/guiaramos) | [<img src="https://avatars2.githubusercontent.com/u/12580906?s=400&u=42e3f0ae2caa642f687945d4e2091ed8a5d97125&v=4" width="115"><br><sub>@marceloF5</sub>](https://github.com/marceloF5) | [<img src="https://avatars3.githubusercontent.com/u/15824865?s=400&u=dc038f866810c31c8d70f624bd53ca8cb9061d4b&v=4" width="115"><br><sub>@tupizz</sub>](https://github.com/tupizz) | [<img src="https://avatars1.githubusercontent.com/u/4183681?s=400&u=bd588248b3081057433881db40ebaf176cd37211&v=4" width="115"><br><sub>@FlavioAndre</sub>](https://github.com/FlavioAndre) | [<img src="https://avatars2.githubusercontent.com/u/5989971?s=460&u=59378fbe4a020238916b281ebfb72992e921e0c7&v=4" width="115"><br><sub>@matheusvellone</sub>](https://github.com/matheusvellone) | [<img src="https://avatars2.githubusercontent.com/u/11930738?s=400&u=a1270129441990069d997df8e39b6f6224bafd40&v=4" width="115"><br><sub>@danielramosbh74</sub>](https://github.com/danielramosbh74) |
| [<img src="https://avatars3.githubusercontent.com/u/34171773?s=400&u=f05580bc09aaa70b440d7f7f5f8eb3e4f693ec5b&v=4" width="115"><br><sub>@juniorpb</sub>](https://github.com/juniorpb) | [<img src="https://avatars2.githubusercontent.com/u/38855507?s=400&u=20c80252e57c06227186be9761e67a20a82d3717&v=4" width="115"><br><sub>@CarlosZiegler</sub>](https://github.com/CarlosZiegler) | [<img src="https://avatars1.githubusercontent.com/u/370216?s=400&u=7f3ad2ea903d45bbfc4434902a1d081740e9f5dc&v=4" width="115"><br><sub>@otaciliolacerda</sub>](https://github.com/otaciliolacerda) | [<img src="https://avatars0.githubusercontent.com/u/9449048?s=400&u=85262ea3dc049b1f4a8e63e3b574b5fc03327b52&v=4" width="115"><br><sub>@RodriAndreotti</sub>](https://github.com/RodriAndreotti) |

## Autores

| [<img src="https://avatars3.githubusercontent.com/u/4248081?s=460&v=4" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://avatars3.githubusercontent.com/u/8251208?s=400&v=4" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
