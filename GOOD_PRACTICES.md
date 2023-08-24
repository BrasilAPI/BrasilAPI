# Guia de boas práticas para contribuição!

Este documento visa orientar e direcionar novas contribuições de forma a permitir que o projeto entregue dados consistentes e em formatos padronizados e acessíveis para quaisquer linguagens que venham a fazer uso dos endpoints fornecidos.

Também tenta direcionar a boas práticas com relação a nomenclaturas de variáveis, métodos e serviços.

Neste guia utilizaremos o termo **deve** para padrões que são indispensáveis e o termo **deveria** para padrões desejáveis, mas não indispensáveis.

## Código fonte
- Variáveis, Classes, métodos e funções devem ter nomemclatura clara e condizente com a função da mesma
- Nomes de variáveis deveriam estar no padrão `camelCase`
- Nomes de Classe, métodos e funções deveriam utilizar o padrão `PascalCase`
- Camada de serviços e controllers devem estar separados e ter responsabilidades únicas
- Se uma função estiver muito complexa ou grande talvez seja interessante dividí-la em mais funções com responsabilidades menores.
- Para cada endpoint criado deve haver um teste e2e correspondente, caso necessário testes unitários poderão ser criados.
  

## Endpoints
- Os url's dos endpoints devem estar em idioma inglês.
- Os url's dos endpoints deveriam ser todos em letras minúsculas.
- Quaisquer alterações no url deve ser feito em uma nova versão da mesma, de modo a não quebrar o contrato existente hoje.
- Os endpoints devem refletir de forma clara o objetivo do mesmo, a fim de evitar confusões no acesso.
- Os endpoints devem fazer uso, exclusivamente, do verbo HTTP **GET**
- O endpoint deve retornar um código HTTP semanticamente de acordo com o resultado retornado (500, para erro, 400 para requisição mal formatada, etc)
	- Para maiores detalhes consulte [este link](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Status)

## Formatos de retorno
- O retorno do endpoint deve ser em formato **json** válido com charset **utf-8**.
- As propriedades retornadas devem utilizar o padrão *snake_case*.
- As propriedades retornadas que possuirem representação no idioma inglês deverão ser retornadasem inglês.
- As propriedades retornadas que não tenham representação no idioma inglês, por exemplo, CPF, CNPJ ou qualquer termo específico do português do Brasil, devem ser retornadas com o termo correspondente, também no padrão *snake_case*.
- Cada endpoint deve ter em seu retorno dados consistentes e normalizados conforme os padrões descritos abaixo:

### Datas
| Tipo de data | Formato requerido | Exemplos |
| -- | -- | -- |
| Data e hora | ISOString (*YYYY-MM-DDThh:mm:ss.sTZD*) | 2021-03-05T13:36Z <br>2021-03-05T13:36-03:00 |
| Data | DateOnly (*YY-MM-DD*) | 2021-03-05 |

##### Onde:
| | |
|--|--|
| YYYY | Ano com 4 dígitos|
| MM | Mês com dois dígitos |
| DD | Dia com dois dígitos  |
| hh | Hora com dois dígitos |
| mm | Minutos com dois dígitos |
| ss | Segundos com dois dígitos |
| s | Um ou mais dígitos representando frações de segundos |
| TZD | Designador de timezone <table><tbody><tr><th>Z</th><td>Hora Zulu (0)</td></tr><tr><th>+00:00</th><td> UTC + </td></tr><tr><th>-00:00</th><td> UTC -</td></tr></tbody></table>|

### Dados numéricos
- Valores numéricos devem ser retornados fora de strings
- Números em ponto flutuante (com decimais) devem ser retornados utilizando "**.**" (*ponto*) como separador de decimais.

**Alguns exemplos**
| Correto | Errado |
|--|--|
|5|~~"3"~~|
|3.14| ~~"6,2"~~|

### Moedas
- Retorno de números em formato monetário devem ser um objeto json contendo:
	- **symbol**: Símbolo da moeda
	- **isoCode**: Código ISO da moeda ([Referência](https://pt.wikipedia.org/wiki/ISO_4217))
	- **value**: Valor a ser expresso

**Exemplo de retorno**

    price: {
    	isoCode: "BRL",
    	symbol: "R$",
    	value: 123.35
    }

O retorno neste formato visa facilitar o tratamento dos dados pelo cliente, visto que, caso, se necessite dos valores separadamente para cálculos ou outras operações, não será necessário tratá-lo.

## Testes
- O teste deve ter descrição coerente com o que ele está testando
- O teste deve abranger cenários de erro causado pelo cliente (4xx)
- Caso os dados validados pelo testcase possam variar, dê preferência por testar o tipo do retorno em vez de testar um valor específico.
  - Exemplos de dados que podem variar nos testes:
    - Endereços;
    - Nomes;
    - Taxas e tarifas;
    - etc.
  - Nos casos onde o tipo será testado, pode-se usar: `expect.any(<tipo>)`, ex.: `cnpj: expect.any(String)`

## Documentação
- O endpoint desenvolvido deveria contar com uma atualização na documentação.
- As contribuições com a documentação devem ser feitas utilizando o arquivo [pages/docs/doc/endpoint.json.example ](https://github.com/BrasilAPI/BrasilAPI/tree/master/pages/docs/doc/endpoint.json.example)
- Uma cópia deste arquivo deverá ser gerada e editada seguindo o padrão do mesmo, contendo o(s) endpoint(s), schema do retorno/erro esperado, possíveis filtros e/ou parâmetros e os exemplos para os mesmos.
- Qualquer contribuição feita na documentação deve utilizar a especificação [OpenAPI 3.0](https://swagger.io/specification/)
Recomendamos o uso de editores como SwaggerUI, para facilitar o desenvolvimento da documentação.
