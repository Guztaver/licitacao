<?php

namespace App\Exports;

use App\Models\DispensaLicitacao;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class RelatorioDispensasExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
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
            'Número',
            'Categoria',
            'Valor (R$)',
            'Data Dispensa',
            'Objeto',
            'Fundamentação Legal',
            'Responsável',
            'Unidade Administrativa',
            'Período',
            'Referência',
            'Status',
        ];
    }

    public function map($dispensa): array
    {
        return [
            $dispensa->numero,
            $dispensa->categoriaMaterial->nome ?? '',
            number_format($dispensa->valor, 2, ',', '.'),
            $dispensa->data_dispensa->format('d/m/Y'),
            $dispensa->objeto,
            $dispensa->fundamentacao_legal,
            $dispensa->responsavel,
            $dispensa->unidade_administrativa,
            ucfirst($dispensa->periodo),
            $dispensa->periodo === 'mensal'
                ? sprintf('%02d/%d', $dispensa->referencia_mes, $dispensa->referencia_ano)
                : $dispensa->referencia_ano,
            ucfirst($dispensa->status),
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
        ];
    }

    public function title(): string
    {
        $titulo = 'Relatório de Dispensas';

        if (isset($this->parametros['ano'])) {
            $titulo .= ' - ' . $this->parametros['ano'];
        }

        if (isset($this->parametros['categoria_id'])) {
            $titulo .= ' - Categoria Específica';
        }

        return $titulo;
    }
}
