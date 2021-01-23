# :link: Como contribuir

Qualquer ajuda que agregue valor ao projeto, seja na edição do código-fonte ou nas documentações, e consequentemente a vida das pessoas é muito bem-vindo, por isso decidimos torna-lo opensource.

## Iniciando

Certifique-se de estar na pasta raiz do projeto para executar:

```npm install```

```npm run dev``` - nextjs local

```npm run fix```- ESLint

Como uma das coisas mais interessantes deste projeto é justamente a promessa da Vercel de eliminar (ou pelo menos minimizar) a necessidade de programadores se preocuparem tanto em configurarem uma infraestrutura local para poderem focar mais no código em si, como podemos fazer em algumas IDEs online (ex. Codepen), estaremos mostrando como contribuir das 2 formas: trabalhando localmente x online.


### **Docker**

Ola a todos, o projecto agora tem uma Dockerimage, que pode facilitar o seu uso. E garantir a uniformidade da aplicação em diversos computadores. Já que uns usam MAC, Linux e Windows. 
Para fazer uso do docker tem dois comandos:

**DEV** -> Faz **build** da applicação e executa o '**npm run dev**'.

```
docker build -t brasil-api:1.0.0-local .
docker run --entrypoint=ash -e ENV NODE_ENV='development' -p 3000:3000 brasil-api:1.0.0-local -c 'npm run dev'
```

**PRD**
```
docker build -t brasil-api:1.0.0 .
docker run -p 3000:3000 brasil-api:1.0.0
```

**PS.:** Caso tenha o *make* na sua maquina pode simplesmente correr os comandos.:

*DEV*

```
    make local 
```

*PRD*

```
    make docker 
``` 

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
