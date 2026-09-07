FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
        postgresql-dev \
        libzip-dev \
        libpng-dev \
        libjpeg-turbo-dev \
        freetype-dev \
        oniguruma-dev \
        icu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        bcmath \
        pcntl \
        zip \
        gd \
        mbstring \
        intl \
        opcache

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY docker/entrypoint.sh /usr/local/bin/taskly-entrypoint

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN composer install --optimize-autoloader --no-interaction --prefer-dist \
    && chown -R www-data:www-data storage bootstrap/cache \
    && find storage bootstrap/cache -type d -exec chmod 0770 {} + \
    && find storage bootstrap/cache -type f -exec chmod 0660 {} + \
    && sed -i 's/\r$//' /usr/local/bin/taskly-entrypoint \
    && chmod +x /usr/local/bin/taskly-entrypoint

EXPOSE 9000

ENTRYPOINT ["taskly-entrypoint"]
CMD ["php-fpm"]
