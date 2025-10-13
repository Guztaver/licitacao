<?php

namespace App\Observers;

use App\Models\Contrato;
use App\Models\ContratoItem;
use App\Models\PedidoCompra;
use App\Models\PedidoCompraItem;
use App\Models\Requisicao;
use App\Models\RequisicaoItem;

class ItemUsageObserver
{
    /**
     * Handle the contrato item "created" event.
     */
    public function contratoItemCreated(ContratoItem $contratoItem): void
    {
        if ($contratoItem->item && $contratoItem->contrato) {
            $contratoItem->item->registrarUso('contrato', $contratoItem->contrato_id);
        }
    }

    /**
     * Handle the pedido compra item "created" event.
     */
    public function pedidoCompraItemCreated(PedidoCompraItem $pedidoCompraItem): void
    {
        if ($pedidoCompraItem->item && $pedidoCompraItem->pedidoCompra) {
            $pedidoCompraItem->item->registrarUso('pedido_compra', $pedidoCompraItem->pedido_compra_id);
        }
    }

    /**
     * Handle the requisicao item "created" event.
     */
    public function requisicaoItemCreated(RequisicaoItem $requisicaoItem): void
    {
        if ($requisicaoItem->item && $requisicaoItem->requisicao) {
            $requisicaoItem->item->registrarUso('requisicao', $requisicaoItem->requisicao_id);
        }
    }

    /**
     * Handle the contrato status change to active.
     */
    public function contratoStatusChanged(Contrato $contrato): void
    {
        if (in_array($contrato->status, ['ativo', 'em_execucao', 'concluido'])) {
            foreach ($contrato->items as $contratoItem) {
                if ($contratoItem->item) {
                    $contratoItem->item->registrarUso('contrato', $contrato->id);
                }
            }
        }
    }

    /**
     * Handle the pedido compra status change to approved.
     */
    public function pedidoCompraStatusChanged(PedidoCompra $pedidoCompra): void
    {
        if (in_array($pedidoCompra->status, ['aprovado', 'em_execucao', 'concluido'])) {
            foreach ($pedidoCompra->items as $pedidoCompraItem) {
                if ($pedidoCompraItem->item) {
                    $pedidoCompraItem->item->registrarUso('pedido_compra', $pedidoCompra->id);
                }
            }
        }
    }

    /**
     * Handle the requisicao status change to authorized.
     */
    public function requisicaoStatusChanged(Requisicao $requisicao): void
    {
        if (in_array($requisicao->status, ['autorizada', 'concretizada'])) {
            foreach ($requisicao->items as $requisicaoItem) {
                if ($requisicaoItem->item) {
                    $requisicaoItem->item->registrarUso('requisicao', $requisicao->id);
                }
            }
        }
    }

    /**
     * Register the observers.
     */
    public static function register(): void
    {
        ContratoItem::created(function ($contratoItem) {
            (new self())->contratoItemCreated($contratoItem);
        });

        PedidoCompraItem::created(function ($pedidoCompraItem) {
            (new self())->pedidoCompraItemCreated($pedidoCompraItem);
        });

        RequisicaoItem::created(function ($requisicaoItem) {
            (new self())->requisicaoItemCreated($requisicaoItem);
        });

        // Status change observers
        Contrato::updated(function ($contrato) {
            if ($contrato->wasChanged('status')) {
                (new self())->contratoStatusChanged($contrato);
            }
        });

        PedidoCompra::updated(function ($pedidoCompra) {
            if ($pedidoCompra->wasChanged('status')) {
                (new self())->pedidoCompraStatusChanged($pedidoCompra);
            }
        });

        Requisicao::updated(function ($requisicao) {
            if ($requisicao->wasChanged('status')) {
                (new self())->requisicaoStatusChanged($requisicao);
            }
        });
    }
}
