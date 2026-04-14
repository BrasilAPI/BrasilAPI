# :link: Como contribuir

## Princípios do projeto

- **Open-source e sem financiamento:** O BrasilAPI não tem custos de infraestrutura e deve permanecer assim. Nenhum endpoint pode depender de banco de dados próprio, storage ou qualquer serviço pago. Todos os dados devem vir de fontes públicas e gratuitas.
- **API pública em produção:** O projeto é usado por milhares de desenvolvedores e empresas. Mudanças devem ser feitas com cuidado para não quebrar integrações existentes.
- **Comunidade:** Qualquer contribuição que agregue valor é bem-vinda, desde que siga estes princípios.

**Antes de iniciar o desenvolvimento recomendamos a leitura do nosso [Guia de Boas Práticas](GOOD_PRACTICES.md)**

## Iniciando

Certifique-se de estar na pasta raiz do projeto para executar:

```npm install```

```npm run dev``` - nextjs local

```npm run fix``` - ESLint

Para criar um novo endpoint do zero, siga o [Guia de Criação de Endpoints](docs/ENDPOINT_GUIDE.md).

## Mensagens de commit

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Sugerimos que as mensagens de commit sigam o padrão do _conventional commit_.

Execute `npm run commit` para ter um painel interativo que permite seguir o padrão de commit de forma fácil.

Para saber mais, acesse esses links:
- [Especificação do Conventional Commit](https://www.conventionalcommits.org/)
- [Regras do @commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).

## Documentação dos Endpoints
Se possível, além do endpoint crie também a documentação para o mesmo, utilizamos uma implementação básica da [OpenAPI 3.0](https://swagger.io/docs/specification/about/) em **json**.
A fim de facilitar a contribuição e evitar conflitos, modularizamos a documentação dos endpoints, assim temos arquivos mais objetivos e enxutos.
### Como criar a documentação
1- Acesse o diretório [`docs/doc`](pages/docs/doc);
2- Crie um arquivo json com o nome do módulo que está criando e utilize a estrutura básica da OpenAPI, recomendamos as seguintes seções:
    - TAGS
    - paths (obrigatório)
    - components -> schemas
    Caso tenha dificuldades com a criação do json, crie uma cópia do arquivo endpoint.json.example com o nome do seu endpoint, remova a extensão `.example` do arquivo, e edite as informações que existem nele para ajustá-lo ao seu módulo.


Para mensagens de erro utilize o schema pré-existente `ErrorMessage`
**Ex.: **

    "404": {
         "description": "Todos os serviços de CEP retornaram erro.",
         "content": {
             "application/json": {
                 "schema": {
                     "$ref": "#/components/schemas/ErrorMessage"
                 }
             }
         }
     }

## Compatibilidade de API

A BrasilAPI é usada em produção por milhares de aplicações. **Nunca** faça as seguintes mudanças em endpoints existentes:

- Remover ou renomear campos da resposta
- Mudar o tipo de um campo (`string` → `number`, etc.)
- Alterar a URL de um endpoint existente
- Mudar códigos de status HTTP de respostas de sucesso

Se sua mudança exige qualquer um desses itens → crie uma nova versão do endpoint (`/v2`, `/v3`), mantendo a versão anterior funcionando.

Adicionar novos campos opcionais ou criar novos endpoints é sempre compatível e não requer nova versão.

Para um guia completo com exemplos, consulte [docs/ENDPOINT_GUIDE.md](docs/ENDPOINT_GUIDE.md).

## Pull requests (PRs)

Independente da contribuição a ser feita (no código-fonte e/ou na documentação), operacionalmente falando, temos 2 formas de fazermos as *pull requests*: localmente, via linha de comando, usando o Git em conjunto com o Github, ou online, editando diretamente os arquivos no Github e solicitando uma pull request depois, tudo graficamente.

Caso desenvolvendo localmente você precisara usar alguma versão mais recente do NodeJS para usar o NPM como gerenciador de pacotes, para instalar em seu sistema operacional basta acessar o [guia de instalação](https://nodejs.org/en/download/) caso ja tenha instalado prossiga.

Como uma das coisas mais interessantes deste projeto é justamente a promessa da Vercel de eliminar (ou pelo menos minimizar) a necessidade de programadores se preocuparem tanto em configurarem uma infraestrutura local para poderem focar mais no código, como podemos fazer em algumas IDEs online (ex. Codepen), estaremos mostrando como contribuir das 2 formas: trabalhando localmente x online.

## Edição local do código

Consiste em realizar o *fork* do repositório raiz, cloná-lo, realizar a alteração e solicitar o PR para o repositório raiz.

### Realizando PRs para o repositório raiz

- Faça um *fork* desse repositório no Github
- Faça um clone do repositório *fork* criado: `git clone https://github.com/seuusuario/BrasilAPI.git`
- Crie uma *branch* para *commitar* a sua *feature* ou correção: `git checkout -b my-branch`
- Faça o *commit* das mudanças: `git commit -m 'feat: My new feature'`
- Faça o *push* da sua *branch* para o seu *fork*: `git push origin my-branch`
- Vá para [Pull Requests](https://github.com/BrasilAPI/BrasilAPI/pulls) do repositório raiz e crie um PR com o(s) seu(s) *commit(s)*

### Manter sua *branch* atualizada com o repositório raiz

- Caso ainda não tenha o clone do seu *fork* localmente, crie-o com:
`git clone https://github.com/seuusuario/BrasilAPI.git`
- Adicione um remote para o repositório raiz:
`git remote add reporaiz https://github.com/BrasilAPI/BrasilAPI.git` (*reporaiz* apelido para o repositório raiz da API. Você pode usar qualquer nome*)
- Atualize o seu repositório local a partir do remote do repositório raiz
`git fetch reporaiz`
- Vá para sua branch:
`git checkout my-branch`
- Atualize sua branch com as alterações da main do repositório raiz
`git pull --rebase reporaiz main`
- Atualize a sua *branch* remota
`git push origin mybranch`
- Caso ocorra algum conflito ao fazer o `push`, você pode utilizar o comando
`git push origin --force-with-lease`.
