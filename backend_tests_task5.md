# Backend API Test Cases - Bidding Waiver Limit Alert System (Task 5)

## Test Environment Setup
- Base URL: `http://localhost:8000`
- Authentication required (use Laravel session or token auth)
- Run migrations first: `php artisan migrate`
- Seed initial categories: `php artisan db:seed`

## Test Cases

### 1. Create Categoria Material (Category)
```bash
curl -X POST http://localhost:8000/categorias-materiais \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie" \
  -d '{
    "nome": "Material de Informática",
    "codigo": "INFORMATICA",
    "descricao": "Equipamentos de informática e periféricos",
    "tipo": "material",
    "ativo": true,
    "limite_dispensa_anual": 50000.00,
    "limite_dispensa_mensal": 5000.00,
    "limite_dispensa_quantidade": 50,
    "periodo_limite": "mensal",
    "alerta_percentual": 80,
    "bloqueio_percentual": 100,
    "alerta_ativo": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Categoria de material criada com sucesso!",
  "data": {
    "id": 1,
    "nome": "Material de Informática",
    "codigo": "INFORMATICA",
    "limite_dispensa_mensal": 5000.00,
    "alerta_percentual": 80,
    "bloqueio_percentual": 100
  }
}
```

### 2. Check Limit Before Usage (Should Allow)
```bash
curl -X POST http://localhost:8000/categorias-materiais/check-limits \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie" \
  -d '{
    "categoria_id": 1,
    "valor": 3000.00,
    "periodo": "mensal"
  }'
```

**Expected Response:**
```json
{
  "categoria": {
    "id": 1,
    "nome": "Material de Informática",
    "codigo": "INFORMATICA",
    "limite_dispensa_mensal": 5000.00,
    "limite_dispensa_anual": 50000.00
  },
  "validacao": {
    "pode_gerar": true,
    "valor_solicitado": 3000.00,
    "periodo": "mensal",
    "valor_total": 3000.00,
    "percentual_total": 60.0,
    "atingira_alerta": false,
    "atingira_bloqueio": false,
    "atingira_limite": false,
    "mensagem": "Valor dentro dos limites permitidos."
  }
}
```

### 3. Check Limit Near Alert Threshold (Should Warn)
```bash
curl -X POST http://localhost:8000/categorias-materiais/check-limits \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie" \
  -d '{
    "categoria_id": 1,
    "valor": 4500.00,
    "periodo": "mensal"
  }'
```

**Expected Response:**
```json
{
  "validacao": {
    "pode_gerar": true,
    "valor_total": 4500.00,
    "percentual_total": 90.0,
    "atingira_alerta": true,
    "atingira_bloqueio": false,
    "atingira_limite": false,
    "mensagem": "Atenção: Valor atingirá 90% do limite mensal/anal. Recomendado aguardar próximo período."
  }
}
```

### 4. Check Limit Exceeded (Should Block)
```bash
curl -X POST http://localhost:8000/categorias-materiais/check-limits \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie" \
  -d '{
    "categoria_id": 1,
    "valor": 5500.00,
    "periodo": "mensal"
  }'
```

**Expected Response:**
```json
{
  "validacao": {
    "pode_gerar": false,
    "valor_total": 5500.00,
    "percentual_total": 110.0,
    "atingira_alerta": true,
    "atingira_bloqueio": true,
    "atingira_limite": true,
    "mensagem": "Valor excede o limite de 100% (R$ 5.000,00). Operação bloqueada.",
    "valor_excedido": 500.00
  }
}
```

### 5. Create Dispensa Licitacao Within Limit
```bash
curl -X POST http://localhost:8000/dispensa-licitacoes \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie" \
  -d '{
    "categoria_material_id": 1,
    "numero_processo": "001/2025",
    "numero_dispensa": "DL001/2025",
    "objeto": "Compra de notebooks e monitores",
    "valor_total": 3000.00,
    "data_dispensa": "2025-01-15",
    "data_inicio_vigencia": "2025-01-16",
    "data_fim_vigencia": "2025-06-15",
    "quantidade": 5,
    "status": "rascunho",
    "justificativa": "Compra necessária para projeto de digitalização",
    "fornecedor_id": 1,
    "secretaria_id": 1,
    "observacoes": "Entregar até o dia 15 do próximo mês"
  }'
```

### 6. Create Dispensa Licitacao Exceeding Limit (Should Fail)
```bash
curl -X POST http://localhost:8000/dispensa-licitacoes \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie" \
  -d '{
    "categoria_material_id": 1,
    "numero_processo": "002/2025",
    "numero_dispensa": "DL002/2025",
    "objeto": "Compra de servidores e storage",
    "valor_total": 8000.00,
    "data_dispensa": "2025-01-15",
    "data_inicio_vigencia": "2025-01-16",
    "data_fim_vigencia": "2025-12-15",
    "quantidade": 10,
    "status": "aprovada",
    "justificativa": "Upgrade de infraestrutura",
    "fornecedor_id": 1,
    "secretaria_id": 1,
    "observacoes": "Equipamentos de alta performance"
  }'
```

