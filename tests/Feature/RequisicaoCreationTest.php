<?php

namespace Tests\Feature;

use App\Models\Destinatario;
use App\Models\Emitente;
use App\Models\Requisicao;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RequisicaoCreationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test user
        $this->user = User::factory()->create();

        // Create test emitente
        $this->emitente = Emitente::create([
            'nome' => 'Secretaria de Educação',
            'sigla' => 'SEDUC',
            'endereco' => 'Rua Test, 123',
            'telefone' => '(11) 99999-9999',
            'email' => 'seduc@test.com',
        ]);

        // Create test destinatario
        $this->destinatario = Destinatario::create([
            'nome' => 'Departamento de Compras',
            'sigla' => 'DCOMP',
            'endereco' => 'Av. Test, 456',
            'telefone' => '(11) 88888-8888',
            'email' => 'compras@test.com',
        ]);
    }

    public function test_can_create_requisicao_with_numero_completo()
    {
        Storage::fake('public');

        $this->actingAs($this->user);

        $requisicaoData = [
            'numero' => '001',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'João Silva',
            'numero_oficio' => 'OF-001/2025',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Solicitação de material escolar para o ano letivo',
            'anexo' => UploadedFile::fake()->create('documento.pdf', 100),
        ];

        $response = $this->post(route('requisicoes.store'), $requisicaoData);

        // Assert the requisicao was created successfully
        $response->assertRedirect();
        $response->assertSessionHas('success', 'Requisição criada com sucesso!');

        // Assert the requisicao exists in database with correct numero_completo
        $this->assertDatabaseHas('requisicoes', [
            'numero' => '001',
            'numero_completo' => '001/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'João Silva',
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id,
        ]);

        // Assert file was stored
        $requisicao = Requisicao::where('numero', '001')->first();
        $this->assertNotNull($requisicao->anexo);
        Storage::disk('public')->assertExists($requisicao->anexo);
    }

    public function test_numero_completo_is_generated_correctly_with_emitente_sigla()
    {
        $this->actingAs($this->user);

        $requisicaoData = [
            'numero' => '042',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Maria Santos',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Teste de geração do número completo',
        ];

        $response = $this->post(route('requisicoes.store'), $requisicaoData);

        $response->assertRedirect();

        $requisicao = Requisicao::where('numero', '042')->first();
        $this->assertEquals('042/SEDUC', $requisicao->numero_completo);
    }

    public function test_fails_with_invalid_emitente_id()
    {
        $this->actingAs($this->user);

        $requisicaoData = [
            'numero' => '999',
            'emitente_id' => 99999, // Non-existent emitente
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Test User',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Test description',
        ];

        $response = $this->post(route('requisicoes.store'), $requisicaoData);

        $response->assertSessionHasErrors('emitente_id');
        $this->assertDatabaseMissing('requisicoes', ['numero' => '999']);
    }

    public function test_numero_must_be_unique()
    {
        $this->actingAs($this->user);

        // Create first requisicao
        Requisicao::create([
            'numero' => '100',
            'numero_completo' => '100/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'First User',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'First requisicao',
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id,
        ]);

        // Try to create second requisicao with same numero
        $requisicaoData = [
            'numero' => '100', // Duplicate numero
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Second User',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Second requisicao',
        ];

        $response = $this->post(route('requisicoes.store'), $requisicaoData);

        $response->assertSessionHasErrors('numero');
    }
}
