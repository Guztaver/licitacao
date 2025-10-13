<?php

namespace App\Exports;

use App\Models\EstatisticaMaterial;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class RelatorioMateriaisExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
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
            'Código do Material',
            'Descrição',
            'Categoria',
            'Período',
            'Total de Operações',
            'Valor Total (R$)',
            'Quantidade Total',
            'Preço Médio (R$)',
            'Variação Preço (%)',
            'Fornecedores Distintos',
        ];
    }

    public function map($estatistica): array
    {
        return [
            $estatistica->item->codigo ?? '',
            $estatistica->item->descricao ?? '',
            $estatistica->categoria->nome ?? 'Sem Categoria',
            $estatistica->periodo_display,
            $estatistica->getTotalOperacoesAttribute(),
            number_format($estatistica->getValorTotalAttribute(), 2, ',', '.'),
            $estatistica->quantidade_total,
            number_format($estatistica->valor_medio_ponderado, 2, ',', '.'),
            number_format($estatistica->variacao_preco_percentual, 2, ',', '.') . '%',
            $estatistica->fornecedores_distintos,
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
        ];
    }

    public function title(): string
    {
        $titulo = 'Relatório de Materiais';

        if (isset($this->parametros['ano'])) {
            $titulo .= ' - ' . $this->parametros['ano'];
        }

        if (isset($this->parametros['mes'])) {
            $titulo .= '/' . str_pad($this->parametros['mes'], 2, '0', STR_PAD_LEFT);
        }

        return $titulo;
    }
}
