#!/bin/sh

# Docker container startup script for Laravel application
set -e

echo "🚀 Starting Laravel application container..."

# Wait for dependencies to be ready
if [ -n "$DB_HOST" ] && [ "$DB_CONNECTION" != "sqlite" ]; then
    echo "⏳ Waiting for database connection..."
    until nc -z "$DB_HOST" "${DB_PORT:-5432}"; do
        echo "Database is unavailable - sleeping"
        sleep 1
    done
    echo "✅ Database is ready!"
fi

if [ -n "$REDIS_HOST" ] && [ "$REDIS_HOST" != "127.0.0.1" ]; then
    echo "⏳ Waiting for Redis connection..."
    until nc -z "$REDIS_HOST" "${REDIS_PORT:-6379}"; do
        echo "Redis is unavailable - sleeping"
        sleep 1
    done
    echo "✅ Redis is ready!"
fi

# Ensure proper permissions
echo "🔧 Setting up permissions..."
chown -R www:www /var/www/html/storage
chown -R www:www /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage
chmod -R 775 /var/www/html/bootstrap/cache

# Create SQLite database if using SQLite and doesn't exist
if [ "$DB_CONNECTION" = "sqlite" ]; then
    if [ ! -f "$DB_DATABASE" ]; then
        echo "📁 Creating SQLite database..."
        touch "$DB_DATABASE"
        chown www:www "$DB_DATABASE"
    fi
fi

# Generate app key if not set
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    echo "🔑 Generating application key..."
    php artisan key:generate --force
fi

# Run database migrations if needed
echo "🔄 Running database migrations..."
php artisan migrate --force

# Clear and cache configuration for production
if [ "$APP_ENV" = "production" ]; then
    echo "⚡ Optimizing for production..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
else
    echo "🔧 Setting up for development..."
    php artisan config:clear
    php artisan route:clear
    php artisan view:clear
    php artisan cache:clear
fi

# Create storage link if it doesn't exist
if [ ! -L /var/www/html/public/storage ]; then
    echo "🔗 Creating storage link..."
    php artisan storage:link
fi

# Ensure log directory exists
mkdir -p /var/www/html/storage/logs

echo "✅ Laravel application is ready!"

# Start supervisor to manage nginx and php-fpm
exec /usr/bin/supervisord -c /etc/supervisord.conf
