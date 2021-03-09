# :link: Como contribuir

Qualquer ajuda que agregue valor ao projeto, seja na edição do código-fonte ou nas documentações, e consequentemente a vida das pessoas é muito bem-vindo, por isso decidimos torna-lo opensource.

## Iniciando

Certifique-se de estar na pasta raiz do projeto para executar:

```npm install```

```npm run dev``` - nextjs local

```npm run fix``` - ESLint

## Mensagens de commit

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

Sugerimos que as mensagens de commit sigam o padrão do _conventional commit_.

Execute `npm run commit` para ter um painel interativo que permite seguir o padrão de commit de forma fácil.

Para saber mais, acesse esses links:
- [Especificação do Conventional Commit](https://www.conventionalcommits.org/)
- [Regras do @commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional).

## Pull requests (PRs)

Independente da contribuição a ser feita (no código-fonte e/ou na documentação), operacionalmente falando, temos 2 formas de fazermos as *pull requests*: localmente, via linha de comando, usando o Git em conjunto com o Github, ou online, editando diretamente os arquivos no Github e solicitando uma pull request depois, tudo graficamente.

Como uma das coisas mais interessantes deste projeto é justamente a promessa da Vercel de eliminar (ou pelo menos minimizar) a necessidade de programadores se preocuparem tanto em configurarem uma infraestrutura local para poderem focar mais no código, como podemos fazer em algumas IDEs online (ex. Codepen), estaremos mostrando como contribuir das 2 formas: trabalhando localmente x online.

## Edição local do código

Consiste em realizar o *fork* do repositório raiz, cloná-lo, realizar a alteração e solicitar o PR para o repositório raiz.

### Realizando PRs para o repositório raiz

- Faça um *fork* desse repositório no Github
- Faça um clone do respositório *fork* criado: `git clone https://github.com/seuusuario/BrasilAPI.git`
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
- Atualize sua branch com as alterações da master do repositório raiz
`git pull --rebase reporaiz master`
- Atualize o sua *branch* remota
`git push origin mybranch`
- Caso ocorra algum conflito ao fazer o `push`, você pode utilizar o comando
`git push origin --force-with-lease`.
