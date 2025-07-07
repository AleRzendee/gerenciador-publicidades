# Estágio 1: Build do Angular
FROM node:20-alpine AS build
RUN apk upgrade --no-cache
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servir os arquivos com Nginx
FROM nginx:stable-alpine
# AQUI ESTÁ A CORREÇÃO: o caminho correto é /app/dist/frontend-app
COPY --from=build /app/dist/frontend-app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80