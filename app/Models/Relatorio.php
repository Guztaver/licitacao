<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Relatorio extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'tipo',
        'parametros',
        'dados',
        'status',
        'mensagem_erro',
        'arquivo_path',
        'arquivo_formato',
        'data_geracao',
        'data_expiracao',
        'usuario_solicitante_id',
    ];

    protected $casts = [
        'parametros' => 'array',
        'dados' => 'array',
        'data_geracao' => 'datetime',
        'data_expiracao' => 'datetime',
    ];

    protected $dates = ['data_geracao', 'data_expiracao'];

    // Status constants
    const STATUS_GERANDO = 'gerando';
    const STATUS_CONCLUIDO = 'concluido';
    const STATUS_ERRO = 'erro';

    // Tipo constants
    const TIPO_MATERIAIS = 'materiais';
    const TIPO_SERVICOS = 'servicos';
    const TIPO_CONTRATOS = 'contratos';
    const TIPO_DISPENSAS = 'dispensas';
    const TIPO_USO_CATEGORIAS = 'uso_categorias';
    const TIPO_FORNECEDORES = 'fornecedores';

    // Formato constants
    const FORMATO_PDF = 'pdf';
    const FORMATO_XLSX = 'xlsx';
    const FORMATO_CSV = 'csv';

    /**
     * Get the user who requested the report.
     */
    public function usuarioSolicitante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_solicitante_id');
    }

    /**
     * Check if report is ready for download.
     */
    public function estaPronto(): bool
    {
        return $this->status === self::STATUS_CONCLUIDO && $this->arquivo_path;
    }

    /**
     * Check if report has expired.
     */
    public function estaExpirado(): bool
    {
        return $this->data_expiracao && $this->data_expiracao->isPast();
    }

    /**
     * Check if report can be downloaded.
     */
    public function podeBaixar(): bool
    {
        return $this->estaPronto() && !$this->estaExpirado();
    }

    /**
     * Get file size in human readable format.
     */
    public function getTamanhoArquivoAttribute(): string
    {
        if (!$this->arquivo_path || !file_exists(storage_path('app/' . $this->arquivo_path))) {
            return 'N/A';
        }

        $bytes = filesize(storage_path('app/' . $this->arquivo_path));
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    /**
     * Get download URL.
     */
    public function getDownloadUrlAttribute(): string
    {
        if (!$this->podeBaixar()) {
            return '#';
        }

        return route('relatorios.download', $this->id);
    }

    /**
     * Get status display name.
     */
    public function getStatusDisplayAttribute(): string
    {
        $statusMap = [
            self::STATUS_GERANDO => 'Gerando',
            self::STATUS_CONCLUIDO => 'Concluído',
            self::STATUS_ERRO => 'Erro',
        ];

        return $statusMap[$this->status] ?? $this->status;
    }

    /**
     * Get status color class.
     */
    public function getStatusColorAttribute(): string
    {
        $colorMap = [
            self::STATUS_GERANDO => 'bg-blue-100 text-blue-800',
            self::STATUS_CONCLUIDO => 'bg-green-100 text-green-800',
            self::STATUS_ERRO => 'bg-red-100 text-red-800',
        ];

        return $colorMap[$this->status] ?? 'bg-gray-100 text-gray-800';
    }

    /**
     * Mark report as completed.
     */
    public function marcarComoConcluido(string $arquivoPath, string $formato): void
    {
        $this->update([
            'status' => self::STATUS_CONCLUIDO,
            'arquivo_path' => $arquivoPath,
            'arquivo_formato' => $formato,
            'data_expiracao' => now()->addDays(7), // expira em 7 dias
        ]);
    }

    /**
     * Mark report as error.
     */
    public function marcarComoErro(string $mensagemErro): void
    {
        $this->update([
            'status' => self::STATUS_ERRO,
            'mensagem_erro' => $mensagemErro,
        ]);
    }

    /**
     * Clean up expired reports.
     */
    public static function limparExpirados(): int
    {
        $expirados = self::where('data_expiracao', '<', now())->get();
        $count = $expirados->count();

        foreach ($expirados as $relatorio) {
            // Delete file if exists
            if ($relatorio->arquivo_path && file_exists(storage_path('app/' . $relatorio->arquivo_path))) {
                unlink(storage_path('app/' . $relatorio->arquivo_path));
            }

            $relatorio->delete();
        }

        return $count;
    }

    /**
     * Get available report types.
     */
    public static function getTiposDisponiveis(): array
    {
        return [
            self::TIPO_MATERIAIS => 'Relatório de Materiais',
            self::TIPO_SERVICOS => 'Relatório de Serviços',
            self::TIPO_CONTRATOS => 'Relatório de Contratos',
            self::TIPO_DISPENSAS => 'Relatório de Dispensas',
            self::TIPO_USO_CATEGORIAS => 'Relatório de Uso por Categorias',
            self::TIPO_FORNECEDORES => 'Relatório de Fornecedores',
        ];
    }

    /**
     * Get available formats.
     */
    public static function getFormatosDisponiveis(): array
    {
        return [
            self::FORMATO_PDF => 'PDF',
            self::FORMATO_XLSX => 'Excel (XLSX)',
            self::FORMATO_CSV => 'CSV',
        ];
    }

    /**
     * Generate unique filename.
     */
    public static function gerarNomeArquivo(string $tipo, string $formato): string
    {
        $timestamp = now()->format('Y-m-d_H-i-s');
        $usuario = auth()->user()?->name ?? 'sistema';
        $nomeLimpo = str_replace(' ', '_', strtolower($tipo));

        return "relatorios/{$nomeLimpo}_{$timestamp}_{$usuario}.{$formato}";
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Set default values
        static::creating(function ($relatorio) {
            $relatorio->data_geracao = now();
            $relatorio->usuario_solicitante_id = $relatorio->usuario_solicitante_id ?? auth()->id();
        });
    }
}
