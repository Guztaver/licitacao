<?php

namespace App\Observers;

use App\Models\Requisicao;
use App\Services\PatrimonioIntegrationService;

class RequisicaoObserver
{
    private PatrimonioIntegrationService $patrimonioService;

    public function __construct(PatrimonioIntegrationService $patrimonioService)
    {
        $this->patrimonioService = $patrimonioService;
    }

    /**
     * Handle the Requisicao "updated" event.
     */
    public function updated(Requisicao $requisicao): void
    {
        // Check if requisition was just received
        if ($requisicao->wasChanged('status') && $requisicao->status === 'recebida') {
            $this->patrimonioService->criarIntegracoesAutomaticas($requisicao);
        }
    }

    /**
     * Handle the Requisicao "created" event.
     */
    public function created(Requisicao $requisicao): void
    {
        // If requisition is already received when created, create integrations
        if ($requisicao->status === 'recebida' && $requisicao->data_recebimento) {
            $this->patrimonioService->criarIntegracoesAutomaticas($requisicao);
        }
    }
}