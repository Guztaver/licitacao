# Database Structure Documentation

## Overview

This document describes the complete database structure for the Licitação (Procurement/Bidding) System. The system manages suppliers, procurement requests, audits, and related business processes.

## Tables Overview

### Core Business Tables

#### 1. fornecedores (Suppliers)
Stores information about suppliers/vendors.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| razao_social | varchar | Company name |
| cnpj | varchar(18) | Brazilian company tax ID (unique) |
| telefone | varchar(20) | Phone number |
| email | varchar | Email address |
| endereco | text | Address |
| cidade | varchar(100) | City |
| estado | varchar(2) | State code |
| cep | varchar(10) | Postal code |
| contato | varchar(100) | Contact person |
| status | boolean | Active status (default: true) |
| observacoes | text | Additional notes |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** status, razao_social, cnpj

#### 2. emitentes (Issuers)
Organizations that issue procurement requests.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| nome | varchar | Organization name |
| sigla | varchar(20) | Abbreviation (unique) |
| endereco | text | Address |
| telefone | varchar(20) | Phone number |
| email | varchar | Email address |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** nome, sigla

#### 3. destinatarios (Recipients)
Organizations that receive procurement requests.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| nome | varchar | Organization name |
| sigla | varchar(20) | Abbreviation (unique) |
| endereco | text | Address |
| telefone | varchar(20) | Phone number |
| email | varchar | Email address |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** nome, sigla

#### 4. requisicoes (Procurement Requests)
Main table for procurement requests/requisitions.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| numero | varchar(10) | Sequential number |
| numero_completo | varchar(50) | Complete number with issuer code (unique) |
| emitente_id | bigint | Foreign key to emitentes |
| destinatario_id | bigint | Foreign key to destinatarios |
| solicitante | varchar | Requestor name |
| numero_oficio | varchar(50) | Official document number |
| data_recebimento | date | Receipt date |
| descricao | text | Description |
| fornecedor_id | bigint | Foreign key to fornecedores (nullable) |
| anexo | varchar | Attachment filename |
| status | enum | Status: autorizada, concretizada, cancelada, excluida |
| numero_pedido_real | varchar(50) | Real order number |
| valor_final | decimal(15,2) | Final value |
| data_concretizacao | timestamp | Completion date |
| usuario_concretizacao_id | bigint | User who completed (nullable) |
| data_exclusao | timestamp | Deletion date |
| usuario_exclusao_id | bigint | User who deleted (nullable) |
| motivo_exclusao | text | Deletion reason |
| usuario_criacao_id | bigint | User who created |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** status, data_recebimento, numero, numero_completo, emitente_id+status, fornecedor_id+status

#### 5. pedidos_manuais (Manual Orders)
Manual orders associated with suppliers.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| fornecedor_id | bigint | Foreign key to fornecedores |
| descricao | text | Description |
| valor | decimal(15,2) | Order value |
| data_pedido | date | Order date |
| numero_pedido | varchar(50) | Order number |
| observacoes | text | Additional notes |
| conferencia_id | bigint | Foreign key to conferencias (added later) |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** fornecedor_id, conferencia_id, data_pedido, valor

#### 6. conferencias (Audits/Conferences)
Audit sessions for supplier transactions.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| fornecedor_id | bigint | Foreign key to fornecedores |
| periodo_inicio | date | Period start date |
| periodo_fim | date | Period end date |
| total_requisicoes | decimal(15,2) | Total value from requisitions |
| total_pedidos_manuais | decimal(15,2) | Total value from manual orders |
| total_geral | decimal(15,2) | Grand total |
| status | enum | Status: em_andamento, finalizada |
| data_finalizacao | timestamp | Finalization date |
| usuario_criacao_id | bigint | User who created |
| usuario_finalizacao_id | bigint | User who finalized (nullable) |
| observacoes | text | Additional notes |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** fornecedor_id, status, periodo_inicio, periodo_fim, fornecedor_id+status

### System Tables

#### 7. configuracoes (System Configurations)
System-wide configuration settings.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| chave | varchar | Configuration key (unique) |
| valor | text | Configuration value |
| tipo | varchar | Value type: string, boolean, integer, decimal, json |
| descricao | text | Description |
| grupo | varchar | Configuration group (default: geral) |
| publico | boolean | Public setting (default: false) |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** chave, grupo, publico

**Default configurations include:**
- Sistema: nome, versão, modo de manutenção
- Empresa: nome, CNPJ, endereço, telefone, email
- Email: configurações SMTP
- Backup: configurações de backup automático
- Notificações: configurações de notificação

