# Sistema de Licitações 📋

<div align="center">
  <p>
    <strong>Um sistema completo para gerenciamento de licitações e processos de compras públicas</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/Laravel-12.0-FF2D20?style=flat&logo=laravel" alt="Laravel">
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Inertia.js-2.0-9553E9?style=flat&logo=inertia" alt="Inertia.js">
    <img src="https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat&logo=tailwind-css" alt="Tailwind CSS">
  </p>
</div>

## 🚀 Sobre o Projeto

O Sistema de Licitações é uma aplicação web moderna desenvolvida para gerenciar processos de compras públicas, fornecedores, requisições e conferências de auditoria. Desenvolvido especificamente para o contexto brasileiro, o sistema oferece uma interface intuitiva e funcionalidades completas para organizações que necessitam gerenciar processos licitatórios de forma eficiente e transparente.

### ✨ Principais Funcionalidades

- **🏢 Gestão de Fornecedores**: Cadastro completo com validação de CNPJ, endereços e informações de contato
- **📄 Requisições de Compra**: Controle completo do ciclo de vida das requisições desde a criação até a concretização
- **🏛️ Órgãos Emitentes e Destinatários**: Gestão de organizações emissoras e destinatárias de requisições
- **🔍 Conferências e Auditoria**: Sistema de auditoria para validação de transações e conformidade
- **📊 Dashboard Interativo**: Visualização em tempo real de métricas e indicadores do sistema
- **📈 Relatórios Gerenciais**: Geração de relatórios detalhados para análise e tomada de decisão
- **👥 Gestão de Usuários**: Sistema completo de autenticação e autorização com diferentes níveis de acesso
- **⚙️ Configurações do Sistema**: Painel administrativo para configuração de parâmetros do sistema

## 🛠️ Tecnologias Utilizadas

### Backend
- **Laravel 12**: Framework PHP moderno com arquitetura robusta
- **PHP 8.4+**: Linguagem de programação com recursos modernos
- **MySQL/SQLite**: Sistema de gerenciamento de banco de dados
- **Laravel Sanctum**: Autenticação de API
- **Laravel Queue**: Sistema de filas para processamento assíncrono

### Frontend
- **React 19**: Biblioteca JavaScript para interfaces de usuário
- **TypeScript**: Tipagem estática para JavaScript
- **Inertia.js**: Framework full-stack que elimina a necessidade de APIs
- **Tailwind CSS 4**: Framework CSS utilitário para styling
- **Radix UI**: Componentes acessíveis e customizáveis
- **React Hook Form + Zod**: Validação de formulários robusta

### Ferramentas de Desenvolvimento
- **Vite**: Build tool e dev server ultrarrápido
- **ESLint + Prettier**: Linting e formatação de código
- **Pest**: Framework de testes para PHP
- **Laravel Pail**: Logging avançado
- **Concurrently**: Execução simultânea de processos de desenvolvimento

## 📋 Pré-requisitos

### Desenvolvimento Local
Antes de iniciar, certifique-se de ter as seguintes ferramentas instaladas:

- **PHP 8.4+** com extensões: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML
- **Composer 2.0+**
- **Node.js 22+** e **npm/yarn**
- **MySQL 8.0+** ou **SQLite 3**
- **Git**

### Usando Docker (Recomendado)
Para uma configuração mais simples e consistente:

- **Docker 24.0+**
- **Docker Compose 2.0+**

## 🚀 Instalação e Configuração

### Opção 1: Usando Docker (Recomendado) 🐳

#### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/licitacao-project.git
cd licitacao-project
```

#### 2. Configure o Ambiente
```bash
# Copie o arquivo de ambiente
cp .env.example .env

# Configure as variáveis para Docker no .env
# APP_ENV=production
# APP_DEBUG=false
# APP_KEY=base64:your-app-key-here
# DB_CONNECTION=sqlite
# DB_DATABASE=/var/www/html/database/database.sqlite
```

#### 3. Build e Execute com Docker Compose
```bash
# Build e iniciar os serviços
docker-compose up -d --build

# O aplicativo estará disponível em http://localhost:8080
```

#### 4. Configurar a Aplicação (primeira execução)
```bash
# Executar dentro do container
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
```

> **⚠️ IMPORTANTE: Configuração HTTPS para Produção**
> 
> Se você estiver implantando em produção atrás de um reverse proxy HTTPS (Traefik, nginx-proxy, Caddy, etc.), 
> você DEVE configurar as seguintes variáveis de ambiente no `docker-compose.yml`:
> 
> ```yaml
> environment:
>   - APP_FORCE_HTTPS=true
>   - APP_URL=https://seu-dominio.com
>   - ASSET_URL=https://seu-dominio.com
> ```
> 
> Isso evita erros de "Mixed Content" onde o navegador bloqueia recursos HTTP em páginas HTTPS.
> **Consulte [HTTPS-SETUP.md](HTTPS-SETUP.md) para instruções detalhadas.**

### Opção 2: Desenvolvimento Local

#### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/licitacao-project.git
cd licitacao-project
```

