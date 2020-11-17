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
  <img src="https://github.com/filipedeschamps/BrasilAPI/workflows/Testes%20E2E/badge.svg">
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

## Termos de Uso
O BrasilAPI é uma iniciativa feita de brasileiros para brasileiros, por favor, não abuse deste serviço. Estamos em beta e ainda elaborando os Termos de Uso, mas por enquanto por favor não utilize formas automatizadas para fazer "crawling" dos dados da API. Um exemplo prático disto é um dos maiores provedores de telefonia do Brasil estar revalidando, neste exato momento, todos os Ceps (de `00000000` até `99999999`) e estourando em 5 vezes o limite atual da nossa conta no servidor. O volume de consulta dever ter a natureza de uma pessoa real requisitando um determinado dado. E para consultas com um alto volume automatizado, iremos mais para frente fornecer alguma solução, como por exemplo, conseguir fazer o download de toda a base de Ceps em uma única request.

## Contribuidores

| [<img src="https://github.com/kevenleone.png" width="115"><br><sub>@kevenleone</sub>](https://github.com/kevenleone) | [<img src="https://github.com/OtavioCapila.png" width="115"><br><sub>@OtavioCapila</sub>](https://github.com/OtavioCapila) | [<img src="https://github.com/rafamancan.png" width="115"><br><sub>@rafamancan</sub>](https://github.com/rafamancan) | [<img src="https://github.com/lucas-eduardo.png" width="115"><br><sub>@lucas-eduardo</sub>](https://github.com/lucas-eduardo) | [<img src="https://github.com/eliseumds.png" width="115"><br><sub>@eliseumds</sub>](https://github.com/eliseumds) | [<img src="https://github.com/evertoncastro.png" width="115"><br><sub>@evertoncastro</sub>](https://github.com/evertoncastro) |
| :---: |  :---: |  :---: |  :---: |  :---: |  :---: |
| [<img src="https://github.com/mukaschultze.png"><br><sub>@mukaschultze</sub>](https://github.com/mukaschultze) | [<img src="https://github.com/paulogdm.png" width="115"><br><sub>@paulogdm</sub>](https://github.com/paulogdm) | [<img src="https://github.com/mathleite.png" width="115"><br><sub>@mathleite</sub>](https://github.com/mathleite) |  [<img src="https://github.com/WeslleyNasRocha.png" width="115"><br><sub>@WeslleyNasRocha</sub>](https://github.com/WeslleyNasRocha) | [<img src="https://github.com/paulo-santana.png" width="115"><br><sub>@paulo-santana</sub>](https://github.com/paulo-santana) | [<img src="https://github.com/RaphaelOliveiraMoura.png" width="115"><br><sub>@RaphaelOliveiraMoura</sub>](https://github.com/RaphaelOliveiraMoura) |
| [<img src="https://github.com/guiaramos.png" width="115"><br><sub>@guiaramos</sub>](https://github.com/guiaramos) | [<img src="https://github.com/marceloF5.png" width="115"><br><sub>@marceloF5</sub>](https://github.com/marceloF5) | [<img src="https://github.com/tupizz.png" width="115"><br><sub>@tupizz</sub>](https://github.com/tupizz) | [<img src="https://github.com/FlavioAndre.png" width="115"><br><sub>@FlavioAndre</sub>](https://github.com/FlavioAndre) | [<img src="https://github.com/matheusvellone.png" width="115"><br><sub>@matheusvellone</sub>](https://github.com/matheusvellone) | [<img src="https://github.com/danielramosbh74.png" width="115"><br><sub>@danielramosbh74</sub>](https://github.com/danielramosbh74) |
| [<img src="https://github.com/juniorpb.png" width="115"><br><sub>@juniorpb</sub>](https://github.com/juniorpb) |

## Autores

| [<img src="https://github.com/filipedeschamps.png" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://github.com/lucianopf.png" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
