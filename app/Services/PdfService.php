<?php

namespace App\Services;

use App\Models\Requisicao;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class PdfService
{
    /**
     * Generate PDF for requisition with two versions.
     *
     * @param  string  $type  'setor' for sector version, 'fornecedor' for supplier version
     */
    public function generateRequisicaoPdf(Requisicao $requisicao, string $type = 'setor'): Response
    {
        $data = [
            'requisicao' => $requisicao,
            'emitente' => $requisicao->emitente,
            'destinatario' => $requisicao->destinatario,
            'fornecedor' => $requisicao->fornecedor,
            'type' => $type,
            'data_impressao' => now()->format('d/m/Y H:i:s'),
        ];

        $pdf = Pdf::loadView('pdfs.requisicao', $data);

        $filename = sprintf(
            'Requisicao_%s_%s_%s.pdf',
            $requisicao->numero_completo,
            $type,
            now()->format('Y-m-d_H-i-s')
        );

        return $pdf->download($filename);
    }

    /**
     * Generate conference report PDF.
     *
     * @param  \App\Models\Conferencia  $conferencia
     */
    public function generateConferenciaPdf($conferencia): Response
    {
        $requisicoes = $conferencia->getRequisicoes();
        $pedidosManuais = $conferencia->pedidosManuais;

        $data = [
            'conferencia' => $conferencia,
            'fornecedor' => $conferencia->fornecedor,
            'requisicoes' => $requisicoes,
            'pedidos_manuais' => $pedidosManuais,
            'data_impressao' => now()->format('d/m/Y H:i:s'),
        ];

        $pdf = Pdf::loadView('pdfs.conferencia', $data);

        $filename = sprintf(
            'Conferencia_%s_%s.pdf',
            $conferencia->fornecedor->razao_social,
            $conferencia->periodo_display
        );

        return $pdf->download($filename);
    }

    /**
     * Generate supplier contact report PDF.
     *
     * @param  \Illuminate\Support\Collection  $fornecedores
     */
    public function generateContatosFornecedoresPdf($fornecedores, array $filters = []): Response
    {
        $data = [
            'fornecedores' => $fornecedores,
            'filters' => $filters,
            'data_impressao' => now()->format('d/m/Y H:i:s'),
            'total' => $fornecedores->count(),
        ];

        $pdf = Pdf::loadView('pdfs.contatos-fornecedores', $data);

        $filename = sprintf(
            'Contatos_Fornecedores_%s.pdf',
            now()->format('Y-m-d_H-i-s')
        );

        return $pdf->download($filename);
    }

    /**
     * Get PDF view data for requisition.
     */
    private function getRequisicaoViewData(Requisicao $requisicao, string $type): array
    {
        return [
            'titulo' => 'Autorização de Compra - Prefeitura de Pau Brasil - Prestação de Contas',
            'requisicao' => [
                'numero_completo' => $requisicao->numero_completo,
                'emitente' => $requisicao->emitente->nome,
                'destinatario' => $requisicao->destinatario->nome,
                'solicitante' => $requisicao->solicitante,
                'fornecedor' => $requisicao->fornecedor ? $requisicao->fornecedor->razao_social : 'Não informado',
                'data_recebimento' => $requisicao->data_recebimento->format('d/m/Y'),
                'descricao' => $requisicao->descricao,
                'status' => $requisicao->status_display,
                'valor_final' => $requisicao->valor_final ? 'R$ '.number_format($requisicao->valor_final, 2, ',', '.') : 'Não informado',
                'numero_pedido_real' => $requisicao->numero_pedido_real ?? 'Não informado',
            ],
            'show_signature' => $type === 'fornecedor',
            'via_type' => $type === 'setor' ? 'Via Setor de Compras' : 'Via Fornecedor',
            'data_impressao' => now()->format('d/m/Y H:i:s'),
        ];
    }
}