**Expected Response:**
```json
{
  "message": "O campo 'valor_total' não pode ser alterado porque o material já foi utilizado.",
  "errors": {
    "limite_excedido": ["O valor excede o limite mensal para esta categoria de material. Limite: R$ 5.000,00"]
  }
}
```

### 7. Generate Alerts for All Categories
```bash
curl -X POST http://localhost:8000/categorias-materais/gerar-alertas \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie"
```

**Expected Response:**
```json
{
  "success": true,
  "total_geradas": 3,
  "alertas": [
    {
      "id": 1,
      "tipo_alerta": "limite_atingido",
      "nivel_severidade": "medio",
      "percentual_utilizado": 85.5,
      "valor_acumulado": 4275.00,
      "valor_excedido": 0,
      "periodo_descricao": "Mensal: 01/2025",
      "created_at": "2025-01-15 10:30:00"
    }
  ],
  "mensagem": "3 alertas geradas com sucesso."
}
```

### 8. Get Category Usage Report
```bash
curl -X GET "http://localhost:8000/categorias-materias/usage-report?ano=2025&mes=1" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie"
```

**Expected Response:**
```json
{
  "relatorio": [
    {
      "categoria": {
        "id": 1,
        "nome": "Material de Informática",
        "codigo": "INFORMATICA",
        "tipo": "Material"
      },
      "periodo": "mensal",
      "ano": 2025,
      "mes": 1,
      "estatisticas": {
        "valor_acumulado": 4275.00,
        "quantidade_acumulada": 15,
        "total_dispensas": 3,
        "limite_aplicavel": 5000.00,
        "percentual_utilizado": 85.5,
        "status_uso": "alerta",
        "pode_gerar_dispensa": true,
        "valor_excedido": 0,
        "atingiu_limite": false,
        "atingiu_alerta": true
      }
    }
  ],
  "periodo": "Mensal",
  "ano": 2025,
  "mes": 1
}
```

### 9. Search Categories
```bash
curl -X GET "http://localhost:8000/categorias-materiais/search?search=informatica&tipo=material" \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie"
```

**Expected Response:**
```json
[
  {
    "id": 1,
    "codigo": "INFORMATICA",
    "nome": "Material de Informática",
    "tipo": "material",
    "limite_dispensa_mensal": 5000.00,
    "limite_dispensa_anual": 50000.00
  }
]
```

### 10. Get Category Details with Usage Statistics
```bash
curl -X GET http://localhost:8000/categorias-materiais/1 \
  -H "Accept: application/json" \
  -b "laravel_session=your_session_cookie"
```

**Expected Response:**
```json
{
  "categoria": {
    "id": 1,
    "nome": "Material de Informática",
    "codigo": "INFORMATICA",
    "limite_dispensa_mensal": 5000.00,
    "alerta_percentual": 80,
    "status_display": "Ativa"
  },
  "uso_mensal": {
    "valor_acumulado": 4275.00,
    "percentual_utilizado": 85.5,
    "status_uso": "alerta",
    "pode_gerar_dispensa": true,
    "valor_excedido": 0
  },
  "uso_anual": {
    "valor_acumulado": 4275.00,
    "percentual_utilizado": 8.55,
    "status_uso": "normal",
    "pode_gerar_dispensa": true,
    "valor_excedido": 0
  },
  "alertas": [
    {
      "id": 1,
      "tipo_alerta_display": "Limite Atingido",
      "nivel_severidade_display": "Média",
      "percentual_utilizado_formatado": "85.5%",
      "valor_acumulado_formatado": "R$ 4.275,00"
    }
  ]
}
```

## Database Verification Queries

