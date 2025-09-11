# Multi-stage Dockerfile for Laravel React Application
# Stage 1: PHP Setup and Wayfinder Generation
FROM php:8.4-fpm-alpine AS php-wayfinder

# Create non-root user first
RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -D -S -G www www

# Install system dependencies needed for Laravel
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite \
    sqlite-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite gd xml mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create application directory
WORKDIR /var/www/html

# Copy composer files first for better layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies (with dev dependencies for artisan commands)
RUN composer install --optimize-autoloader --no-scripts --no-interaction

# Copy Laravel application files
COPY --chown=www:www . .

# Create environment file from example
RUN cp .env.example .env

# Run composer post-install scripts
RUN composer run-script post-autoload-dump

# Generate Laravel app key for wayfinder generation
RUN php artisan key:generate --force

# Create SQLite database and run migrations for wayfinder generation
RUN mkdir -p database && \
    touch database/database.sqlite && \
    chmod 664 database/database.sqlite && \
    php artisan migrate --force

# Generate Wayfinder types with form variants
RUN php artisan wayfinder:generate --with-form

# Stage 2: Frontend Build
FROM node:22-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node dependencies (including dev dependencies for build)
RUN npm ci

# Copy frontend source files
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.ts ./
COPY tsconfig.json ./

# Copy generated Wayfinder types from previous stage
COPY --from=php-wayfinder /var/www/html/resources/js/wayfinder ./resources/js/wayfinder
COPY --from=php-wayfinder /var/www/html/resources/js/actions ./resources/js/actions
COPY --from=php-wayfinder /var/www/html/resources/js/routes.ts ./resources/js/routes.ts

# Build frontend assets
RUN npm run build

# Stage 3: Production PHP Application
FROM php:8.4-fpm-alpine AS php-base

# Create non-root user first
RUN addgroup -g 1000 -S www && \
    adduser -u 1000 -D -S -G www www

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    sqlite \
    sqlite-dev \
    nginx \
    supervisor \
    oniguruma-dev \
    netcat-openbsd

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_sqlite gd xml mbstring

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Create application directory
WORKDIR /var/www/html

# Copy composer files first for better layer caching
COPY composer.json composer.lock ./

# Install PHP dependencies (production only)
RUN composer install --optimize-autoloader --no-dev --no-scripts --no-interaction

# Copy application files from wayfinder stage (includes generated types)
COPY --from=php-wayfinder --chown=www:www /var/www/html .

# Copy built frontend assets
COPY --from=frontend-builder --chown=www:www /app/public/build ./public/build

# Create required directories and set permissions
RUN mkdir -p /var/www/html/storage/logs \
    && mkdir -p /var/www/html/storage/framework/{cache,sessions,views} \
    && mkdir -p /var/www/html/bootstrap/cache \
    && mkdir -p /var/log/supervisor \
    && mkdir -p /run/nginx \
    && touch /var/log/nginx/access.log \
    && touch /var/log/nginx/error.log \
    && chown -R www:www /var/www/html/storage \
    && chown -R www:www /var/www/html/bootstrap/cache \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/php-fpm.conf /usr/local/etc/php-fpm.d/www.conf
COPY docker/supervisord.conf /etc/supervisord.conf
COPY docker/start.sh /usr/local/bin/start.sh

# Create SQLite database if it doesn't exist
RUN touch /var/www/html/database/database.sqlite \
    && chown www:www /var/www/html/database/database.sqlite

# Make startup script executable
RUN chmod +x /usr/local/bin/start.sh

# Run composer post-install scripts
RUN composer run-script post-autoload-dump

# Switch to non-root user for security
USER www

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Switch back to root for supervisor
USER root

# Start with initialization script
CMD ["/usr/local/bin/start.sh"]
