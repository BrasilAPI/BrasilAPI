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
Acesso programático de informações é algo fundamental na comunicação entre sistemas, mas, para nossa surpresa, uma informação tão útil e pública quanto um CEP não consegue ser acessada diretamente por um navegador por conta da API dos Correios não possuir CORS habilitado.

Dado a isso, este projeto experimental tem como objetivo centralizar e disponibilizar endpoints modernos com baixíssima latência utilizando tecnologias como [Vercel Smart CDN](https://vercel.com/smart-cdn/?utm_source=brasilapi) responsável por fazer o cache das informações em atualmente 23 regiões distribuídas ao longo do mundo (incluindo Brasil). Então não importa o quão devagar for a fonte dos dados, nós queremos disponibilizá-la da forma mais rápida e moderna possível.

## Documentação
Caso deseje saber mais sobre os detalhes das integrações consulte nossa [documentação](https://brasilapi.com.br/docs) OpenAPI.

## Como contribuir
Através do [Next.js](https://nextjs.org/?utm_source=brasilapi), um framework utilizado por empresas como Marvel, Twitch, Nike, Hulu, TypeForm, Nubank, Ferrari, TikTok, Square Enix, entre outras, estamos construindo a página de apresentação do projeto e, por ser um framework híbrido, ele possibilita a construção e deploy de APIs com o mínimo de configuração possível em uma infraestrutura autoescalável da [Vercel](https://vercel.com/?utm_source=brasilapi), a mesma que conta com recursos sensacionais como a [Vercel Smart CDN](https://vercel.co/smart-cdn/?utm_source=brasilapi).

Caso você esteja lendo esta versão de README, você está pegando o projeto num estágio extremamente inicial, porém empolgante, pois há várias coisas a serem definidas. Então caso queira contribuir, utilize as issues para entender quais pontos ainda não foram resolvidos, conversar conosco e contribuir tanto com idéias técnicas, quanto de quais APIs podem ser criadas.

Veja mais detalhes sobre **Como contribuir** no arquivo [CONTRIBUTING.md](CONTRIBUTING.md)

## Termos de Uso
O BrasilAPI é uma iniciativa feita de brasileiros para brasileiros, por favor, não abuse deste serviço. Estamos em beta e ainda elaborando os Termos de Uso, mas por enquanto por favor não utilize formas automatizadas para fazer "crawling" dos dados da API. Um exemplo prático disso foi quando um dos maiores provedores de telefonia do Brasil estava validando novamente todos os CEPs (de 00000000 até 99999999) e ultrapassando em cinco vezes o limite atual da nossa conta no servidor. O volume de consultas deve ter a natureza de uma pessoa real requisitando um determinado dado. Para consultas com um alto volume automatizado forneceremos posteriormente alguma solução, como, por exemplo, permitir o download de toda a base de CEPs em uma única requisição.

## Pessoas que já contribuíram

<a href="https://github.com/brasilapi/brasilapi/graphs/contributors"><img src="https://contrib.rocks/image?repo=brasilapi/brasilapi" /></a>

## 📦 Bibliotecas da comunidade
Abaixo segue uma lista de integrações com a BrasilApi fornecidas pela comunidade (muito obrigado a eles!):

**Go**
  * **[brasilapi-go](https://github.com/isaqueveras/brasilapi-go)** criado por [@isaqueveras](https://github.com/isaqueveras)
  * **[brasilapi-go](https://github.com/Philipelima/brasilapi-go)** criado por [@philipelima](https://github.com/philipelima)

**JS**
  * **[brasil-api-promisse](https://github.com/guhcostan/brasil-api-promisse)** criado por [@guhcostan](https://github.com/guhcostan)
  * **[brasilapi-js](https://github.com/WillianAgostini/brasilapi-js)** criado por [@WillianAgostini](https://github.com/WillianAgostini)


**Flutter**
  * **[brazilian_banks](https://github.com/credifit-br/brazilian_banks)** criado por [@credifit-br](https://github.com/credifit-br)
  * **[br_api_dart](https://github.com/PedroHAVeloso/br_api_dart)** criado por [@pedrohaveloso](https://github.com/PedroHAVeloso)

**.Net**
  * **[BrasilAPI-DotNet](https://github.com/farukaf/BrasilAPI-DotNet)** criado por [@farukaf](https://github.com/farukaf)

**PHP**
  * **[brasilapi-php](https://github.com/andreoneres/brasilapi-php)** criado por [@andreoneres](https://github.com/andreoneres)
  * **[brasilapi-php](https://github.com/Corviz/brasilapi-php)** Criado por [@carloscarucce](https://github.com/carloscarucce)

**Python**
  * **[brasilapy](https://github.com/lipe14-ops/brasilapy)** Criado por [@lipe14-ops](https://github.com/lipe14-ops)
  * **[brasilapi-python](https://github.com/paulovitorweb/brasilapi-python)** Criado por [@paulovitorweb](https://github.com/paulovitorweb)

**Ruby**
  * **[brasilapi-rb](https://github.com/dayvidemerson/brasilapi-rb)** Criado por [@dayvidemerson](https://github.com/dayvidemerson)

**Rust**
  * **[brasilapi-rs](https://github.com/pedrinfx/brasilapi-rs)** Criado por [@pedrinfx](https://github.com/pedrinfx)

**Java**
  * **[BrasilAPI-Java](https://github.com/SavioAndres/BrasilAPI-Java)** Criado por [@SavioAndres](https://github.com/SavioAndres)

**Delphi**
  * **[BrasilAPI-Delphi](https://github.com/gabrielbaltazar/brasilapi4D)** Criado por [@GabrielBaltazar](https://github.com/gabrielbaltazar)

**V**
  * **[BrasilAPI-V](https://github.com/ldedev/brasilapi-v)** Criado por [@ldedev(André)](https://github.com/ldedev)



## Autores

| [<img src="https://github.com/filipedeschamps.png?size=115" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://github.com/lucianopf.png?size=115" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
