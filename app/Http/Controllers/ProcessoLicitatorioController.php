<?php

namespace App\Http\Controllers;

use App\Models\ProcessoLicitatorio;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProcessoLicitatorioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = ProcessoLicitatorio::query()->with([
            "usuarioResponsavel",
            "usuarioCriacao",
        ]);

        // Search filter
        if ($request->filled("search")) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled("status")) {
            $query->status($request->status);
        }

        // Modalidade filter
        if ($request->filled("modalidade")) {
            $query->modalidade($request->modalidade);
        }

        // Date range filter
        if ($request->filled("data_inicio")) {
            $query->where("data_abertura", ">=", $request->data_inicio);
        }

        if ($request->filled("data_fim")) {
            $query->where("data_abertura", "<=", $request->data_fim);
        }

        // Sorting
        $sortField = $request->get("sort", "created_at");
        $sortDirection = $request->get("direction", "desc");

        $query->orderBy($sortField, $sortDirection);

        $processos = $query
            ->paginate($request->get("per_page", 15))
            ->withQueryString()
            ->through(function ($processo) {
                return [
                    "id" => $processo->id,
                    "numero_processo" => $processo->numero_processo,
                    "objeto" => $processo->objeto,
                    "modalidade" => $processo->modalidade,
                    "modalidade_display" => $processo->modalidade_display,
                    "tipo_licitacao" => $processo->tipo_licitacao,
                    "tipo_licitacao_display" =>
                        $processo->tipo_licitacao_display,
                    "status" => $processo->status,
                    "status_display" => $processo->status_display,
                    "status_color" => $processo->status_color,
                    "data_abertura" => $processo->data_abertura?->format(
                        "Y-m-d",
                    ),
                    "data_abertura_formatted" => $processo->data_abertura?->format(
                        "d/m/Y",
                    ),
                    "data_homologacao" => $processo->data_homologacao?->format(
                        "Y-m-d",
                    ),
                    "data_adjudicacao" => $processo->data_adjudicacao?->format(
                        "Y-m-d",
                    ),
                    "valor_estimado" => $processo->valor_estimado,
                    "valor_adjudicado" => $processo->valor_adjudicado,
                    "setor_requisitante" => $processo->setor_requisitante,
                    "usuario_responsavel" => $processo->usuarioResponsavel
                        ? [
                            "id" => $processo->usuarioResponsavel->id,
                            "name" => $processo->usuarioResponsavel->name,
                        ]
                        : null,
                    "pode_editar" => $processo->podeEditar(),
                    "pode_excluir" => $processo->podeExcluir(),
                    "is_finalizado" => $processo->isFinalizado(),
                    "economia_percentual" => $processo->economia_percentual,
                    "created_at" => $processo->created_at->format("d/m/Y H:i"),
                ];
            });

        return Inertia::render("ProcessosLicitatorios/Index", [
            "processos" => $processos,
            "filters" => $request->only([
                "search",
                "status",
                "modalidade",
                "data_inicio",
                "data_fim",
            ]),
            "modalidades" => ProcessoLicitatorio::getModalidades(),
            "status_options" => ProcessoLicitatorio::getStatus(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $usuarios = User::where("tipo_usuario", "operacional")
            ->orderBy("name")
            ->get(["id", "name"]);

        return Inertia::render("ProcessosLicitatorios/Create", [
            "modalidades" => ProcessoLicitatorio::getModalidades(),
            "tipos_licitacao" => ProcessoLicitatorio::getTiposLicitacao(),
            "usuarios" => $usuarios,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            "numero_processo" => [
                "required",
                "string",
                "max:255",
                "unique:processos_licitatorios,numero_processo",
            ],
            "objeto" => ["required", "string", "max:255"],
            "descricao" => ["nullable", "string"],
            "modalidade" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getModalidades())),
            ],
            "tipo_licitacao" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getTiposLicitacao())),
            ],
            "status" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getStatus())),
            ],
            "data_abertura" => ["nullable", "date"],
            "data_homologacao" => [
                "nullable",
                "date",
                "after_or_equal:data_abertura",
            ],
            "data_adjudicacao" => [
                "nullable",
                "date",
                "after_or_equal:data_homologacao",
            ],
            "valor_estimado" => ["nullable", "numeric", "min:0"],
            "valor_adjudicado" => ["nullable", "numeric", "min:0"],
            "setor_requisitante" => ["nullable", "string", "max:255"],
            "usuario_responsavel_id" => ["nullable", "exists:users,id"],
            "observacoes" => ["nullable", "string"],
        ]);

        $validated["usuario_criacao_id"] = auth()->id();

        $processo = ProcessoLicitatorio::create($validated);

        return redirect()
            ->route("processos-licitatorios.show", $processo)
            ->with("success", "Processo licitatório criado com sucesso!");
    }

    /**
     * Display the specified resource.
     */
    public function show(ProcessoLicitatorio $processoLicitatorio)
    {
        $processoLicitatorio->load([
            "usuarioResponsavel",
            "usuarioCriacao",
            "contratos.fornecedor",
        ]);

        return Inertia::render("ProcessosLicitatorios/Show", [
            "processo" => [
                "id" => $processoLicitatorio->id,
                "numero_processo" => $processoLicitatorio->numero_processo,
                "objeto" => $processoLicitatorio->objeto,
                "descricao" => $processoLicitatorio->descricao,
                "modalidade" => $processoLicitatorio->modalidade,
                "modalidade_display" =>
                    $processoLicitatorio->modalidade_display,
                "tipo_licitacao" => $processoLicitatorio->tipo_licitacao,
                "tipo_licitacao_display" =>
                    $processoLicitatorio->tipo_licitacao_display,
                "status" => $processoLicitatorio->status,
                "status_display" => $processoLicitatorio->status_display,
                "status_color" => $processoLicitatorio->status_color,
                "data_abertura" => $processoLicitatorio->data_abertura?->format(
                    "Y-m-d",
                ),
                "data_abertura_formatted" => $processoLicitatorio->data_abertura?->format(
                    "d/m/Y",
                ),
                "data_homologacao" => $processoLicitatorio->data_homologacao?->format(
                    "Y-m-d",
                ),
                "data_homologacao_formatted" => $processoLicitatorio->data_homologacao?->format(
                    "d/m/Y",
                ),
                "data_adjudicacao" => $processoLicitatorio->data_adjudicacao?->format(
                    "Y-m-d",
                ),
                "data_adjudicacao_formatted" => $processoLicitatorio->data_adjudicacao?->format(
                    "d/m/Y",
                ),
                "valor_estimado" => $processoLicitatorio->valor_estimado,
                "valor_adjudicado" => $processoLicitatorio->valor_adjudicado,
                "setor_requisitante" =>
                    $processoLicitatorio->setor_requisitante,
                "observacoes" => $processoLicitatorio->observacoes,
                "usuario_responsavel" => $processoLicitatorio->usuarioResponsavel
                    ? [
                        "id" => $processoLicitatorio->usuarioResponsavel->id,
                        "name" =>
                            $processoLicitatorio->usuarioResponsavel->name,
                    ]
                    : null,
                "usuario_criacao" => [
                    "id" => $processoLicitatorio->usuarioCriacao->id,
                    "name" => $processoLicitatorio->usuarioCriacao->name,
                ],
                "contratos" => $processoLicitatorio->contratos->map(function (
                    $contrato,
                ) {
                    return [
                        "id" => $contrato->id,
                        "numero_contrato" => $contrato->numero_contrato,
                        "fornecedor" => [
                            "id" => $contrato->fornecedor->id,
                            "nome" => $contrato->fornecedor->nome,
                        ],
                        "data_inicio" => $contrato->data_inicio->format(
                            "d/m/Y",
                        ),
                        "data_fim" => $contrato->data_fim->format("d/m/Y"),
                        "status" => $contrato->status,
                        "status_display" => $contrato->status_display,
                    ];
                }),
                "pode_editar" => $processoLicitatorio->podeEditar(),
                "pode_excluir" => $processoLicitatorio->podeExcluir(),
                "is_finalizado" => $processoLicitatorio->isFinalizado(),
                "duracao_em_dias" => $processoLicitatorio->duracao_em_dias,
                "economia_percentual" =>
                    $processoLicitatorio->economia_percentual,
                "economia_valor" => $processoLicitatorio->economia_valor,
                "created_at" => $processoLicitatorio->created_at->format(
                    "d/m/Y H:i",
                ),
                "updated_at" => $processoLicitatorio->updated_at->format(
                    "d/m/Y H:i",
                ),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProcessoLicitatorio $processoLicitatorio)
    {
        if (!$processoLicitatorio->podeEditar()) {
            return redirect()
                ->route("processos-licitatorios.show", $processoLicitatorio)
                ->with("error", "Este processo não pode ser editado.");
        }

        $usuarios = User::where("tipo_usuario", "operacional")
            ->orderBy("name")
            ->get(["id", "name"]);

        return Inertia::render("ProcessosLicitatorios/Edit", [
            "processo" => [
                "id" => $processoLicitatorio->id,
                "numero_processo" => $processoLicitatorio->numero_processo,
                "objeto" => $processoLicitatorio->objeto,
                "descricao" => $processoLicitatorio->descricao,
                "modalidade" => $processoLicitatorio->modalidade,
                "tipo_licitacao" => $processoLicitatorio->tipo_licitacao,
                "status" => $processoLicitatorio->status,
                "data_abertura" => $processoLicitatorio->data_abertura?->format(
                    "Y-m-d",
                ),
                "data_homologacao" => $processoLicitatorio->data_homologacao?->format(
                    "Y-m-d",
                ),
                "data_adjudicacao" => $processoLicitatorio->data_adjudicacao?->format(
                    "Y-m-d",
                ),
                "valor_estimado" => $processoLicitatorio->valor_estimado,
                "valor_adjudicado" => $processoLicitatorio->valor_adjudicado,
                "setor_requisitante" =>
                    $processoLicitatorio->setor_requisitante,
                "usuario_responsavel_id" =>
                    $processoLicitatorio->usuario_responsavel_id,
                "observacoes" => $processoLicitatorio->observacoes,
            ],
            "modalidades" => ProcessoLicitatorio::getModalidades(),
            "tipos_licitacao" => ProcessoLicitatorio::getTiposLicitacao(),
            "status_options" => ProcessoLicitatorio::getStatus(),
            "usuarios" => $usuarios,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(
        Request $request,
        ProcessoLicitatorio $processoLicitatorio,
    ) {
        if (!$processoLicitatorio->podeEditar()) {
            return redirect()
                ->route("processos-licitatorios.show", $processoLicitatorio)
                ->with("error", "Este processo não pode ser editado.");
        }

        $validated = $request->validate([
            "numero_processo" => [
                "required",
                "string",
                "max:255",
                Rule::unique(
                    "processos_licitatorios",
                    "numero_processo",
                )->ignore($processoLicitatorio->id),
            ],
            "objeto" => ["required", "string", "max:255"],
            "descricao" => ["nullable", "string"],
            "modalidade" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getModalidades())),
            ],
            "tipo_licitacao" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getTiposLicitacao())),
            ],
            "status" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getStatus())),
            ],
            "data_abertura" => ["nullable", "date"],
            "data_homologacao" => [
                "nullable",
                "date",
                "after_or_equal:data_abertura",
            ],
            "data_adjudicacao" => [
                "nullable",
                "date",
                "after_or_equal:data_homologacao",
            ],
            "valor_estimado" => ["nullable", "numeric", "min:0"],
            "valor_adjudicado" => ["nullable", "numeric", "min:0"],
            "setor_requisitante" => ["nullable", "string", "max:255"],
            "usuario_responsavel_id" => ["nullable", "exists:users,id"],
            "observacoes" => ["nullable", "string"],
        ]);

        $processoLicitatorio->update($validated);

        return redirect()
            ->route("processos-licitatorios.show", $processoLicitatorio)
            ->with("success", "Processo licitatório atualizado com sucesso!");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProcessoLicitatorio $processoLicitatorio)
    {
        if (!$processoLicitatorio->podeExcluir()) {
            return redirect()
                ->route("processos-licitatorios.index")
                ->with("error", "Este processo não pode ser excluído.");
        }

        $processoLicitatorio->delete();

        return redirect()
            ->route("processos-licitatorios.index")
            ->with("success", "Processo licitatório excluído com sucesso!");
    }

    /**
     * Get statistics for dashboard.
     */
    public function statistics(Request $request)
    {
        $startDate = $request->get(
            "start_date",
            now()->subYear()->format("Y-m-d"),
        );
        $endDate = $request->get("end_date", now()->format("Y-m-d"));

        $processos = ProcessoLicitatorio::query()
            ->dateRange($startDate, $endDate)
            ->get();

        $stats = [
            "total" => $processos->count(),
            "por_status" => $processos->groupBy("status")->map->count(),
            "por_modalidade" => $processos->groupBy("modalidade")->map->count(),
            "valor_total_estimado" => $processos->sum("valor_estimado"),
            "valor_total_adjudicado" => $processos->sum("valor_adjudicado"),
            "economia_total" => $processos->sum(function ($p) {
                return $p->economia_valor ?? 0;
            }),
            "economia_media_percentual" => $processos
                ->filter(fn($p) => $p->economia_percentual !== null)
                ->avg("economia_percentual"),
            "duracao_media_dias" => $processos
                ->filter(fn($p) => $p->duracao_em_dias !== null)
                ->avg("duracao_em_dias"),
        ];

        return response()->json($stats);
    }

    /**
     * Change processo status.
     */
    public function changeStatus(
        Request $request,
        ProcessoLicitatorio $processoLicitatorio,
    ) {
        $validated = $request->validate([
            "status" => [
                "required",
                Rule::in(array_keys(ProcessoLicitatorio::getStatus())),
            ],
            "observacao" => ["nullable", "string"],
        ]);

        $processoLicitatorio->update([
            "status" => $validated["status"],
        ]);

        if (isset($validated["observacao"])) {
            $observacoes = $processoLicitatorio->observacoes ?? "";
            $novaObservacao =
                now()->format("d/m/Y H:i") .
                ' - Mudança de status para "' .
                $processoLicitatorio->status_display .
                '": ' .
                $validated["observacao"];

            $processoLicitatorio->update([
                "observacoes" => $observacoes . "\n\n" . $novaObservacao,
            ]);
        }

        return redirect()
            ->route("processos-licitatorios.show", $processoLicitatorio)
            ->with("success", "Status atualizado com sucesso!");
    }
}
