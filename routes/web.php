<?php

use App\Http\Controllers\ConferenciaController;
use App\Http\Controllers\ContratoController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DestinatarioController;
use App\Http\Controllers\EmitenteController;
use App\Http\Controllers\FornecedorController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\RequisicaoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get("/", function () {
    return Inertia::render("welcome");
})->name("home");

Route::middleware(["auth", "verified"])->group(function () {
    // Dashboard - Available to all authenticated users
    Route::get("dashboard", [DashboardController::class, "index"])->name(
        "dashboard",
    );

    // Routes for Operacional users (full access)
    Route::middleware(["user.type:operacional"])->group(function () {
        // Fornecedores routes
        Route::resource(
            "fornecedores",
            FornecedorController::class,
        )->parameters(["fornecedores" => "fornecedor"]);
        Route::get("fornecedores-export", [
            FornecedorController::class,
            "export",
        ])->name("fornecedores.export");
        Route::get("fornecedores-search", [
            FornecedorController::class,
            "search",
        ])->name("fornecedores.search");

        // Requisições routes
        Route::resource("requisicoes", RequisicaoController::class)->parameters(
            ["requisicoes" => "requisicao"],
        );
        Route::get("requisicoes-excluidas", [
            RequisicaoController::class,
            "excluidas",
        ])->name("requisicoes.excluidas");
        Route::get("requisicoes-export", [
            RequisicaoController::class,
            "export",
        ])->name("requisicoes.export");
        Route::get("requisicoes/{requisicao}/anexo", [
            RequisicaoController::class,
            "anexo",
        ])->name("requisicoes.anexo");
        Route::post("requisicoes/{requisicao}/concretizar", [
            RequisicaoController::class,
            "concretizar",
        ])->name("requisicoes.concretizar");
        Route::post("requisicoes/{requisicao}/cancelar", [
            RequisicaoController::class,
            "cancelar",
        ])->name("requisicoes.cancelar");

        // Conferências routes
        Route::resource("conferencias", ConferenciaController::class);
        Route::get("conferencias-export", [
            ConferenciaController::class,
            "export",
        ])->name("conferencias.export");
        Route::get("conferencias/fornecedor/{fornecedor}/{periodo}", [
            ConferenciaController::class,
            "fornecedor",
        ])->name("conferencias.fornecedor");
        Route::post("conferencias/pedidos-manuais", [
            ConferenciaController::class,
            "storePedidoManual",
        ])->name("conferencias.pedidos-manuais.store");
        Route::delete("conferencias/{conferencia}/pedidos-manuais/{pedido}", [
            ConferenciaController::class,
            "destroyPedidoManual",
        ])->name("conferencias.pedidos-manuais.destroy");
        Route::post(
            "conferencias/fornecedor/{fornecedor}/{periodo}/finalizar",
            [ConferenciaController::class, "finalizarConferencia"],
        )->name("conferencias.finalizar");

        // Contratos routes
        Route::resource("contratos", ContratoController::class);
        Route::post("contratos/{contrato}/toggle-status", [
            ContratoController::class,
            "toggleStatus",
        ])->name("contratos.toggle-status");
        Route::get("contratos/check-limits", [
            ContratoController::class,
            "checkLimits",
        ])->name("contratos.check-limits");

        // Emitentes routes
        Route::resource("emitentes", EmitenteController::class);
        Route::get("emitentes-export", [
            EmitenteController::class,
            "export",
        ])->name("emitentes.export");

        // Destinatários routes
        Route::resource("destinatarios", DestinatarioController::class);
        Route::get("destinatarios-export", [
            DestinatarioController::class,
            "export",
        ])->name("destinatarios.export");

        // Items routes
        Route::resource("items", ItemController::class);
        Route::post("items-import", [ItemController::class, "import"])->name(
            "items.import",
        );
        Route::get("items-export", [ItemController::class, "export"])->name(
            "items.export",
        );
        Route::get("items-template", [
            ItemController::class,
            "downloadTemplate",
        ])->name("items.template");

        // Relatórios routes - full reports with export
        Route::get("relatorios/requisicoes/export", [
            RelatorioController::class,
            "exportRequisicoes",
        ])->name("relatorios.requisicoes.export");
        Route::get("relatorios/fornecedores/export", [
            RelatorioController::class,
            "exportFornecedores",
        ])->name("relatorios.fornecedores.export");
        Route::get("relatorios/conferencias/export", [
            RelatorioController::class,
            "exportConferencias",
        ])->name("relatorios.conferencias.export");
    });

    // Routes available to both Gestor and Operacional users (read-only reports)
    Route::middleware(["user.type:gestor,operacional"])->group(function () {
        // PDF generation - available to both user types
        Route::get("requisicoes/{requisicao}/pdf", [
            RequisicaoController::class,
            "pdf",
        ])->name("requisicoes.pdf");

        // Relatórios routes - read-only access
        Route::get("relatorios", [RelatorioController::class, "index"])->name(
            "relatorios.index",
        );
        Route::get("relatorios/requisicoes", [
            RelatorioController::class,
            "requisicoes",
        ])->name("relatorios.requisicoes");
        Route::get("relatorios/fornecedores", [
            RelatorioController::class,
            "fornecedores",
        ])->name("relatorios.fornecedores");
        Route::get("relatorios/conferencias", [
            RelatorioController::class,
            "conferencias",
        ])->name("relatorios.conferencias");
    });
});

require __DIR__ . "/settings.php";
require __DIR__ . "/auth.php";
