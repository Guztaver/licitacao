<?php

use App\Http\Controllers\ConferenciaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DestinatarioController;
use App\Http\Controllers\EmitenteController;
use App\Http\Controllers\FornecedorController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\RequisicaoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Fornecedores routes
    Route::resource('fornecedores', FornecedorController::class)->parameters(['fornecedores' => 'fornecedor']);
    Route::get('fornecedores-export', [FornecedorController::class, 'export'])->name('fornecedores.export');
    Route::get('fornecedores-search', [FornecedorController::class, 'search'])->name('fornecedores.search');

    // Requisições routes
    Route::resource('requisicoes', RequisicaoController::class)->parameters(['requisicoes' => 'requisicao']);
    Route::get('requisicoes-excluidas', [RequisicaoController::class, 'excluidas'])->name('requisicoes.excluidas');
    Route::get('requisicoes-export', [RequisicaoController::class, 'export'])->name('requisicoes.export');
    Route::get('requisicoes/{requisicao}/pdf', [RequisicaoController::class, 'pdf'])->name('requisicoes.pdf');
    Route::get('requisicoes/{requisicao}/anexo', [RequisicaoController::class, 'anexo'])->name('requisicoes.anexo');
    Route::post('requisicoes/{requisicao}/concretizar', [RequisicaoController::class, 'concretizar'])->name('requisicoes.concretizar');

    // Conferências routes
    Route::resource('conferencias', ConferenciaController::class);
    Route::get('conferencias-export', [ConferenciaController::class, 'export'])->name('conferencias.export');
    Route::get('conferencias/fornecedor/{fornecedor}/{periodo}', [ConferenciaController::class, 'fornecedor'])->name('conferencias.fornecedor');

    // Emitentes routes
    Route::resource('emitentes', EmitenteController::class);

    // Destinatários routes
    Route::resource('destinatarios', DestinatarioController::class);
    Route::get('destinatarios-export', [DestinatarioController::class, 'export'])->name('destinatarios.export');

    // Relatórios routes
    Route::get('relatorios', [RelatorioController::class, 'index'])->name('relatorios.index');
    Route::get('relatorios/requisicoes', [RelatorioController::class, 'requisicoes'])->name('relatorios.requisicoes');
    Route::get('relatorios/fornecedores', [RelatorioController::class, 'fornecedores'])->name('relatorios.fornecedores');
    Route::get('relatorios/conferencias', [RelatorioController::class, 'conferencias'])->name('relatorios.conferencias');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
