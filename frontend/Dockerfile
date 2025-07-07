# Estágio 1: Build do Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Deixa o Docker instalar as dependências no ambiente Linux dele
RUN npm install
COPY . .
# Roda o build de produção
RUN npm run build

# Estágio 2: Servir os arquivos com Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/frontend-app/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80