```sql
-- Check categories with limits
SELECT id, nome, codigo, limite_dispensa_mensal, limite_dispensa_anual, alerta_percentual
FROM categoria_materiais WHERE ativo = true;

-- Check dispensas with limit validation
SELECT id, numero_dispensa, valor_total, categoria_material_id, excedeu_limite, motivo_excedimento
FROM dispensa_licitacoes;

-- Check generated alerts
SELECT id, tipo_alerta, nivel_severidade, percentual_utilizado, valor_excedido, status
FROM limite_dispensa_alertas
ORDER BY created_at DESC;

-- Check monthly usage by category
SELECT 
    cm.nome as categoria,
    cm.codigo,
    COUNT(dl.id) as total_dispensas,
    SUM(dl.valor_total) as valor_total,
    MAX(dl.percentual_utilizado) as maior_percentual_utilizado
FROM categoria_materiais cm
LEFT JOIN dispensa_licitacoes dl ON cm.id = dl.categoria_material_id
WHERE dl.status = 'aprovada' 
  AND dl.data_dispensa BETWEEN '2025-01-01' AND '2025-01-31'
GROUP BY cm.id, cm.nome, cm.codigo;

-- Check critical alerts
SELECT 
    la.id,
    la.tipo_alerta,
    la.nivel_severidade,
    cm.nome as categoria,
    la.percentual_utilizado,
    la.valor_acumulado,
    la.valor_excedido,
    la.created_at
FROM limite_dispensa_alertas la
JOIN categoria_materiais cm ON la.categoria_material_id = cm.id
WHERE la.nivel_severidade IN ('alto', 'critico')
AND la.status = 'ativo'
ORDER BY la.created_at DESC;
```

## Integration Test Script (PHP)

```php
<?php
// tests/Feature/BiddingWaiverLimitTest.php

use App\Models\CategoriaMaterial;
use App\Models\DispensaLicitacao;
use App\Models\Fornecedor;
use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BiddingWaiverLimitTest extends TestCase
{
    use RefreshDatabase;

    public function test_categoria_can_be_created()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 5000.00,
            'alerta_percentual' => 80,
        ]);

        $this->assertDatabaseHas('categoria_materiais', [
            'id' => $categoria->id,
            'limite_dispensa_mensal' => 5000.00,
        ]);
    }

    public function test_limit_validation_before_usage()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 1000.00,
            'alerta_percentual' => 80,
        ]);

        // Test within limit
        $validacao = $categoria->podeGerarDispensa(800.00, 'mensal');
        $this->assertTrue($validacao['pode_gerar']);
        $this->assertEquals(80.0, $validacao['percentual_total']);
    }

    public function test_limit_alert_threshold()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 1000.00,
            'alerta_percentual' => 80,
        ]);

        // Test at alert threshold
        $validacao = $categoria->podeGerarDispensa(850.00, 'mensal');
        $this->assertTrue($validacao['pode_gerar']);
        $this->assertTrue($validacao['atingira_alerta']);
        $this->assertEquals(85.0, $validacao['percentual_total']);
    }

    public function test_limit_exceeded()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 1000.00,
            'bloqueio_percentual' => 100,
        ]);

        // Test exceeded limit
        $validacao = $categoria->podeGerarDispensa(1200.00, 'mensal');
        $this->assertFalse($validacao['pode_gerar']);
        $this->assertTrue($validacao['atingira_limite']);
        $this->assertTrue($validacao['atingira_bloqueio']);
        $this->assertEquals(200.00, $validacao['valor_excedido']);
    }

    public function test_alert_generation_on_usage()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 1000.00,
            'alerta_percentual' => 80,
        ]);

        // Create dispensa that triggers alert
        $dispensa = DispensaLicitacao::create([
            'categoria_material_id' => $categoria->id,
            'valor_total' => 850.00,
            'data_dispensa' => now(),
            'status' => 'aprovada',
        ]);

        // Check if alert was generated
        $this->assertDatabaseHas('limite_dispensa_alertas', [
            'categoria_material_id' => $categoria->id,
            'tipo_alerta' => 'limite_atingido',
            'valor_acumulado' => 850.00,
        ]);

        // Check alert statistics
        $this->assertEquals(1, $categoria->calcularUsoAtual('mensal')['total_dispensas']);
    }

    public function test_dispensa_cannot_exceed_limit()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 1000.00,
            'bloqueio_percentual' => 100,
        ]);

        // This should throw an exception
        $this->expectException(\InvalidArgumentException::class);

        DispensaLicitacao::create([
            'categoria_material_id' => $categoria->id,
            'valor_total' => 1500.00,
            'status' => 'aprovada',
        ]);
    }

    public function test_category_usage_calculation()
    {
        $categoria = CategoriaMaterial::factory()->create([
            'limite_dispensa_mensal' => 1000.00,
        ]);

        // Create multiple dispensas
        $dispensa1 = DispensaLicitacao::create([
            'categoria_material_id' => $categoria->id,
            'valor_total' => 500.00,
            'status' => 'aprovada',
        ]);

        $dispensa2 = DispensaLicitacao::create([
            'categoria_material_id' => $categoria->id,
            'valor_total' => 300.00,
            'status' => 'aprovada',
        ]);

        // Check calculation
        $uso = $categoria->calcularUsoAtual('mensal');
        $this->assertEquals(800.00, $uso['valor_acumulado']);
        $this->assertEquals(2, $uso['total_dispensas']);
        $this->assertEquals(80.0, $uso['percentual_utilizado']);
    }
}
```

---

**Backend implementation for Task 5 is complete and testable.**