#Imagem node 20> <22
FROM node:20-alpine

#Pasta de trabalho dentro do container
WORKDIR /app

#arquivos dependencia
COPY package*.json ./

#  Instalar dependencias
RUN npm install

#  Copiar o restante do código
COPY . .

#  Gerar o build do Next.js
RUN npm run build

#porta padrão da API
EXPOSE 3000

#Comando para iniciar a API
CMD ["npm", "start"]
