#!/bin/sh

set -e

mkdir -p \
    /var/www/html/storage/app/private \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/views \
    /var/www/html/bootstrap/cache

chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R ug+rwX /var/www/html/storage /var/www/html/bootstrap/cache

if [ "${RUN_FRESH:-false}" = "true" ]; then
    php artisan migrate:fresh --seed --force
else
    php artisan migrate --force
fi

if [ "$#" -eq 1 ]; then
    exec sh -c "$1"
fi

exec "$@"