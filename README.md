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

## Documentação
Caso deseje saber mais sobre os detalhes das integrações consulte nossa [documentação](https://brasilapi.com.br/docs) OpenAPI.

## Como contribuir
Através do [Next.js](https://nextjs.org/?utm_source=brasilapi), um framework utilizado por empresas como Marvel, Twitch, Nike, Hulu, TypeForm, Nubank, Ferrari, TikTok, Square Enix, entre outras, estamos construindo a página de apresentação do projeto e, por ser um framework híbrido, ele possibilita a construção e deploy de APIs com o mínimo de configuração possível em uma infraestrutura autoescalável da [Vercel](https://vercel.com/?utm_source=brasilapi), a mesma que conta com recursos sensacionais como a [Vercel Smart CDN](https://vercel.co/smart-cdn/?utm_source=brasilapi).

Caso você esteja lendo esta versão de README, você está pegando o projeto num estágio extremamente inicial, porém empolgante, pois há várias coisas a serem definidas. Então caso queira contribuir, utilize as issues para entender quais pontos ainda não foram resolvidos, conversar conosco e contribuir tanto com idéias técnicas, quanto de quais APIs podem ser criadas.

Veja mais detalhes sobre **Como contribuir** no arquivo [CONTRIBUTING.md](CONTRIBUTING.md)

## Termos de Uso
O BrasilAPI é uma iniciativa feita de brasileiros para brasileiros, por favor, não abuse deste serviço. Estamos em beta e ainda elaborando os Termos de Uso, mas por enquanto por favor não utilize formas automatizadas para fazer "crawling" dos dados da API. Um exemplo prático disto é um dos maiores provedores de telefonia do Brasil estar revalidando, neste exato momento, todos os Ceps (de `00000000` até `99999999`) e estourando em 5 vezes o limite atual da nossa conta no servidor. O volume de consulta dever ter a natureza de uma pessoa real requisitando um determinado dado. E para consultas com um alto volume automatizado, iremos mais para frente fornecer alguma solução, como por exemplo, conseguir fazer o download de toda a base de Ceps em uma única request.

## Pessoas que já contribuiram

| [<img alt="murilohns" src="https://github.com/murilohns.png?size=115" width="115"><br><sub>@murilohns</sub>](https://github.com/murilohns) | [<img alt="LorhanSohaky" src="https://github.com/LorhanSohaky.png?size=115" width="115"><br><sub>@LorhanSohaky</sub>](https://github.com/LorhanSohaky) | [<img alt="CarlosZiegler" src="https://github.com/CarlosZiegler.png?size=115" width="115"><br><sub>@CarlosZiegler</sub>](https://github.com/CarlosZiegler) | [<img alt="WeslleyNasRocha" src="https://github.com/WeslleyNasRocha.png?size=115" width="115"><br><sub>@WeslleyNasRocha</sub>](https://github.com/WeslleyNasRocha) | [<img alt="paulo-santana" src="https://github.com/paulo-santana.png?size=115" width="115"><br><sub>@paulo-santana</sub>](https://github.com/paulo-santana) | [<img alt="kaiquemaia" src="https://github.com/kaiquemaia.png?size=115" width="115"><br><sub>@kaiquemaia</sub>](https://github.com/kaiquemaia) |
| :---: |:---: |:---: |:---: |:---: |:---: |
| [<img alt="paulogdm" src="https://github.com/paulogdm.png?size=115" width="115"><br><sub>@paulogdm</sub>](https://github.com/paulogdm) | [<img alt="ferrarienz0" src="https://github.com/ferrarienz0.png?size=115" width="115"><br><sub>@ferrarienz0</sub>](https://github.com/ferrarienz0) | [<img alt="RaphaelOliveiraMoura" src="https://github.com/RaphaelOliveiraMoura.png?size=115" width="115"><br><sub>@RaphaelOliveiraMoura</sub>](https://github.com/RaphaelOliveiraMoura) | [<img alt="lucasbastianik" src="https://github.com/lucasbastianik.png?size=115" width="115"><br><sub>@lucasbastianik</sub>](https://github.com/lucasbastianik) | [<img alt="samycici" src="https://github.com/samycici.png?size=115" width="115"><br><sub>@samycici</sub>](https://github.com/samycici) | [<img alt="allangrds" src="https://github.com/allangrds.png?size=115" width="115"><br><sub>@allangrds</sub>](https://github.com/allangrds) |
| [<img alt="danielramosbh74" src="https://github.com/danielramosbh74.png?size=115" width="115"><br><sub>@danielramosbh74</sub>](https://github.com/danielramosbh74) | [<img alt="pedrosancao" src="https://github.com/pedrosancao.png?size=115" width="115"><br><sub>@pedrosancao</sub>](https://github.com/pedrosancao) | [<img alt="marcosgarcez" src="https://github.com/marcosgarcez.png?size=115" width="115"><br><sub>@marcosgarcez</sub>](https://github.com/marcosgarcez) | [<img alt="cuducos" src="https://github.com/cuducos.png?size=115" width="115"><br><sub>@cuducos</sub>](https://github.com/cuducos) | [<img alt="eliseumds" src="https://github.com/eliseumds.png?size=115" width="115"><br><sub>@eliseumds</sub>](https://github.com/eliseumds) | [<img alt="matheusvellone" src="https://github.com/matheusvellone.png?size=115" width="115"><br><sub>@matheusvellone</sub>](https://github.com/matheusvellone) |
| [<img alt="mukaschultze" src="https://github.com/mukaschultze.png?size=115" width="115"><br><sub>@mukaschultze</sub>](https://github.com/mukaschultze) | [<img alt="BrunoS3D" src="https://github.com/BrunoS3D.png?size=115" width="115"><br><sub>@BrunoS3D</sub>](https://github.com/BrunoS3D) | [<img alt="FlavioAndre" src="https://github.com/FlavioAndre.png?size=115" width="115"><br><sub>@FlavioAndre</sub>](https://github.com/FlavioAndre) | [<img alt="victor-ccab" src="https://github.com/victor-ccab.png?size=115" width="115"><br><sub>@victor-ccab</sub>](https://github.com/victor-ccab) | [<img alt="leoferreiralima" src="https://github.com/leoferreiralima.png?size=115" width="115"><br><sub>@leoferreiralima</sub>](https://github.com/leoferreiralima) | [<img alt="matheuslcandido" src="https://github.com/matheuslcandido.png?size=115" width="115"><br><sub>@matheuslcandido</sub>](https://github.com/matheuslcandido) |
| [<img alt="rafamancan" src="https://github.com/rafamancan.png?size=115" width="115"><br><sub>@rafamancan</sub>](https://github.com/rafamancan) | [<img alt="josepholiveira" src="https://github.com/josepholiveira.png?size=115" width="115"><br><sub>@josepholiveira</sub>](https://github.com/josepholiveira) | [<img alt="juniorpb" src="https://github.com/juniorpb.png?size=115" width="115"><br><sub>@juniorpb</sub>](https://github.com/juniorpb) | [<img alt="caiangums" src="https://github.com/caiangums.png?size=115" width="115"><br><sub>@caiangums</sub>](https://github.com/caiangums) | [<img alt="lucas-eduardo" src="https://github.com/lucas-eduardo.png?size=115" width="115"><br><sub>@lucas-eduardo</sub>](https://github.com/lucas-eduardo) | [<img alt="Nikolassantos" src="https://github.com/Nikolassantos.png?size=115" width="115"><br><sub>@Nikolassantos</sub>](https://github.com/Nikolassantos) |
| [<img alt="otaciliolacerda" src="https://github.com/otaciliolacerda.png?size=115" width="115"><br><sub>@otaciliolacerda</sub>](https://github.com/otaciliolacerda) | [<img alt="paulosales" src="https://github.com/paulosales.png?size=115" width="115"><br><sub>@paulosales</sub>](https://github.com/paulosales) | [<img alt="evertoncastro" src="https://github.com/evertoncastro.png?size=115" width="115"><br><sub>@evertoncastro</sub>](https://github.com/evertoncastro) |

## Autores

| [<img src="https://github.com/filipedeschamps.png?size=115" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://github.com/lucianopf.png?size=115" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
