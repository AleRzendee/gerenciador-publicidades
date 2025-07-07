# Estágio 1: Build da Aplicação
FROM node:20-alpine AS builder
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Imagem Final de Produção
FROM node:20-alpine
RUN apk upgrade --no-cache
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads

EXPOSE 8000
CMD [ "node", "dist/index.js" ]