#### 8. audit_logs (Audit Trail)
System audit trail for tracking changes.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| event | varchar | Event type: created, updated, deleted, etc. |
| auditable_type | varchar | Model class name |
| auditable_id | bigint | Model ID |
| user_id | bigint | User who performed action (nullable) |
| old_values | json | Old attribute values |
| new_values | json | New attribute values |
| ip_address | varchar(45) | IP address |
| user_agent | varchar | User agent |
| url | text | Request URL |
| tags | text | Additional tags |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** auditable_type+auditable_id, user_id, event, created_at

#### 9. notifications (System Notifications)
User notifications system.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| type | varchar | Notification type: info, warning, error, success |
| notifiable_type | varchar | Target model type (polymorphic) |
| notifiable_id | bigint | Target model ID (polymorphic) |
| title | varchar | Notification title |
| message | text | Notification message |
| data | json | Additional notification data |
| read_at | timestamp | Read timestamp |
| action_url | varchar | Action URL |
| action_text | varchar | Action button text |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** notifiable_type+notifiable_id (auto-created), read_at, type, created_at

#### 10. anexos (File Attachments)
File attachment system for documents.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| nome_original | varchar | Original filename |
| nome_arquivo | varchar | Stored filename |
| caminho | varchar | File path |
| mime_type | varchar | MIME type |
| tamanho | bigint | File size in bytes |
| anexavel_type | varchar | Attachable model type (polymorphic) |
| anexavel_id | bigint | Attachable model ID (polymorphic) |
| tipo | varchar | File type category (default: documento) |
| descricao | text | File description |
| usuario_upload_id | bigint | User who uploaded |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** anexavel_type+anexavel_id (auto-created), tipo, mime_type, usuario_upload_id

#### 11. user_preferences (User Preferences)
User-specific settings and preferences.

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| user_id | bigint | Foreign key to users |
| chave | varchar | Preference key |
| valor | text | Preference value |
| tipo | varchar | Value type: string, boolean, integer, json |
| created_at | timestamp | Creation date |
| updated_at | timestamp | Last update date |

**Indexes:** user_id+chave (unique), user_id, chave

### Laravel Default Tables

#### 12. users (System Users)
- Standard Laravel user authentication table
- Contains: id, name, email, email_verified_at, password, remember_token, timestamps

#### 13. password_reset_tokens
- Standard Laravel password reset functionality

#### 14. sessions
- Standard Laravel session management

#### 15. cache, cache_locks
- Standard Laravel caching system

#### 16. jobs, job_batches, failed_jobs
- Standard Laravel queue system

## Relationships

### Primary Relationships

1. **Fornecedores → Requisições** (One-to-Many)
   - A supplier can have multiple procurement requests

2. **Fornecedores → Pedidos Manuais** (One-to-Many)
   - A supplier can have multiple manual orders

3. **Fornecedores → Conferências** (One-to-Many)
   - A supplier can have multiple audit sessions

4. **Emitentes → Requisições** (One-to-Many)
   - An issuer can create multiple procurement requests

5. **Destinatários → Requisições** (One-to-Many)
   - A recipient can receive multiple procurement requests

6. **Conferências → Pedidos Manuais** (One-to-Many)
   - An audit session can include multiple manual orders

7. **Users → Multiple Tables** (One-to-Many)
   - Users create requisitions, audits, and perform various actions

### Polymorphic Relationships

1. **Anexos** (Polymorphic)
   - Can be attached to any model (requisições, fornecedores, etc.)

2. **Notifications** (Polymorphic)
   - Can notify any model (primarily users)

## Business Rules

### Status Flows

**Requisições:**
- autorizada → concretizada
- autorizada → cancelada
- autorizada/cancelada → excluida

**Conferências:**
- em_andamento → finalizada

### Data Integrity

1. **CNPJ Uniqueness**: Each supplier must have a unique CNPJ
2. **Sigla Uniqueness**: Emitentes and Destinatários must have unique abbreviations
3. **Cascading Deletes**: Deleting users, suppliers, etc., properly handles related records
4. **Soft Deletes**: Requisições use logical deletion (status = 'excluida')

## Migration Order

The migrations are ordered to ensure proper foreign key relationships:

1. Users (Laravel default)
2. Fornecedores
3. Emitentes
4. Destinatários
5. Requisições (references emitentes, destinatários, fornecedores, users)
6. Pedidos Manuais (references fornecedores)
7. Conferências (references fornecedores, users)
8. Add conferencia_id to Pedidos Manuais (references conferências)
9. System tables (configurações, audit_logs, notifications, anexos, user_preferences)

## Indexes and Performance

All tables include appropriate indexes for:
- Primary relationships (foreign keys)
- Frequently queried fields (status, dates, names)
- Unique constraints
- Composite indexes for common query patterns

This structure supports efficient querying for dashboards, reports, and business operations while maintaining data integrity and audit capabilities.