## :link: Como contribuir

### Modo 1 - Editar localmente e fazer o upload com sincronização do Git com o Github

Qualquer ajuda que agregue valor ao projeto, seja na edição do código-fonte ou nas documentações, e consequentemente a vida das pessoas é muito bem vindo, por isso decidimos torna-lo opensource.

- Faça um Fork desse repositório,
- Faça um clone do respositório criado a partir do fork: `git clone https://github.com/seuusuario/BrasilAPI.git`
- Crie uma branch com a sua feature: `git checkout -b my-feature`
- Commit suas mudanças: `git commit -m 'feat: My new feature'`
- Push a sua branch: `git push origin my-feature`
- Ir em [Pull Requests](https://github.com/BrasilAPI/BrasilAPI/pulls) do projeto original e criar uma pull request com o seu commit

### Manter o fork atualizado:

- Clone o repositório:
`git clone https://github.com/seuusuario/BrasilAPI.git`
- Adicione um remote para o repositório original:
`git remote add meufork https://github.com/seuusuario/BrasilAPI.git` (*meufork é um fork genérico, podendo ser qualquer nome*)
- Atualize o remote meufork
`git fetch meufork`
- Faça o rebase do master com o master do meufork
`git rebase meufork/master`

Pronto, o repositório está atualizado. Para atualizar a minha branch master com o repositório original:

``` git fetch meufork ```

``` git rebase meufork/master```

Para fazer o push do repositório:

`git push origin master`


### Modo 2 - Após o fork do repositório, editar diretamente os códigos-fonte aqui no Github online mesmo e/ou usando uma IDE online (ex. Codepen) para auxiliá-lo


### Iniciando:
Certifique-se de estar na pasta raíz do projeto

```npm install```

```npm run dev``` - nextjs local

```npm run fix```- ESLint


Independente do tipo de contribuição a ser feita (no código-fonte e/ou na documentação), operacionalmente falando, temos 2 formas de fazermos as pull requests: localmente, via linha de comando, usando o Git em conjunto com o Github, ou online, editando diretamente os arquivos no Github e solicitando uma pull request depois, tudo graficamente.

Como uma das coisas mais interessantes deste projeto é justamente a promessa da Vercel de eliminar (ou pelo menos minimizar) a necessidade de programadores se preocuparem tanto em configurarem uma infraestrutura local para poderem focar mais no código em si, como podemos fazer em algumas IDEs online (ex. Codepen), estaremos mostrando como contribuir das 2 formas: trabalhando localmente x online.
