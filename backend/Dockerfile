# Estágio 1: Build da Aplicação
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Imagem Final de Produção
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/uploads ./uploads
# A LINHA QUE FALTAVA: Copia o script do seeder para a imagem final
COPY --from=builder /app/seed.js ./

EXPOSE 8000
CMD [ "node", "dist/index.js" ]