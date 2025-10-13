<?php

namespace App\Http\Controllers;

use App\Models\Relatorio;
use App\Models\EstatisticaMaterial;
use App\Models\Item;
use App\Models\Contrato;
use App\Models\ContratoItem;
use App\Models\CategoriaMaterial;
use App\Models\DispensaLicitacao;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\RelatorioMateriaisExport;
use App\Exports\RelatorioContratosExport;
use App\Exports\RelatorioDispensasExport;

class RelatorioController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index()
    {
        return view("relatorios.index");
    }

    /**
     * Get dashboard data for charts.
     */
    public function getDashboardData(Request $request): JsonResponse
    {
        $ano = $request->input("ano", now()->year);
        $mes = $request->input("mes", now()->month);

        try {
            // Top materials by value
            $topMateriaisPorValor = EstatisticaMaterial::getTopItensPorValor(
                $ano,
                $mes,
                10,
            );

            // Top materials by quantity
            $topMateriaisPorQuantidade = EstatisticaMaterial::getTopItensPorQuantidade(
                $ano,
                $mes,
                10,
            );

            // Category summary
            $resumoPorCategoria = EstatisticaMaterial::getResumoPorCategoria(
                $ano,
                $mes,
            );

            // Price variations
            $topVariacoes = EstatisticaMaterial::getTopVariacoesPreco(
                $ano,
                $mes,
                10,
            );

            // Monthly trend
            $tendenciaMensal = $this->getTendenciaMensalGeral($ano, $mes);

            // Contract status distribution
            $distribuicaoContratos = $this->getDistribuicaoContratos();

            // Dispensa limits by category
            $limitesDispensa = $this->getLimitesDispensaPorCategoria(
                $ano,
                $mes,
            );

            return response()->json([
                "top_materiais_valor" => $topMateriaisPorValor,
                "top_materiais_quantidade" => $topMateriaisPorQuantidade,
                "resumo_categorias" => $resumoPorCategoria,
                "top_variacoes" => $topVariacoes,
                "tendencia_mensal" => $tendenciaMensal,
                "distribuicao_contratos" => $distribuicaoContratos,
                "limites_dispensa" => $limitesDispensa,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "error" =>
                        "Erro ao carregar dados do dashboard: " .
                        $e->getMessage(),
                ],
                500,
            );
        }
    }

    /**
     * Generate a new report.
     */
    public function gerar(Request $request): JsonResponse
    {
        $request->validate([
            "tipo" =>
                "required|in:materiais,servicos,contratos,dispensas,uso_categorias,fornecedores",
            "formato" => "required|in:pdf,xlsx,csv",
            "parametros" => "nullable|array",
        ]);

        try {
            $relatorio = Relatorio::create([
                "nome" => $this->gerarNomeRelatorio(
                    $request->tipo,
                    $request->parametros,
                ),
                "tipo" => $request->tipo,
                "formato" => $request->formato,
                "parametros" => $request->parametros,
                "status" => Relatorio::STATUS_GERANDO,
                "usuario_solicitante_id" => Auth::id(),
            ]);

            // Process report asynchronously (in a real app, use queues)
            $this->processarRelatorio($relatorio);

            return response()->json([
                "success" => true,
                "relatorio_id" => $relatorio->id,
                "message" => "Relatório iniciado com sucesso",
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    "success" => false,
                    "error" => "Erro ao gerar relatório: " . $e->getMessage(),
                ],
                500,
            );
        }
    }

    /**
     * Get report list.
     */
    public function listar(Request $request): JsonResponse
    {
        $relatorios = Relatorio::with(["usuarioSolicitante"])
            ->orderBy("data_geracao", "desc")
            ->paginate(15);

        return response()->json($relatorios);
    }

    /**
     * Download a report.
     */
    public function download(Relatorio $relatorio)
    {
        if (!$relatorio->podeBaixar()) {
            abort(404, "Relatório não encontrado para download");
        }

        $filePath = storage_path("app/" . $relatorio->arquivo_path);

        if (!file_exists($filePath)) {
            abort(404, "Arquivo do relatório não encontrado");
        }

        return response()->download(
            $filePath,
            $relatorio->nome . "." . $relatorio->arquivo_formato,
        );
    }

    /**
     * Delete a report.
     */
    public function excluir(Relatorio $relatorio): JsonResponse
    {
        if (
            $relatorio->usuario_solicitante_id !== Auth::id() &&
            !Auth::user()->hasRole("admin")
        ) {
            return response()->json(["error" => "Não autorizado"], 403);
        }

        try {
            // Delete file if exists
            if (
                $relatorio->arquivo_path &&
                file_exists(storage_path("app/" . $relatorio->arquivo_path))
            ) {
                unlink(storage_path("app/" . $relatorio->arquivo_path));
            }

            $relatorio->delete();

            return response()->json(["success" => true]);
        } catch (\Exception $e) {
            return response()->json(
                ["error" => "Erro ao excluir relatório"],
                500,
            );
        }
    }

    /**
     * Get materials usage data for charts.
     */
    public function getDadosMateriais(Request $request): JsonResponse
    {
        $ano = $request->input("ano", now()->year);
        $mes = $request->input("mes", now()->month);
        $categoriaId = $request->input("categoria_id");

        $query = EstatisticaMaterial::with(["item", "categoria"])
            ->where("ano", $ano)
            ->where("mes", $mes);

        if ($categoriaId) {
            $query->where("categoria_material_id", $categoriaId);
        }

        $dados = $query->orderBy("valor_total", "desc")->get();

        return response()->json($dados);
    }

    /**
     * Get contract data for charts.
     */
    public function getDadosContratos(Request $request): JsonResponse
    {
        $ano = $request->input("ano", now()->year);

        $dados = Contrato::selectRaw(
            '
                MONTH(data_inicio) as mes,
                COUNT(*) as total_contratos,
                SUM(valor_total) as valor_total,
                AVG(valor_total) as valor_medio
            ',
        )
            ->whereYear("data_inicio", $ano)
            ->groupBy("mes")
            ->orderBy("mes")
            ->get();

        return response()->json($dados);
    }

    /**
     * Process report generation.
     */
    private function processarRelatorio(Relatorio $relatorio): void
    {
        try {
            $fileName = Relatorio::gerarNomeArquivo(
                $relatorio->tipo,
                $relatorio->arquivo_formato,
            );
            $filePath = $fileName;

            switch ($relatorio->tipo) {
                case Relatorio::TIPO_MATERIAIS:
                    $this->gerarRelatorioMateriais($relatorio, $filePath);
                    break;

                case Relatorio::TIPO_CONTRATOS:
                    $this->gerarRelatorioContratos($relatorio, $filePath);
                    break;

                case Relatorio::TIPO_DISPENSAS:
                    $this->gerarRelatorioDispensas($relatorio, $filePath);
                    break;

                case Relatorio::TIPO_USO_CATEGORIAS:
                    $this->gerarRelatorioUsoCategorias($relatorio, $filePath);
                    break;

                default:
                    throw new \Exception("Tipo de relatório não implementado");
            }

            $relatorio->marcarComoConcluido(
                $filePath,
                $relatorio->arquivo_formato,
            );
        } catch (\Exception $e) {
            $relatorio->marcarComoErro($e->getMessage());
        }
    }

    /**
     * Generate materials report.
     */
    private function gerarRelatorioMateriais(
        Relatorio $relatorio,
        string $filePath,
    ): void {
        $parametros = $relatorio->parametros;
        $ano = $parametros["ano"] ?? now()->year;
        $mes = $parametros["mes"] ?? now()->month;

        $dados = EstatisticaMaterial::with(["item", "categoria"])
            ->where("ano", $ano)
            ->when(isset($parametros["mes"]), function ($query) use ($mes) {
                return $query->where("mes", $mes);
            })
            ->when(isset($parametros["categoria_id"]), function ($query) use (
                $parametros,
            ) {
                return $query->where(
                    "categoria_material_id",
                    $parametros["categoria_id"],
                );
            })
            ->get();

        switch ($relatorio->arquivo_formato) {
            case Relatorio::FORMATO_PDF:
                $pdf = PDF::loadView("relatorios.pdf.materiais", [
                    "dados" => $dados,
                    "parametros" => $parametros,
                    "relatorio" => $relatorio,
                ]);
                Storage::put($filePath, $pdf->output());
                break;

            case Relatorio::FORMATO_XLSX:
                Excel::store(
                    new RelatorioMateriaisExport($dados, $parametros),
                    $filePath,
                );
                break;

            case Relatorio::FORMATO_CSV:
                Excel::store(
                    new RelatorioMateriaisExport($dados, $parametros),
                    $filePath,
                    \Maatwebsite\Excel\Excel::CSV,
                );
                break;
        }
    }

    /**
     * Generate contracts report.
     */
    private function gerarRelatorioContratos(
        Relatorio $relatorio,
        string $filePath,
    ): void {
        $parametros = $relatorio->parametros;

        $query = Contrato::with(["fornecedor", "items.item", "usuarioCriacao"]);

        if (isset($parametros["ano"])) {
            $query->whereYear("data_inicio", $parametros["ano"]);
        }

        if (isset($parametros["status"])) {
            $query->where("status", $parametros["status"]);
        }

        if (isset($parametros["fornecedor_id"])) {
            $query->where("fornecedor_id", $parametros["fornecedor_id"]);
        }

        $dados = $query->get();

        switch ($relatorio->arquivo_formato) {
            case Relatorio::FORMATO_PDF:
                $pdf = PDF::loadView("relatorios.pdf.contratos", [
                    "dados" => $dados,
                    "parametros" => $parametros,
                    "relatorio" => $relatorio,
                ]);
                Storage::put($filePath, $pdf->output());
                break;

            case Relatorio::FORMATO_XLSX:
                Excel::store(
                    new RelatorioContratosExport($dados, $parametros),
                    $filePath,
                );
                break;

            case Relatorio::FORMATO_CSV:
                Excel::store(
                    new RelatorioContratosExport($dados, $parametros),
                    $filePath,
                    \Maatwebsite\Excel\Excel::CSV,
                );
                break;
        }
    }

    /**
     * Generate dispensas report.
     */
    private function gerarRelatorioDispensas(
        Relatorio $relatorio,
        string $filePath,
    ): void {
        $parametros = $relatorio->parametros;

        $query = DispensaLicitacao::with(["categoriaMaterial"]);

        if (isset($parametros["ano"])) {
            $query->whereYear("data_dispensa", $parametros["ano"]);
        }

        if (isset($parametros["categoria_id"])) {
            $query->where("categoria_material_id", $parametros["categoria_id"]);
        }

        $dados = $query->get();

        switch ($relatorio->arquivo_formato) {
            case Relatorio::FORMATO_PDF:
                $pdf = PDF::loadView("relatorios.pdf.dispensas", [
                    "dados" => $dados,
                    "parametros" => $parametros,
                    "relatorio" => $relatorio,
                ]);
                Storage::put($filePath, $pdf->output());
                break;

            case Relatorio::FORMATO_XLSX:
                Excel::store(
                    new RelatorioDispensasExport($dados, $parametros),
                    $filePath,
                );
                break;

            case Relatorio::FORMATO_CSV:
                Excel::store(
                    new RelatorioDispensasExport($dados, $parametros),
                    $filePath,
                    \Maatwebsite\Excel\Excel::CSV,
                );
                break;
        }
    }

    /**
     * Generate category usage report.
     */
    private function gerarRelatorioUsoCategorias(
        Relatorio $relatorio,
        string $filePath,
    ): void {
        $parametros = $relatorio->parametros;
        $ano = $parametros["ano"] ?? now()->year;

        $dados = [];

        for ($mes = 1; $mes <= 12; $mes++) {
            $resumo = EstatisticaMaterial::getResumoPorCategoria($ano, $mes);
            if ($resumo->isNotEmpty()) {
                $dados[] = [
                    "mes" => $mes,
                    "ano" => $ano,
                    "periodo" => sprintf("%02d/%d", $mes, $ano),
                    "categorias" => $resumo,
                ];
            }
        }

        switch ($relatorio->arquivo_formato) {
            case Relatorio::FORMATO_PDF:
                $pdf = PDF::loadView("relatorios.pdf.uso_categorias", [
                    "dados" => $dados,
                    "parametros" => $parametros,
                    "relatorio" => $relatorio,
                ]);
                Storage::put($filePath, $pdf->output());
                break;

            case Relatorio::FORMATO_XLSX:
                // Implement Excel export for categories usage
                break;

            case Relatorio::FORMATO_CSV:
                // Implement CSV export for categories usage
                break;
        }
    }

    /**
     * Generate report name.
     */
    private function gerarNomeRelatorio(
        string $tipo,
        array $parametros = [],
    ): string {
        $tipos = Relatorio::getTiposDisponiveis();
        $nome = $tipos[$tipo] ?? "Relatório";

        if (isset($parametros["ano"])) {
            $nome .= " - " . $parametros["ano"];
        }

        if (isset($parametros["mes"])) {
            $nome .= "/" . str_pad($parametros["mes"], 2, "0", STR_PAD_LEFT);
        }

        return $nome;
    }

    /**
     * Get monthly trend data.
     */
    private function getTendenciaMensalGeral(int $ano, int $mes): array
    {
        $dados = [];

        for ($i = 11; $i >= 0; $i--) {
            $data = now()->create($ano, $mes, 1)->subMonths($i);
            $estatisticas = EstatisticaMaterial::where("ano", $data->year)
                ->where("mes", $data->month)
                ->selectRaw(
                    '
                    SUM(valor_total) as valor_total,
                    SUM(quantidade_total) as quantidade_total,
                    COUNT(DISTINCT item_id) as itens_distintos
                ',
                )
                ->first();

            $dados[] = [
                "periodo" => $data->format("Y-m"),
                "mes" => $data->format("M/Y"),
                "valor_total" => (float) ($estatisticas->valor_total ?? 0),
                "quantidade_total" => $estatisticas->quantidade_total ?? 0,
                "itens_distintos" => $estatisticas->itens_distintos ?? 0,
            ];
        }

        return $dados;
    }

    /**
     * Get contract status distribution.
     */
    private function getDistribuicaoContratos(): array
    {
        return Contrato::selectRaw(
            "status, COUNT(*) as total, SUM(valor_total) as valor_total",
        )
            ->groupBy("status")
            ->get()
            ->map(function ($item) {
                return [
                    "status" => $item->status,
                    "status_display" => $item->status_display ?? $item->status,
                    "total" => $item->total,
                    "valor_total" => (float) $item->valor_total,
                ];
            })
            ->toArray();
    }

    /**
     * Get dispensa limits by category.
     */
    private function getLimitesDispensaPorCategoria(int $ano, int $mes): array
    {
        return CategoriaMaterial::with([
            "dispensaLicitacoes" => function ($query) use ($ano, $mes) {
                $query
                    ->whereYear("data_dispensa", $ano)
                    ->whereMonth("data_dispensa", $mes);
            },
        ])
            ->where("ativo", true)
            ->get()
            ->map(function ($categoria) use ($ano, $mes) {
                $valorUsado = $categoria->dispensaLicitacoes->sum("valor");
                $limiteMensal = $categoria->limite_dispensa_mensal;
                $percentualUsado =
                    $limiteMensal > 0 ? ($valorUsado / $limiteMensal) * 100 : 0;

                return [
                    "categoria" => $categoria->nome,
                    "valor_usado" => $valorUsado,
                    "limite_mensal" => $limiteMensal,
                    "percentual_usado" => round($percentualUsado, 2),
                    "status" =>
                        $percentualUsado >= $categoria->bloqueio_percentual
                            ? "bloqueio"
                            : ($percentualUsado >= $categoria->alerta_percentual
                                ? "alerta"
                                : "normal"),
                ];
            })
            ->toArray();
    }
}
