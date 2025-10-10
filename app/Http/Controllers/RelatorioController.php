<?php

namespace App\Http\Controllers;

use App\Models\Conferencia;
use App\Models\Fornecedor;
use App\Models\Requisicao;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class RelatorioController extends Controller
{
    /**
     * Display the main reports page.
     */
    public function index(): Response
    {
        // Get statistics for quick stats card
        $currentMonth = now()->month;
        $currentYear = now()->year;

        $requisicoesEsteMes = Requisicao::where('status', '!=', 'excluida')
            ->whereMonth('data_recebimento', $currentMonth)
            ->whereYear('data_recebimento', $currentYear)
            ->get();

        $stats = [
            'requisicoes_este_mes' => $requisicoesEsteMes->count(),
            'aprovadas' => $requisicoesEsteMes
                ->where('status', 'autorizada')
                ->count(),
            'pendentes' => $requisicoesEsteMes
                ->where('status', 'pendente')
                ->count(),
            'rejeitadas' => $requisicoesEsteMes
                ->where('status', 'cancelada')
                ->count(),
            'concretizadas' => $requisicoesEsteMes
                ->where('status', 'concretizada')
                ->count(),
            'valor_total_mes' => $requisicoesEsteMes
                ->where('status', 'concretizada')
                ->sum('valor_final') ?? 0,
        ];

        // Get emitentes and fornecedores for dropdowns
        $emitentes = \App\Models\Emitente::orderBy('nome')->get([
            'id',
            'nome',
            'sigla',
        ]);
        $fornecedores = \App\Models\Fornecedor::where('status', true)
            ->orderBy('razao_social')
            ->get(['id', 'razao_social', 'cnpj']);

        return Inertia::render('Relatorios/Index', [
            'stats' => $stats,
            'emitentes' => $emitentes,
            'fornecedores' => $fornecedores,
        ]);
    }

    /**
     * Generate requisições report.
     */
    public function requisicoes(Request $request): Response
    {
        $validated = $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'status' => 'nullable|string|in:pendente,autorizada,concretizada,cancelada',
            'emitente_id' => 'nullable|exists:emitentes,id',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
        ]);

        $query = Requisicao::query()
            ->where('status', '!=', 'excluida')
            ->with([
                'emitente',
                'destinatario',
                'fornecedor',
                'usuarioCriacao',
            ]);

        // Apply filters
        if (! empty($validated['data_inicio'])) {
            $query->whereDate(
                'data_recebimento',
                '>=',
                $validated['data_inicio'],
            );
        }

        if (! empty($validated['data_fim'])) {
            $query->whereDate('data_recebimento', '<=', $validated['data_fim']);
        }

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['emitente_id'])) {
            $query->where('emitente_id', $validated['emitente_id']);
        }

        if (! empty($validated['fornecedor_id'])) {
            $query->where('fornecedor_id', $validated['fornecedor_id']);
        }

        $requisicoes = $query->orderBy('data_recebimento', 'desc')->get();

        // Calculate statistics
        $stats = [
            'total_requisicoes' => $requisicoes->count(),
            'valor_total' => $requisicoes
                ->where('status', 'concretizada')
                ->sum('valor_final'),
            'requisicoes_por_status' => $requisicoes
                ->groupBy('status')
                ->map(fn ($group) => $group->count())
                ->toArray(),
            'valor_por_emitente' => $requisicoes
                ->where('status', 'concretizada')
                ->groupBy('emitente.nome')
                ->map(fn ($group) => $group->sum('valor_final'))
                ->toArray(),
            'valor_por_fornecedor' => $requisicoes
                ->where('status', 'concretizada')
                ->whereNotNull('fornecedor')
                ->groupBy('fornecedor.razao_social')
                ->map(fn ($group) => $group->sum('valor_final'))
                ->toArray(),
        ];

        $requisicoesList = $requisicoes->map(
            fn ($requisicao) => [
                'id' => $requisicao->id,
                'numero_completo' => $requisicao->numero_completo,
                'solicitante' => $requisicao->solicitante,
                'data_recebimento' => $requisicao->data_recebimento?->format(
                    'd/m/Y',
                ),
                'status' => $requisicao->status,
                'status_display' => $requisicao->status_display,
                'valor_final' => $requisicao->valor_final,
                'emitente' => $requisicao->emitente
                    ? [
                        'nome' => $requisicao->emitente->nome,
                        'sigla' => $requisicao->emitente->sigla,
                    ]
                    : null,
                'destinatario' => $requisicao->destinatario
                    ? [
                        'nome' => $requisicao->destinatario->nome,
                    ]
                    : null,
                'fornecedor' => $requisicao->fornecedor
                    ? [
                        'razao_social' => $requisicao->fornecedor->razao_social,
                    ]
                    : null,
            ],
        );

        // Get emitentes and fornecedores for dropdowns
        $emitentes = \App\Models\Emitente::orderBy('nome')->get([
            'id',
            'nome',
            'sigla',
        ]);
        $fornecedores = \App\Models\Fornecedor::where('status', true)
            ->orderBy('razao_social')
            ->get(['id', 'razao_social']);

        return Inertia::render('Relatorios/Requisicoes', [
            'requisicoes' => $requisicoesList,
            'stats' => $stats,
            'filters' => $validated,
            'emitentes' => $emitentes,
            'fornecedores' => $fornecedores,
        ]);
    }

    /**
     * Generate fornecedores report.
     */
    public function fornecedores(Request $request): Response
    {
        $validated = $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'status' => 'nullable|in:0,1',
        ]);

        $query = Fornecedor::query();

        // Apply status filter
        if (isset($validated['status']) && $validated['status'] !== '') {
            $query->where('status', (bool) $validated['status']);
        }

        $fornecedores = $query->get();

        // For each fornecedor, calculate statistics within the date range
        $fornecedoresList = $fornecedores
            ->map(function ($fornecedor) use ($validated) {
                $requisicoesQuery = $fornecedor
                    ->requisicoes()
                    ->where('status', 'concretizada');

                if (! empty($validated['data_inicio'])) {
                    $requisicoesQuery->whereDate(
                        'data_recebimento',
                        '>=',
                        $validated['data_inicio'],
                    );
                }

                if (! empty($validated['data_fim'])) {
                    $requisicoesQuery->whereDate(
                        'data_recebimento',
                        '<=',
                        $validated['data_fim'],
                    );
                }

                $requisicoes = $requisicoesQuery->get();
                $valorTotal = $requisicoes->sum('valor_final');

                return [
                    'id' => $fornecedor->id,
                    'razao_social' => $fornecedor->razao_social,
                    'cnpj_formatado' => $fornecedor->cnpj_formatado,
                    'telefone_formatado' => $fornecedor->telefone_formatado,
                    'email' => $fornecedor->email,
                    'status' => $fornecedor->status,
                    'status_display' => $fornecedor->status_display,
                    'total_requisicoes' => $requisicoes->count(),
                    'valor_total' => $valorTotal,
                    'created_at' => $fornecedor->created_at->format('d/m/Y'),
                ];
            })
            ->sortByDesc('valor_total')
            ->values();

        // Calculate overall statistics
        $stats = [
            'total_fornecedores' => $fornecedores->count(),
            'fornecedores_ativos' => $fornecedores
                ->where('status', true)
                ->count(),
            'fornecedores_inativos' => $fornecedores
                ->where('status', false)
                ->count(),
            'valor_total_geral' => $fornecedoresList->sum('valor_total'),
            'total_requisicoes' => $fornecedoresList->sum('total_requisicoes'),
            'fornecedores_com_movimento' => $fornecedoresList
                ->where('total_requisicoes', '>', 0)
                ->count(),
        ];

        return Inertia::render('Relatorios/Fornecedores', [
            'fornecedores' => $fornecedoresList,
            'stats' => $stats,
            'filters' => $validated,
        ]);
    }

    /**
     * Generate conferências report.
     */
    public function conferencias(Request $request): Response
    {
        $validated = $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
        ]);

        $query = Conferencia::with('fornecedor');

        // Apply filters
        if (! empty($validated['data_inicio'])) {
            $query->whereDate(
                'data_conferencia',
                '>=',
                $validated['data_inicio'],
            );
        }

        if (! empty($validated['data_fim'])) {
            $query->whereDate('data_conferencia', '<=', $validated['data_fim']);
        }

        if (! empty($validated['fornecedor_id'])) {
            $query->where('fornecedor_id', $validated['fornecedor_id']);
        }

        $conferencias = $query->orderBy('data_conferencia', 'desc')->get();

        // Calculate statistics
        $stats = [
            'total_conferencias' => $conferencias->count(),
            'valor_total_geral' => $conferencias->sum('total_geral'),
            'valor_total_requisicoes' => $conferencias->sum(
                'total_requisicoes',
            ),
            'valor_total_pedidos_manuais' => $conferencias->sum(
                'total_pedidos_manuais',
            ),
            'conferencias_por_fornecedor' => $conferencias
                ->groupBy('fornecedor.razao_social')
                ->map(
                    fn ($group) => [
                        'count' => $group->count(),
                        'valor_total' => $group->sum('total_geral'),
                    ],
                )
                ->toArray(),
            'conferencias_por_mes' => $conferencias
                ->groupBy(
                    fn ($conferencia) => \Carbon\Carbon::parse(
                        $conferencia->data_conferencia,
                    )->format('Y-m'),
                )
                ->map(
                    fn ($group) => [
                        'count' => $group->count(),
                        'valor_total' => $group->sum('total_geral'),
                    ],
                )
                ->toArray(),
        ];

        $conferenciasList = $conferencias->map(
            fn ($conferencia) => [
                'id' => $conferencia->id,
                'periodo' => $conferencia->periodo,
                'total_requisicoes' => $conferencia->total_requisicoes,
                'total_pedidos_manuais' => $conferencia->total_pedidos_manuais,
                'total_geral' => $conferencia->total_geral,
                'data_conferencia' => $conferencia->data_conferencia->format(
                    'd/m/Y',
                ),
                'observacoes' => $conferencia->observacoes,
                'fornecedor' => $conferencia->fornecedor
                    ? [
                        'id' => $conferencia->fornecedor->id,
                        'razao_social' => $conferencia->fornecedor->razao_social,
                        'cnpj_formatado' => $conferencia->fornecedor->cnpj_formatado,
                    ]
                    : null,
                'created_at' => $conferencia->created_at->format('d/m/Y H:i'),
            ],
        );

        // Get fornecedores for dropdown
        $fornecedores = \App\Models\Fornecedor::where('status', true)
            ->orderBy('razao_social')
            ->get(['id', 'razao_social']);

        return Inertia::render('Relatorios/Conferencias', [
            'conferencias' => $conferenciasList,
            'stats' => $stats,
            'filters' => $validated,
            'fornecedores' => $fornecedores,
        ]);
    }

    /**
     * Export requisições report.
     */
    public function exportRequisicoes(Request $request): void
    {
        $validated = $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'status' => 'nullable|string|in:pendente,autorizada,concretizada,cancelada',
            'emitente_id' => 'nullable|exists:emitentes,id',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'formato' => 'nullable|string|in:csv,excel',
        ]);

        $query = Requisicao::query()
            ->where('status', '!=', 'excluida')
            ->with([
                'emitente',
                'destinatario',
                'fornecedor',
                'usuarioCriacao',
            ]);

        // Apply filters
        if (! empty($validated['data_inicio'])) {
            $query->whereDate(
                'data_recebimento',
                '>=',
                $validated['data_inicio'],
            );
        }

        if (! empty($validated['data_fim'])) {
            $query->whereDate('data_recebimento', '<=', $validated['data_fim']);
        }

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['emitente_id'])) {
            $query->where('emitente_id', $validated['emitente_id']);
        }

        if (! empty($validated['fornecedor_id'])) {
            $query->where('fornecedor_id', $validated['fornecedor_id']);
        }

        $requisicoes = $query->orderBy('data_recebimento', 'desc')->get();

        $formato = $validated['formato'] ?? 'excel';

        if ($formato === 'excel') {
            $this->exportRequisicoesExcel($requisicoes);
        } else {
            $this->exportRequisicoesCsv($requisicoes);
        }
    }

    /**
     * Export requisições to Excel.
     */
    private function exportRequisicoesExcel($requisicoes): void
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set document properties
        $spreadsheet
            ->getProperties()
            ->setCreator('Sistema de Licitações')
            ->setTitle('Relatório de Requisições')
            ->setSubject('Requisições')
            ->setDescription('Relatório detalhado de requisições do sistema');

        // Set headers
        $headers = [
            'A1' => 'Número',
            'B1' => 'Solicitante',
            'C1' => 'Data Recebimento',
            'D1' => 'Status',
            'E1' => 'Valor Final',
            'F1' => 'Emitente',
            'G1' => 'Destinatário',
            'H1' => 'Fornecedor',
            'I1' => 'Usuário Criação',
            'J1' => 'Data Criação',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style headers
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];

        $sheet->getStyle('A1:J1')->applyFromArray($headerStyle);

        // Add data
        $row = 2;
        foreach ($requisicoes as $requisicao) {
            $sheet->setCellValue('A'.$row, $requisicao->numero_completo);
            $sheet->setCellValue('B'.$row, $requisicao->solicitante);
            $sheet->setCellValue(
                'C'.$row,
                $requisicao->data_recebimento?->format('d/m/Y') ?? '',
            );
            $sheet->setCellValue('D'.$row, $requisicao->status_display);
            $sheet->setCellValue(
                'E'.$row,
                $requisicao->valor_final
                    ? 'R$ '.
                        number_format(
                            (float) $requisicao->valor_final,
                            2,
                            ',',
                            '.',
                        )
                    : '',
            );
            $sheet->setCellValue(
                'F'.$row,
                $requisicao->emitente?->nome ?? '',
            );
            $sheet->setCellValue(
                'G'.$row,
                $requisicao->destinatario?->nome ?? '',
            );
            $sheet->setCellValue(
                'H'.$row,
                $requisicao->fornecedor?->razao_social ?? '',
            );
            $sheet->setCellValue(
                'I'.$row,
                $requisicao->usuarioCriacao?->name ?? '',
            );
            $sheet->setCellValue(
                'J'.$row,
                $requisicao->created_at->format('d/m/Y H:i'),
            );

            // Alternate row colors
            if ($row % 2 === 0) {
                $sheet
                    ->getStyle('A'.$row.':J'.$row)
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setRGB('F3F4F6');
            }

            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'J') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Add borders to all data
        $sheet->getStyle('A1:J'.($row - 1))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC'],
                ],
            ],
        ]);

        $writer = new Xlsx($spreadsheet);
        $filename = 'relatorio-requisicoes_'.date('Y-m-d_His').'.xlsx';

        header(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit();
    }

    /**
     * Export requisições to CSV.
     */
    private function exportRequisicoesCsv($requisicoes): void
    {
        $filename =
            'relatorio-requisicoes_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($requisicoes) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // CSV headers
            fputcsv(
                $file,
                [
                    'Número',
                    'Solicitante',
                    'Data Recebimento',
                    'Status',
                    'Valor Final',
                    'Emitente',
                    'Destinatário',
                    'Fornecedor',
                    'Usuário Criação',
                    'Data Criação',
                ],
                ';',
                '"',
                '\\',
            );

            foreach ($requisicoes as $requisicao) {
                fputcsv(
                    $file,
                    [
                        $requisicao->numero_completo,
                        $requisicao->solicitante,
                        $requisicao->data_recebimento?->format('d/m/Y') ?? '',
                        $requisicao->status_display,
                        $requisicao->valor_final
                            ? 'R$ '.
                                number_format(
                                    (float) $requisicao->valor_final,
                                    2,
                                    ',',
                                    '.',
                                )
                            : '',
                        $requisicao->emitente?->nome ?? '',
                        $requisicao->destinatario?->nome ?? '',
                        $requisicao->fornecedor?->razao_social ?? '',
                        $requisicao->usuarioCriacao?->name ?? '',
                        $requisicao->created_at->format('d/m/Y H:i'),
                    ],
                    ';',
                    '"',
                    '\\',
                );
            }

            fclose($file);
        };

        response()->stream($callback, 200, $headers)->send();
        exit();
    }

    /**
     * Export fornecedores report.
     */
    public function exportFornecedores(Request $request): void
    {
        $validated = $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'status' => 'nullable|in:0,1',
            'formato' => 'nullable|string|in:csv,excel',
        ]);

        $query = Fornecedor::query();

        // Apply status filter
        if (isset($validated['status']) && $validated['status'] !== '') {
            $query->where('status', (bool) $validated['status']);
        }

        $fornecedores = $query->get();

        // For each fornecedor, calculate statistics within the date range
        $fornecedoresList = $fornecedores->map(function ($fornecedor) use (
            $validated,
        ) {
            $requisicoesQuery = $fornecedor
                ->requisicoes()
                ->where('status', 'concretizada');

            if (! empty($validated['data_inicio'])) {
                $requisicoesQuery->whereDate(
                    'data_recebimento',
                    '>=',
                    $validated['data_inicio'],
                );
            }

            if (! empty($validated['data_fim'])) {
                $requisicoesQuery->whereDate(
                    'data_recebimento',
                    '<=',
                    $validated['data_fim'],
                );
            }

            $requisicoes = $requisicoesQuery->get();
            $valorTotal = $requisicoes->sum('valor_final');

            return [
                'razao_social' => $fornecedor->razao_social,
                'cnpj_formatado' => $fornecedor->cnpj_formatado,
                'telefone_formatado' => $fornecedor->telefone_formatado,
                'email' => $fornecedor->email,
                'status_display' => $fornecedor->status_display,
                'total_requisicoes' => $requisicoes->count(),
                'valor_total' => $valorTotal,
                'created_at' => $fornecedor->created_at->format('d/m/Y'),
            ];
        });

        $formato = $validated['formato'] ?? 'excel';

        if ($formato === 'excel') {
            $this->exportFornecedoresExcel($fornecedoresList);
        } else {
            $this->exportFornecedoresCsv($fornecedoresList);
        }
    }

    /**
     * Export fornecedores to Excel.
     */
    private function exportFornecedoresExcel($fornecedoresList): void
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set document properties
        $spreadsheet
            ->getProperties()
            ->setCreator('Sistema de Licitações')
            ->setTitle('Relatório de Fornecedores')
            ->setSubject('Fornecedores')
            ->setDescription('Relatório detalhado de fornecedores do sistema');

        // Set headers
        $headers = [
            'A1' => 'Razão Social',
            'B1' => 'CNPJ',
            'C1' => 'Telefone',
            'D1' => 'Email',
            'E1' => 'Status',
            'F1' => 'Total Requisições',
            'G1' => 'Valor Total',
            'H1' => 'Data Cadastro',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style headers
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];

        $sheet->getStyle('A1:H1')->applyFromArray($headerStyle);

        // Add data
        $row = 2;
        foreach ($fornecedoresList as $fornecedor) {
            $sheet->setCellValue('A'.$row, $fornecedor['razao_social']);
            $sheet->setCellValue('B'.$row, $fornecedor['cnpj_formatado']);
            $sheet->setCellValue('C'.$row, $fornecedor['telefone_formatado']);
            $sheet->setCellValue('D'.$row, $fornecedor['email']);
            $sheet->setCellValue('E'.$row, $fornecedor['status_display']);
            $sheet->setCellValue('F'.$row, $fornecedor['total_requisicoes']);
            $sheet->setCellValue(
                'G'.$row,
                'R$ '.number_format($fornecedor['valor_total'], 2, ',', '.'),
            );
            $sheet->setCellValue('H'.$row, $fornecedor['created_at']);

            // Alternate row colors
            if ($row % 2 === 0) {
                $sheet
                    ->getStyle('A'.$row.':H'.$row)
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setRGB('F3F4F6');
            }

            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Add borders to all data
        $sheet->getStyle('A1:H'.($row - 1))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC'],
                ],
            ],
        ]);

        $writer = new Xlsx($spreadsheet);
        $filename = 'relatorio-fornecedores_'.date('Y-m-d_His').'.xlsx';

        header(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit();
    }

    /**
     * Export fornecedores to CSV.
     */
    private function exportFornecedoresCsv($fornecedoresList): void
    {
        $filename =
            'relatorio-fornecedores_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($fornecedoresList) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // CSV headers
            fputcsv(
                $file,
                [
                    'Razão Social',
                    'CNPJ',
                    'Telefone',
                    'Email',
                    'Status',
                    'Total Requisições',
                    'Valor Total',
                    'Data Cadastro',
                ],
                ';',
                '"',
                '\\',
            );

            foreach ($fornecedoresList as $fornecedor) {
                fputcsv(
                    $file,
                    [
                        $fornecedor['razao_social'],
                        $fornecedor['cnpj_formatado'],
                        $fornecedor['telefone_formatado'],
                        $fornecedor['email'],
                        $fornecedor['status_display'],
                        $fornecedor['total_requisicoes'],
                        'R$ '.
                        number_format($fornecedor['valor_total'], 2, ',', '.'),
                        $fornecedor['created_at'],
                    ],
                    ';',
                    '"',
                    '\\',
                );
            }

            fclose($file);
        };

        response()->stream($callback, 200, $headers)->send();
        exit();
    }

    /**
     * Export conferências report.
     */
    public function exportConferencias(Request $request): void
    {
        $validated = $request->validate([
            'data_inicio' => 'nullable|date',
            'data_fim' => 'nullable|date|after_or_equal:data_inicio',
            'fornecedor_id' => 'nullable|exists:fornecedores,id',
            'formato' => 'nullable|string|in:csv,excel',
        ]);

        $query = Conferencia::with('fornecedor');

        // Apply filters
        if (! empty($validated['data_inicio'])) {
            $query->whereDate(
                'data_conferencia',
                '>=',
                $validated['data_inicio'],
            );
        }

        if (! empty($validated['data_fim'])) {
            $query->whereDate('data_conferencia', '<=', $validated['data_fim']);
        }

        if (! empty($validated['fornecedor_id'])) {
            $query->where('fornecedor_id', $validated['fornecedor_id']);
        }

        $conferencias = $query->orderBy('data_conferencia', 'desc')->get();

        $formato = $validated['formato'] ?? 'excel';

        if ($formato === 'excel') {
            $this->exportConferenciasExcel($conferencias);
        } else {
            $this->exportConferenciasCsv($conferencias);
        }
    }

    /**
     * Export conferências to Excel.
     */
    private function exportConferenciasExcel($conferencias): void
    {
        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();

        // Set document properties
        $spreadsheet
            ->getProperties()
            ->setCreator('Sistema de Licitações')
            ->setTitle('Relatório de Conferências')
            ->setSubject('Conferências')
            ->setDescription('Relatório detalhado de conferências do sistema');

        // Set headers
        $headers = [
            'A1' => 'Período',
            'B1' => 'Fornecedor',
            'C1' => 'CNPJ',
            'D1' => 'Total Requisições',
            'E1' => 'Total Pedidos Manuais',
            'F1' => 'Total Geral',
            'G1' => 'Data Conferência',
            'H1' => 'Observações',
            'I1' => 'Data Criação',
        ];

        foreach ($headers as $cell => $value) {
            $sheet->setCellValue($cell, $value);
        }

        // Style headers
        $headerStyle = [
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 11,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2563EB'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => '000000'],
                ],
            ],
        ];

        $sheet->getStyle('A1:I1')->applyFromArray($headerStyle);

        // Add data
        $row = 2;
        foreach ($conferencias as $conferencia) {
            $sheet->setCellValue('A'.$row, $conferencia->periodo);
            $sheet->setCellValue(
                'B'.$row,
                $conferencia->fornecedor?->razao_social ?? '',
            );
            $sheet->setCellValue(
                'C'.$row,
                $conferencia->fornecedor?->cnpj_formatado ?? '',
            );
            $sheet->setCellValue(
                'D'.$row,
                'R$ '.
                    number_format(
                        (float) $conferencia->total_requisicoes,
                        2,
                        ',',
                        '.',
                    ),
            );
            $sheet->setCellValue(
                'E'.$row,
                'R$ '.
                    number_format(
                        (float) $conferencia->total_pedidos_manuais,
                        2,
                        ',',
                        '.',
                    ),
            );
            $sheet->setCellValue(
                'F'.$row,
                'R$ '.
                    number_format(
                        (float) $conferencia->total_geral,
                        2,
                        ',',
                        '.',
                    ),
            );
            $sheet->setCellValue(
                'G'.$row,
                $conferencia->data_conferencia->format('d/m/Y'),
            );
            $sheet->setCellValue('H'.$row, $conferencia->observacoes ?? '');
            $sheet->setCellValue(
                'I'.$row,
                $conferencia->created_at->format('d/m/Y H:i'),
            );

            // Alternate row colors
            if ($row % 2 === 0) {
                $sheet
                    ->getStyle('A'.$row.':I'.$row)
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setRGB('F3F4F6');
            }

            $row++;
        }

        // Auto-size columns
        foreach (range('A', 'I') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        // Add borders to all data
        $sheet->getStyle('A1:I'.($row - 1))->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC'],
                ],
            ],
        ]);

        $writer = new Xlsx($spreadsheet);
        $filename = 'relatorio-conferencias_'.date('Y-m-d_His').'.xlsx';

        header(
            'Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        );
        header('Content-Disposition: attachment;filename="'.$filename.'"');
        header('Cache-Control: max-age=0');

        $writer->save('php://output');
        exit();
    }

    /**
     * Export conferências to CSV.
     */
    private function exportConferenciasCsv($conferencias): void
    {
        $filename =
            'relatorio-conferencias_'.now()->format('Y-m-d_H-i-s').'.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
            'Pragma' => 'public',
        ];

        $callback = function () use ($conferencias) {
            $file = fopen('php://output', 'w');

            // Add UTF-8 BOM for proper Excel handling
            fwrite($file, "\xEF\xBB\xBF");

            // CSV headers
            fputcsv(
                $file,
                [
                    'Período',
                    'Fornecedor',
                    'CNPJ',
                    'Total Requisições',
                    'Total Pedidos Manuais',
                    'Total Geral',
                    'Data Conferência',
                    'Observações',
                    'Data Criação',
                ],
                ';',
                '"',
                '\\',
            );

            foreach ($conferencias as $conferencia) {
                fputcsv(
                    $file,
                    [
                        $conferencia->periodo,
                        $conferencia->fornecedor?->razao_social ?? '',
                        $conferencia->fornecedor?->cnpj_formatado ?? '',
                        'R$ '.
                        number_format(
                            (float) $conferencia->total_requisicoes,
                            2,
                            ',',
                            '.',
                        ),
                        'R$ '.
                        number_format(
                            (float) $conferencia->total_pedidos_manuais,
                            2,
                            ',',
                            '.',
                        ),
                        'R$ '.
                        number_format(
                            (float) $conferencia->total_geral,
                            2,
                            ',',
                            '.',
                        ),
                        $conferencia->data_conferencia->format('d/m/Y'),
                        $conferencia->observacoes ?? '',
                        $conferencia->created_at->format('d/m/Y H:i'),
                    ],
                    ';',
                    '"',
                    '\\',
                );
            }

            fclose($file);
        };

        response()->stream($callback, 200, $headers)->send();
        exit();
    }
}
