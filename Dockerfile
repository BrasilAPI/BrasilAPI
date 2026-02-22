# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código fonte
COPY . .

# Gerar build do Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Variáveis de ambiente
ARG ENVIRONMENT=production
ENV ENVIRONMENT=${ENVIRONMENT}
ENV NODE_ENV=production

# Copiar node_modules e build do stage anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Exposição de porta
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/status', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando de inicialização
CMD ["npm", "start"]
