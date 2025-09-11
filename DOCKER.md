# 🐳 Docker Container Documentation

This document provides comprehensive information about containerizing and deploying the Sistema de Licitações using Docker following OCI (Open Container Initiative) standards.

## 📋 Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Container Architecture](#container-architecture)
- [Building Images](#building-images)
- [Running Containers](#running-containers)
- [Docker Compose](#docker-compose)
- [Production Deployment](#production-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Environment Variables](#environment-variables)
- [Health Checks](#health-checks)
- [Troubleshooting](#troubleshooting)
- [Security](#security)

## 🔍 Overview

The Sistema de Licitações is containerized using a multi-stage Docker build that creates optimized, secure, and production-ready container images. The container includes:

- **PHP 8.4-FPM** for backend processing
- **Nginx** as the web server
- **Node.js** for frontend asset building
- **Supervisor** for process management
- **SQLite** as the default database (configurable for PostgreSQL)

### Key Features

- ✅ **OCI Compliant**: Follows Open Container Initiative standards
- ✅ **Multi-stage Build**: Optimized for size and security
- ✅ **Multi-platform**: Supports AMD64 and ARM64 architectures
- ✅ **Security Hardened**: Non-root user, minimal attack surface
- ✅ **Health Checks**: Built-in application health monitoring
- ✅ **Automated CI/CD**: GitHub Actions for building and deployment

## 🚀 Quick Start

### Prerequisites

- Docker 24.0+ installed
- Docker Compose 2.0+ (optional, for development)
- Git for cloning the repository

### 1. Clone and Build

```bash
# Clone the repository
git clone https://github.com/your-username/licitacao-project.git
cd licitacao-project

# Build the Docker image
docker build -t licitacao-project .
```

### 2. Run with Docker

```bash
# Create environment file
cp .env.example .env.docker

# Run the container
docker run -d \
  --name licitacao-app \
  -p 8080:80 \
  --env-file .env.docker \
  licitacao-project
```

### 3. Access the Application

Open your browser and navigate to: http://localhost:8080

## 🏗️ Container Architecture

### Multi-stage Build Process

```
┌─────────────────────┐    ┌─────────────────────┐    ┌─────────────────────┐
│  Frontend Builder   │ => │    PHP Base         │ => │  Production Image   │
│  Node.js 22-alpine  │    │  PHP 8.4-FPM-alpine│    │   Final Container   │
│  - Build React/TS   │    │  - Install deps     │    │   - Nginx + PHP-FPM │
│  - Compile assets   │    │  - Configure PHP    │    │   - Supervisor      │
└─────────────────────┘    └─────────────────────┘    └─────────────────────┘
```

### Container Structure

```
/var/www/html/                 # Application root
├── app/                       # Laravel application
├── public/                    # Web root with built assets
│   └── build/                 # Compiled frontend assets
├── storage/                   # Storage directory (volume mounted)
├── bootstrap/cache/           # Bootstrap cache (volume mounted)
└── database/database.sqlite   # SQLite database

/etc/nginx/nginx.conf          # Nginx configuration
/usr/local/etc/php-fpm.d/      # PHP-FPM configuration
/etc/supervisord.conf          # Supervisor configuration
/usr/local/bin/start.sh        # Container startup script
```

## 🔨 Building Images

### Basic Build

```bash
# Build with default settings
docker build -t licitacao-project .

# Build without cache
docker build --no-cache -t licitacao-project .

# Build for specific platform
docker build --platform linux/amd64 -t licitacao-project .
```

### Build Arguments

```bash
# Build with custom environment
docker build \
  --build-arg APP_ENV=production \
  --build-arg APP_DEBUG=false \
  -t licitacao-project:prod .
```

### Using Makefile

```bash
# Build image
make build

# Build without cache
make build-no-cache

# Build production image
make prod
```

## 🏃 Running Containers

### Development Mode

```bash
# Run with volume mounts for development
docker run -d \
  --name licitacao-dev \
  -p 8080:80 \
  -v $(pwd)/storage:/var/www/html/storage \
  -v $(pwd)/bootstrap/cache:/var/www/html/bootstrap/cache \
  --env-file .env.docker \
  licitacao-project
```

### Production Mode

```bash
# Run production container
docker run -d \
  --name licitacao-prod \
  -p 80:80 \
  --restart unless-stopped \
  -e APP_ENV=production \
  -e APP_DEBUG=false \
  -e APP_KEY=your-production-key \
  --env-file .env.docker \
  licitacao-project
```

### With External Database

```bash
# Run with PostgreSQL
docker run -d \
  --name licitacao-app \
  -p 8080:80 \
  -e DB_CONNECTION=pgsql \
  -e DB_HOST=your-postgres-host \
  -e DB_DATABASE=licitacao \
  -e DB_USERNAME=your-db-user \
  -e DB_PASSWORD=your-db-password \
  --env-file .env.docker \
  licitacao-project
```

## 🐳 Docker Compose

### Development Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Services Included

- **app**: Main Laravel application
- **redis**: Redis cache and session storage
- **postgres**: PostgreSQL database (optional)

### Compose Commands

```bash
# Build and start
docker-compose up -d --build

# Run commands in container
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed

# Scale services
docker-compose up -d --scale app=3
```

## 🚀 Production Deployment

### Using Pre-built Images

```bash
# Pull from GitHub Container Registry
docker pull ghcr.io/your-username/licitacao-project:latest

# Run production container
docker run -d \
  --name licitacao-production \
  -p 80:80 \
  --restart unless-stopped \
  --env-file .env.production \
  ghcr.io/your-username/licitacao-project:latest
```

### Docker Swarm Deployment

```yaml
# docker-stack.yml
version: '3.8'
services:
  app:
    image: ghcr.io/your-username/licitacao-project:latest
    ports:
      - "80:80"
    environment:
      - APP_ENV=production
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
      restart_policy:
        condition: on-failure
```

```bash
# Deploy stack
docker stack deploy -c docker-stack.yml licitacao
```

### Kubernetes Deployment

```yaml
# k8s-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: licitacao-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: licitacao
  template:
    metadata:
      labels:
        app: licitacao
    spec:
      containers:
      - name: app
        image: ghcr.io/your-username/licitacao-project:latest
        ports:
        - containerPort: 80
        env:
        - name: APP_ENV
          value: production
---
apiVersion: v1
kind: Service
metadata:
  name: licitacao-service
spec:
  selector:
    app: licitacao
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The project includes automated CI/CD with GitHub Actions:

- **Testing**: Runs PHP tests and code quality checks
- **Security Scanning**: Vulnerability scanning with Trivy
- **Multi-platform Build**: Builds for AMD64 and ARM64
- **Registry Push**: Pushes to GitHub Container Registry
- **SBOM Generation**: Creates Software Bill of Materials

### Workflow Triggers

- Push to `main` or `develop` branches
- Pull requests
- Manual workflow dispatch
- Git tags (for versioned releases)

### Available Images

```bash
# Latest from main branch
ghcr.io/your-username/licitacao-project:latest

# Development branch
ghcr.io/your-username/licitacao-project:develop

# Specific versions
ghcr.io/your-username/licitacao-project:v1.0.0

# Commit-specific
ghcr.io/your-username/licitacao-project:main-abc1234
```

## 🔧 Environment Variables

### Required Variables

```bash
APP_NAME="Sistema de Licitações"
APP_ENV=production
APP_KEY=base64:your-32-character-secret-key
APP_DEBUG=false
APP_URL=https://your-domain.com
```

### Database Configuration

```bash
# SQLite (default)
DB_CONNECTION=sqlite
DB_DATABASE=/var/www/html/database/database.sqlite

# PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=your-postgres-host
DB_PORT=5432
DB_DATABASE=licitacao
DB_USERNAME=your-username
DB_PASSWORD=your-password
```

### Cache and Session

```bash
# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Security Settings

```bash
SESSION_SECURE_COOKIE=true
SANCTUM_STATEFUL_DOMAINS=your-domain.com
TRUSTED_PROXIES=*
```

## 🏥 Health Checks

### Built-in Health Check

The container includes a health check endpoint at `/health`:

```bash
# Test health check
curl -f http://localhost:8080/health
```

### Docker Health Check

```bash
# Check container health
docker ps --filter name=licitacao-app

# View health check logs
docker inspect licitacao-app | jq '.[0].State.Health'
```

### Custom Health Checks

```bash
# Application-specific checks
docker exec licitacao-app php artisan health:check

# Database connectivity
docker exec licitacao-app php artisan migrate:status
```

## 🔍 Troubleshooting

### Common Issues

#### Container Won't Start

```bash
# Check container logs
docker logs licitacao-app

# Check specific service logs
docker exec licitacao-app tail -f /var/log/nginx/error.log
docker exec licitacao-app tail -f /var/log/php-fpm.log
```

#### Permission Issues

```bash
# Fix storage permissions
docker exec licitacao-app chown -R www:www /var/www/html/storage
docker exec licitacao-app chmod -R 775 /var/www/html/storage
```

#### Database Issues

```bash
# Run migrations
docker exec licitacao-app php artisan migrate

# Check database connection
docker exec licitacao-app php artisan tinker --execute="DB::connection()->getPdo();"
```

#### Memory Issues

```bash
# Check memory usage
docker stats licitacao-app

# Increase PHP memory limit
docker run -e PHP_MEMORY_LIMIT=512M licitacao-project
```

### Debug Mode

```bash
# Run container in debug mode
docker run -it \
  -e APP_DEBUG=true \
  -e LOG_LEVEL=debug \
  licitacao-project
```

### Interactive Debugging

```bash
# Access container shell
docker exec -it licitacao-app /bin/sh

# Run Laravel commands
docker exec licitacao-app php artisan route:list
docker exec licitacao-app php artisan config:show
```

## 🔒 Security

### Security Features

- **Non-root User**: Container runs as `www` user (UID 1000)
- **Minimal Base**: Alpine Linux reduces attack surface
- **Security Headers**: Nginx configured with security headers
- **Rate Limiting**: Built-in request rate limiting
- **Vulnerability Scanning**: Automated security scanning in CI/CD

### Security Best Practices

#### 1. Use Secrets Management

```bash
# Use Docker secrets
echo "your-app-key" | docker secret create app_key -

# Reference in compose
services:
  app:
    secrets:
      - app_key
    environment:
      - APP_KEY_FILE=/run/secrets/app_key
```

#### 2. Network Security

```bash
# Create custom network
docker network create licitacao-network

# Run with custom network
docker run --network licitacao-network licitacao-project
```

#### 3. Resource Limits

```bash
# Limit resources
docker run \
  --memory="512m" \
  --cpus="1.0" \
  --ulimit nofile=1024:1024 \
  licitacao-project
```

#### 4. Read-only Root Filesystem

```bash
# Run with read-only filesystem
docker run \
  --read-only \
  --tmpfs /tmp \
  --tmpfs /var/run \
  --tmpfs /var/cache/nginx \
  licitacao-project
```

### Security Scanning

```bash
# Scan image for vulnerabilities
trivy image licitacao-project

# Scan filesystem
trivy fs .

# Generate security report
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(pwd):/tmp/app \
  aquasec/trivy:latest image licitacao-project
```

## 📊 Monitoring

### Container Metrics

```bash
# Monitor resource usage
docker stats licitacao-app

# Export metrics (with Prometheus)
docker run -d \
  --name prometheus-exporter \
  -p 9323:9323 \
  prom/container-exporter
```

### Log Management

```bash
# Configure log driver
docker run \
  --log-driver=json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  licitacao-project

# Send logs to external system
docker run \
  --log-driver=syslog \
  --log-opt syslog-address=tcp://your-log-server:514 \
  licitacao-project
```

## 🛠️ Development Tools

### Makefile Commands

```bash
make help           # Show available commands
make build          # Build Docker image
make run            # Run container
make up             # Start with Docker Compose
make down           # Stop Docker Compose
make logs           # View logs
make shell          # Access container shell
make test-docker    # Run tests in Docker
make clean          # Clean up resources
```

### IDE Integration

#### VS Code with Remote Containers

```json
// .devcontainer/devcontainer.json
{
  "name": "Licitacao Development",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/var/www/html",
  "extensions": [
    "ms-vscode.vscode-json",
    "bmewburn.vscode-intelephense-client"
  ]
}
```

---

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/best-practices/)
- [OCI Specification](https://opencontainers.org/)
- [Laravel Deployment](https://laravel.com/docs/deployment)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PHP-FPM Configuration](https://www.php.net/manual/en/install.fpm.configuration.php)

## 🆘 Support

For issues related to containerization:

1. Check the [troubleshooting section](#troubleshooting)
2. Review container logs: `docker logs licitacao-app`
3. Open an issue on GitHub with container logs and system information
4. Contact the development team

---

**Built with ❤️ for efficient containerized deployment**