#### 2. Instale as Dependências PHP
```bash
composer install
```

#### 3. Instale as Dependências Node.js
```bash
npm install
```

#### 4. Configure o Ambiente
```bash
# Copie o arquivo de ambiente
cp .env.example .env

# Gere a chave da aplicação
php artisan key:generate

# Configure o banco de dados no arquivo .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=licitacao_system
# DB_USERNAME=seu_usuario
# DB_PASSWORD=sua_senha
```

#### 5. Execute as Migrações e Seeders
```bash
# Criar o banco de dados (SQLite)
touch database/database.sqlite

# Executar migrações
php artisan migrate

# Popular com dados de exemplo
php artisan db:seed
```

#### 6. Gerar os Tipos TypeScript (Wayfinder)
```bash
# Gerar bindings TypeScript para os controladores Laravel
php artisan wayfinder:generate --with-form
```

#### 7. Inicie o Ambiente de Desenvolvimento
```bash
# Opção 1: Usar o comando composer personalizado (recomendado)
composer run dev

# Opção 2: Executar manualmente
php artisan serve &
php artisan queue:work &
npm run dev
```

## 👤 Credenciais Padrão

Após executar os seeders, você pode acessar o sistema com as seguintes credenciais:

| Usuário | Email | Senha | Perfil |
|---------|--------|--------|---------|
| Administrador | admin@licitacao.gov.br | admin123 | Administrador do Sistema |
| Supervisor | supervisor@licitacao.gov.br | supervisor123 | Supervisor de Licitações |
| Operador | operador@compras.gov.br | operador123 | Operador de Compras |

> ⚠️ **Importante**: Altere essas credenciais em ambiente de produção!

## 📊 Estrutura do Banco de Dados

O sistema utiliza uma estrutura de banco de dados bem definida com as seguintes entidades principais:

### Tabelas Principais
- **fornecedores**: Cadastro de fornecedores com validação de CNPJ
- **emitentes**: Órgãos que emitem requisições de compra
- **destinatarios**: Departamentos que recebem requisições
- **requisicoes**: Requisições de compra com controle de status
- **pedidos_manuais**: Pedidos manuais associados aos fornecedores
- **conferencias**: Sessões de auditoria e conferência

### Tabelas do Sistema
- **users**: Usuários do sistema com autenticação
- **configuracoes**: Configurações gerais do sistema
- **audit_logs**: Log de auditoria de todas as operações
- **notifications**: Sistema de notificações
- **anexos**: Gestão de arquivos anexos

Para mais detalhes, consulte: [Estrutura do Banco de Dados](database/DATABASE_STRUCTURE.md)

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
composer run dev          # Inicia todos os serviços de desenvolvimento
npm run dev              # Apenas o build do frontend
php artisan serve        # Apenas o servidor Laravel

# Build de Produção
npm run build            # Build de produção do frontend
npm run build:ssr        # Build com Server-Side Rendering

# Testes
composer run test        # Executa todos os testes PHP
npm run test            # Executa testes do frontend (se configurado)

# Qualidade de Código
npm run lint            # ESLint com auto-fix
npm run format          # Prettier para formatação
npm run types           # Verificação de tipos TypeScript

# Wayfinder (Geração de Tipos TypeScript)
php artisan wayfinder:generate --with-form  # Gerar bindings TypeScript

# Docker
docker build -t licitacao-project .  # Build da imagem Docker
docker-compose up -d                  # Iniciar com Docker Compose
docker-compose down                   # Parar containers
```

## 🏗️ Arquitetura do Sistema

### Backend (Laravel)
```
app/
├── Http/Controllers/    # Controladores da aplicação
├── Models/             # Modelos Eloquent
├── Services/           # Lógica de negócio
├── Requests/           # Form Requests para validação
└── Resources/          # API Resources
```

### Frontend (React)
```
resources/js/
├── actions/           # Bindings TypeScript gerados pelo Wayfinder
├── components/        # Componentes reutilizáveis
├── pages/            # Páginas da aplicação (Inertia.js)
├── layouts/          # Layouts da aplicação
├── hooks/            # Custom hooks
├── lib/              # Utilitários e configurações
├── wayfinder/        # Tipos base do Wayfinder
└── types/            # Definições de tipos TypeScript
```

## 🔒 Segurança

O sistema implementa várias camadas de segurança:

- **Autenticação**: Sistema robusto baseado no Laravel Sanctum
- **Autorização**: Controle de acesso baseado em perfis de usuário
- **Validação**: Validação rigorosa tanto no frontend quanto no backend
- **CSRF Protection**: Proteção contra ataques CSRF
- **SQL Injection**: Prevenção através do Eloquent ORM
- **XSS Protection**: Sanitização automática de dados de entrada

## 🔗 Laravel Wayfinder

O projeto utiliza o **Laravel Wayfinder** para gerar automaticamente bindings TypeScript dos controladores Laravel, proporcionando type safety entre frontend e backend.

### Características do Wayfinder:
- **Type Safety**: Bindings TypeScript automáticos
- **Form Variants**: Integração com Inertia.js Forms
- **Route Generation**: Geração automática de rotas tipadas
- **Auto-sync**: Sincronização automática com mudanças no backend

### Comandos Importantes:
```bash
# Gerar bindings TypeScript
php artisan wayfinder:generate --with-form

