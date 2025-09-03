<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Emitente;
use App\Models\Destinatario;
use App\Models\Requisicao;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class RequisicaoAnexoTest extends TestCase
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
            'email' => 'seduc@test.com'
        ]);

        // Create test destinatario
        $this->destinatario = Destinatario::create([
            'nome' => 'Departamento de Compras',
            'sigla' => 'DCOMP',
            'endereco' => 'Av. Test, 456',
            'telefone' => '(11) 88888-8888',
            'email' => 'compras@test.com'
        ]);
    }

    public function test_can_download_attachment_when_exists()
    {
        Storage::fake('public');

        $this->actingAs($this->user);

        // Create a fake file
        $file = UploadedFile::fake()->create('documento.pdf', 100);

        // Create requisicao with attachment
        $requisicao = Requisicao::create([
            'numero' => '001',
            'numero_completo' => '001/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'João Silva',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Teste de anexo',
            'anexo' => $file->store('requisicoes/anexos', 'public'),
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id
        ]);

        // Test the download route
        $response = $this->get(route('requisicoes.anexo', $requisicao->id));

        $response->assertStatus(200);
        $response->assertHeader('content-disposition');

        // Verify file exists in storage
        Storage::disk('public')->assertExists($requisicao->anexo);
    }

    public function test_cannot_download_attachment_when_not_exists()
    {
        $this->actingAs($this->user);

        // Create requisicao without attachment
        $requisicao = Requisicao::create([
            'numero' => '002',
            'numero_completo' => '002/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Maria Santos',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Teste sem anexo',
            'anexo' => null,
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id
        ]);

        // Test the download route should redirect back with error
        $response = $this->get(route('requisicoes.anexo', $requisicao->id));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Esta requisição não possui anexo.');
    }

    public function test_cannot_download_attachment_when_file_missing()
    {
        Storage::fake('public');

        $this->actingAs($this->user);

        // Create requisicao with attachment path but no actual file
        $requisicao = Requisicao::create([
            'numero' => '003',
            'numero_completo' => '003/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Pedro Silva',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Teste com anexo inexistente',
            'anexo' => 'requisicoes/anexos/inexistente.pdf',
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id
        ]);

        // Test the download route should redirect back with error
        $response = $this->get(route('requisicoes.anexo', $requisicao->id));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Arquivo não encontrado.');
    }

    public function test_show_page_loads_successfully_with_attachment()
    {
        Storage::fake('public');

        $this->actingAs($this->user);

        // Create a fake file
        $file = UploadedFile::fake()->create('documento.pdf', 100);

        // Create requisicao with attachment
        $requisicao = Requisicao::create([
            'numero' => '004',
            'numero_completo' => '004/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Ana Silva',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Teste de exibição de anexo',
            'anexo' => $file->store('requisicoes/anexos', 'public'),
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id
        ]);

        $response = $this->get(route('requisicoes.show', $requisicao->id));

        $response->assertStatus(200);
        // Verify that the requisicao data contains attachment info
        $this->assertNotNull($requisicao->anexo);
    }

    public function test_show_page_loads_successfully_without_attachment()
    {
        $this->actingAs($this->user);

        // Create requisicao without attachment
        $requisicao = Requisicao::create([
            'numero' => '005',
            'numero_completo' => '005/SEDUC',
            'emitente_id' => $this->emitente->id,
            'destinatario_id' => $this->destinatario->id,
            'solicitante' => 'Carlos Silva',
            'data_recebimento' => '2025-01-15',
            'descricao' => 'Teste sem anexo na exibição',
            'anexo' => null,
            'status' => 'autorizada',
            'usuario_criacao_id' => $this->user->id
        ]);

        $response = $this->get(route('requisicoes.show', $requisicao->id));

        $response->assertStatus(200);
        // Verify that the requisicao has no attachment
        $this->assertNull($requisicao->anexo);
    }
}
