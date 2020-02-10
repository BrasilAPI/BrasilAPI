<h1 align="center">🇧🇷 Brasil API</h1>
<p align="center">
  <strong>Vamos transformar o Brasil em uma API?</strong>
</p>

## Motivo
Acesso programático de informações é algo fundamental na comunicação entre sistemas mas, para nossa surpresa, uma informação tão útil e pública quanto um CEP não consegue ser acessada diretamente por um navegador por conta da API dos Correios não possuir CORS habilitado.

Dado a isso, este projeto experimental tem como objetivo centralizar e disponibilizar endpoints modernos com baixíssima latência utilizando tecnologias como [ZEIT Smart CDN](https://zeit.co/smart-cdn) responsável por fazer o cache das informações em atualmente 23 regiões distribuídas ao longo do mundo (incluindo Brasil). Então não importa o quão devagar for a fonte dos dados, nós queremos disponibilizá-la da forma mais rápida e moderna possível.

## Como contribuir
Através do [Next.js](https://nextjs.org/), um framework utilizado por empresas como Marvel, Twitch, Nike, Hulu, TypeForm, Nubank, Ferrari, TikTok, Square Enix, entre outras, estamos construindo a página de apresentação do projeto e, por ser um framework híbrido, ele possibilita a construção e deploy de APIs com o mínimo de configuração possível em uma infraestrutura autoescalável da [ZEIT](https://zeit.co/), a mesma que conta com recursos sensacionais como a [ZEIT Smart CDN](https://zeit.co/smart-cdn).

Caso você esteja lendo esta versão de README, você está pegando o projeto num estágio extremamente inicial, porém empolgante, pois há várias coisas a serem definidas. Então caso queira contribuir, utilize as issues para entender quais pontos ainda não foram resolvidos, conversar conosco e contribuir tanto com idéias técnicas, quanto de quais APIs podem ser criadas.

## Endpoints
O primeiro endpoint a ser implementado precisava ser o que estava nos dando a maior dor de cabeça: busca de um endereço através do CEP. É um endpoint extremamente simples de implementar, mas vários detalhes ainda não foram resolvidos, como garantir seu comportamento através de testes E2E utilizando a Preview URL que a ZEIT retorna a cada Pull Request. Depois de consolidarmos as melhores práticas para esse endpoint, poderemos replicar para todos os outros que irão vir.


### CEP
Busca por CEP com múltiplos providers de fallback.

**GET** `https://brasilapi.com.br/api/cep/`**[cep]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/cep/05010000

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
// GET https://brasilapi.com.br/api/cep/00000000

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

## Contribuidores

| [<img src="https://avatars0.githubusercontent.com/u/22279592?s=400&v=4" width=115><br><sub>@kevenleone</sub>](https://github.com/kevenleone) |
| :---: |


## Autores

| [<img src="https://avatars3.githubusercontent.com/u/4248081?s=460&v=4" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://avatars3.githubusercontent.com/u/8251208?s=400&v=4" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
