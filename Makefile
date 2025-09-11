# Makefile for Laravel Licitação Project
# This file provides convenient commands for Docker operations and development

.PHONY: help build run stop clean logs shell test lint format install dev prod deploy

# Default target
.DEFAULT_GOAL := help

# Variables
DOCKER_IMAGE_NAME = licitacao-project
DOCKER_CONTAINER_NAME = licitacao-app
DOCKER_COMPOSE_FILE = docker-compose.yml
REGISTRY = ghcr.io
GITHUB_REPO = $(shell git config --get remote.origin.url | sed 's/.*github.com[:/]\([^.]*\).*/\1/')

help: ## Show this help message
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Docker commands
build: ## Build the Docker image
	@echo "🏗️  Building Docker image..."
	docker build -t $(DOCKER_IMAGE_NAME) .

build-no-cache: ## Build the Docker image without cache
	@echo "🏗️  Building Docker image (no cache)..."
	docker build --no-cache -t $(DOCKER_IMAGE_NAME) .

run: ## Run the application with Docker
	@echo "🚀 Starting application container..."
	docker run -d \
		--name $(DOCKER_CONTAINER_NAME) \
		-p 8080:80 \
		-v $(PWD)/storage:/var/www/html/storage \
		-v $(PWD)/bootstrap/cache:/var/www/html/bootstrap/cache \
		--env-file .env.docker \
		$(DOCKER_IMAGE_NAME)
	@echo "✅ Application is running at http://localhost:8080"

stop: ## Stop the Docker container
	@echo "🛑 Stopping application container..."
	-docker stop $(DOCKER_CONTAINER_NAME)
	-docker rm $(DOCKER_CONTAINER_NAME)

restart: stop run ## Restart the Docker container

clean: ## Clean up Docker images and containers
	@echo "🧹 Cleaning up Docker resources..."
	-docker stop $(DOCKER_CONTAINER_NAME)
	-docker rm $(DOCKER_CONTAINER_NAME)
	-docker rmi $(DOCKER_IMAGE_NAME)
	docker system prune -f

# Docker Compose commands
up: ## Start services with Docker Compose
	@echo "🚀 Starting all services with Docker Compose..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d
	@echo "✅ Services are running at http://localhost:8080"

down: ## Stop services with Docker Compose
	@echo "🛑 Stopping all services..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

logs: ## Show application logs
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f app

logs-all: ## Show all services logs
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

shell: ## Access shell in running container
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app /bin/sh

# Development commands
install: ## Install dependencies locally
	@echo "📦 Installing PHP dependencies..."
	composer install
	@echo "📦 Installing Node.js dependencies..."
	npm install
	@echo "🔗 Generating Wayfinder types..."
	php artisan wayfinder:generate --with-form

dev: wayfinder ## Start development environment locally
	@echo "🔧 Starting development environment..."
	composer run dev

test: ## Run tests
	@echo "🧪 Running tests..."
	./vendor/bin/pest

test-docker: ## Run tests in Docker container
	@echo "🧪 Running tests in Docker container..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app ./vendor/bin/pest

lint: ## Run linting
	@echo "🔍 Running PHP linting..."
	./vendor/bin/pint
	@echo "🔍 Running JavaScript/TypeScript linting..."
	npm run lint

format: ## Format code
	@echo "✨ Formatting code..."
	./vendor/bin/pint
	npm run format

wayfinder: ## Generate Wayfinder TypeScript bindings
	@echo "🔗 Generating Wayfinder TypeScript bindings..."
	php artisan wayfinder:generate --with-form

# Production commands
prod: ## Build and run production container
	@echo "🏭 Building production image..."
	docker build -t $(DOCKER_IMAGE_NAME):prod \
		--build-arg APP_ENV=production \
		--build-arg APP_DEBUG=false .
	@echo "🚀 Starting production container..."
	docker run -d \
		--name $(DOCKER_CONTAINER_NAME)-prod \
		-p 80:80 \
		--env-file .env.docker \
		-e APP_ENV=production \
		-e APP_DEBUG=false \
		$(DOCKER_IMAGE_NAME):prod

# Registry commands
tag: ## Tag image for registry
	docker tag $(DOCKER_IMAGE_NAME) $(REGISTRY)/$(GITHUB_REPO):latest
	docker tag $(DOCKER_IMAGE_NAME) $(REGISTRY)/$(GITHUB_REPO):$(shell git rev-parse --short HEAD)

push: tag ## Push image to registry
	@echo "📤 Pushing image to registry..."
	docker push $(REGISTRY)/$(GITHUB_REPO):latest
	docker push $(REGISTRY)/$(GITHUB_REPO):$(shell git rev-parse --short HEAD)

pull: ## Pull image from registry
	@echo "📥 Pulling image from registry..."
	docker pull $(REGISTRY)/$(GITHUB_REPO):latest

deploy: pull ## Deploy from registry
	@echo "🚀 Deploying from registry..."
	-docker stop $(DOCKER_CONTAINER_NAME)
	-docker rm $(DOCKER_CONTAINER_NAME)
	docker run -d \
		--name $(DOCKER_CONTAINER_NAME) \
		-p 80:80 \
		--env-file .env.docker \
		--restart unless-stopped \
		$(REGISTRY)/$(GITHUB_REPO):latest

# Database commands
migrate: ## Run database migrations in container
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan migrate

migrate-fresh: ## Fresh database migration in container
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan migrate:fresh --seed

seed: ## Run database seeders in container
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan db:seed

# Cache commands
cache-clear: ## Clear all caches in container
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan cache:clear
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan config:clear
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan route:clear
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan view:clear

cache-warm: ## Warm up caches in container
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan config:cache
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan route:cache
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app php artisan view:cache

# Health check
health: ## Check application health
	@echo "🏥 Checking application health..."
	@curl -f http://localhost:8080/health || echo "❌ Health check failed"

status: ## Show container status
	@echo "📊 Container status:"
	@docker ps -a --filter name=$(DOCKER_CONTAINER_NAME)

# Utility commands
env-copy: ## Copy environment file for Docker
	cp .env.example .env.docker
	@echo "📝 .env.docker created. Please edit it with your Docker-specific settings."

backup-db: ## Backup database (SQLite)
	@echo "💾 Creating database backup..."
	docker-compose -f $(DOCKER_COMPOSE_FILE) exec app cp /var/www/html/database/database.sqlite /var/www/html/storage/backups/database-$(shell date +%Y%m%d-%H%M%S).sqlite

# Documentation
docs: ## Generate documentation
	@echo "📚 Generating documentation..."
	@echo "Project: Laravel Licitação System"
	@echo "Docker Image: $(DOCKER_IMAGE_NAME)"
	@echo "Registry: $(REGISTRY)/$(GITHUB_REPO)"
	@echo "Ports: 8080 (development), 80 (production)"

version: ## Show version information
	@echo "🏷️  Version Information:"
	@echo "Git commit: $(shell git rev-parse --short HEAD)"
	@echo "Git branch: $(shell git rev-parse --abbrev-ref HEAD)"
	@echo "Docker image: $(DOCKER_IMAGE_NAME)"
