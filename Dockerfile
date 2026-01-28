# 1️⃣ Imagem base compatível com Node 20
FROM node:20-alpine

# 2️⃣ Pasta de trabalho dentro do container
WORKDIR /app

# 3️⃣ Copiar apenas os arquivos de dependência primeiro (cache de build)
COPY package*.json ./

# 4️⃣ Instalar dependências
RUN npm install

# 5️⃣ Copiar o restante do código
COPY . .

# 6️⃣ Gerar o build do Next.js
RUN npm run build

# 7️⃣ Expõe a porta padrão da API
EXPOSE 3000

# 8️⃣ Comando para iniciar a API
CMD ["npm", "start"]