# Os arquivos são gerados em:
# - resources/js/actions/     # Controladores tipados
# - resources/js/wayfinder/   # Tipos base
# - resources/js/routes.ts    # Rotas tipadas
```

### Uso nos Componentes:
```typescript
import RegisteredUserController from "@/actions/App/Http/Controllers/Auth/RegisteredUserController";

// Uso com Inertia Form
<Form {...RegisteredUserController.store.form()}>
  {/* form fields */}
</Form>
```

## 📈 Monitoramento e Logs

- **Laravel Pail**: Sistema avançado de logging em tempo real
- **Audit Logs**: Rastreamento completo de todas as operações do sistema
- **Queue Monitoring**: Monitoramento do sistema de filas
- **Error Tracking**: Captura e análise de erros

## 🐳 Container Docker

### Construindo a Imagem Docker

O projeto inclui um `Dockerfile` multi-stage otimizado que segue os padrões OCI (Open Container Initiative):

```bash
# Build da imagem
docker build -t licitacao-project .

# Executar o container
docker run -d -p 8080:80 --name licitacao-app licitacao-project
```

### Docker Compose para Desenvolvimento

Use o `docker-compose.yml` incluído para desenvolvimento local completo com Redis e PostgreSQL:

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f app

# Parar os serviços
docker-compose down
```

### Configuração de Produção

Para produção, configure as seguintes variáveis de ambiente:

```bash
# Variáveis essenciais
APP_ENV=production
APP_DEBUG=false
APP_KEY=your-production-key
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
REDIS_HOST=your-redis-host
```

## 🚀 Deploy e CI/CD

### GitHub Actions

O projeto inclui workflows do GitHub Actions para:

- **Testes automatizados**: Execução de testes PHP e linting
- **Build de imagens Docker**: Construção automática de imagens seguindo padrões OCI
- **Deploy automático**: Push para GitHub Container Registry (ghcr.io)
- **Análise de segurança**: Scan de vulnerabilidades com Trivy

### Container Registry

As imagens Docker são automaticamente construídas e publicadas no GitHub Container Registry:

```bash
# Pull da imagem mais recente
docker pull ghcr.io/seu-usuario/licitacao-project:latest

# Executar em produção
docker run -d \
  -p 80:80 \
  -e APP_ENV=production \
  -e APP_KEY=your-key \
  -e DB_CONNECTION=pgsql \
  -e DB_HOST=your-db-host \
  --name licitacao-production \
  ghcr.io/seu-usuario/licitacao-project:latest
```

### Tags Disponíveis

- `latest`: Versão mais recente da branch main
- `develop`: Versão de desenvolvimento
- `v1.0.0`: Versões específicas por tag
- `main`: Build da branch principal

### Deployment Manual

Para deploy tradicional em servidor:

1. **Configure o servidor web** (Apache/Nginx)
2. **Configure as variáveis de ambiente** para produção
3. **Execute as migrações** em produção
4. **Faça o build dos assets**:
   ```bash
   npm run build
   ```
5. **Configure o cache**:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- **PHP**: Seguimos o PSR-12 e as convenções do Laravel
- **TypeScript/React**: ESLint + Prettier com configurações personalizadas
- **Commits**: Seguimos o padrão Conventional Commits
- **Testes**: Cobertura mínima de 80% para novas funcionalidades

## 📝 Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Consulte a [documentação completa](docs/)
2. Verifique as [issues abertas](../../issues)
3. Crie uma nova issue descrevendo o problema
4. Entre em contato com a equipe de desenvolvimento

## 📊 Status do Projeto

- ✅ Gestão de Fornecedores
- ✅ Sistema de Requisições
- ✅ Dashboard e Relatórios
- ✅ Sistema de Conferências
- ✅ Autenticação e Autorização
- 🚧 API REST (em desenvolvimento)
- 🚧 Integração com sistemas externos
- 📋 Mobile App (planejado)

---

<div align="center">
  <p>Desenvolvido com ❤️ para modernizar os processos de licitação pública</p>
  <p>
    <a href="https://laravel.com">Laravel</a> •
    <a href="https://react.dev">React</a> •
    <a href="https://inertiajs.com">Inertia.js</a>
  </p>
</div>