FROM php:8.2-fpm-alpine

# Passo 1: Instala as dependências do sistema (ferramentas de build e do postgresql)
# ANTES de tentar instalar a extensão do PHP.
RUN apk add --no-cache --update $PHPIZE_DEPS postgresql-dev

# Passo 2: Agora sim, instala as extensões do PHP, pois os pré-requisitos já estão no sistema.
RUN docker-php-ext-install pdo pdo_pgsql