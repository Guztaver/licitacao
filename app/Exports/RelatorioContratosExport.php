<?php

namespace App\Exports;

use App\Models\Contrato;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class RelatorioContratosExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $dados;
    protected $parametros;

    public function __construct($dados, $parametros = [])
    {
        $this->dados = $dados;
        $this->parametros = $parametros;
    }

    public function collection()
    {
        return $this->dados;
    }

    public function headings(): array
    {
        return [
            'Número do Contrato',
            'Fornecedor',
            'Processo Licitatório',
            'Data Início',
            'Data Fim',
            'Valor Total (R$)',
            'Status',
            'Total de Itens',
            'Limite Requisições',
            'Limite Conferências',
            'Limite Valor Mensal (R$)',
            'Usuário Criação',
        ];
    }

    public function map($contrato): array
    {
        return [
            $contrato->numero_contrato,
            $contrato->fornecedor->nome ?? '',
            $contrato->processoLicitatorio->numero_processo ?? '',
            $contrato->data_inicio->format('d/m/Y'),
            $contrato->data_fim->format('d/m/Y'),
            number_format($contrato->valor_total, 2, ',', '.'),
            $contrato->status_display ?? $contrato->status,
            $contrato->getTotalItensAttribute(),
            $contrato->limite_requisicoes ?? 'Ilimitado',
            $contrato->limite_conferencias ?? 'Ilimitado',
            $contrato->limite_valor_mensal ? number_format($contrato->limite_valor_mensal, 2, ',', '.') : 'Ilimitado',
            $contrato->usuarioCriacao->name ?? '',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold text
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ],

            // Auto-size columns
            'A' => ['autosize' => true],
            'B' => ['autosize' => true],
            'C' => ['autosize' => true],
            'D' => ['autosize' => true],
            'E' => ['autosize' => true],
            'F' => ['autosize' => true],
            'G' => ['autosize' => true],
            'H' => ['autosize' => true],
            'I' => ['autosize' => true],
            'J' => ['autosize' => true],
            'K' => ['autosize' => true],
            'L' => ['autosize' => true],
        ];
    }

    public function title(): string
    {
        $titulo = 'Relatório de Contratos';

        if (isset($this->parametros['ano'])) {
            $titulo .= ' - ' . $this->parametros['ano'];
        }

        if (isset($this->parametros['status'])) {
            $titulo .= ' - Status: ' . $this->parametros['status'];
        }

        return $titulo;
    }
}
