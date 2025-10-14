<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FornecedorController;
use App\Http\Controllers\ProcessoLicitatorioController;
use App\Http\Controllers\ContratoController;
use App\Http\Controllers\CategoriaMaterialController;
use App\Http\Controllers\DispensaLicitacaoController;
use App\Http\Controllers\LimiteDispensaAlertaController;
use App\Http\Controllers\RelatorioController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\EmitenteController;
use App\Http\Controllers\DestinatarioController;
use App\Http\Controllers\PedidoCompraController;
use App\Http\Controllers\RequisicaoController;
use App\Http\Controllers\ConferenciaController;
use App\Http\Controllers\PesquisaPrecoController;
use App\Http\Controllers\PurchaseRequestController;
use App\Http\Controllers\AveragePriceReportController;
use App\Http\Controllers\BiddingProcessController;

// Rota principal
Route::get("/", function () {
    return redirect()->route("dashboard");
});

// Dashboard
Route::middleware(["auth", "verified"])->group(function () {
    Route::get("/dashboard", [DashboardController::class, "index"])->name(
        "dashboard",
    );
    Route::get("/api/dashboard/stats", [
        DashboardController::class,
        "getStats",
    ])->name("dashboard.stats");

    // Relatórios
    Route::prefix("relatorios")
        ->name("relatorios.")
        ->group(function () {
            Route::get("/", [RelatorioController::class, "index"])->name(
                "index",
            );
            Route::get("/average-price-research", function () {
                return view("relatorios.average-price-research");
            })->name("average-price-research");
            Route::get("/api/dashboard-data", [
                RelatorioController::class,
                "getDashboardData",
            ])->name("dashboard.data");
            Route::get("/api/materiais", [
                RelatorioController::class,
                "getDadosMateriais",
            ])->name("dados.materiais");
            Route::get("/api/contratos", [
                RelatorioController::class,
                "getDadosContratos",
            ])->name("dados.contratos");
            Route::post("/gerar", [RelatorioController::class, "gerar"])->name(
                "gerar",
            );
            Route::get("/api/listar", [
                RelatorioController::class,
                "listar",
            ])->name("listar");
            Route::get("/download/{relatorio}", [
                RelatorioController::class,
                "download",
            ])->name("download");
            Route::delete("/{relatorio}", [
                RelatorioController::class,
                "excluir",
            ])->name("excluir");
        });

    // Rotas do perfil
    Route::get("/profile", [ProfileController::class, "edit"])->name(
        "profile.edit",
    );
    Route::patch("/profile", [ProfileController::class, "update"])->name(
        "profile.update",
    );
    Route::delete("/profile", [ProfileController::class, "destroy"])->name(
        "profile.destroy",
    );
});

// Fornecedores
Route::resource("fornecedores", FornecedorController::class)->middleware([
    "auth",
    "verified",
]);

// Processos Licitatórios
Route::resource("processos-licitatorios", ProcessoLicitatorioController::class)
    ->middleware(["auth", "verified"])
    ->parameters([
        "processos-licitatorios" => "processoLicitatorio",
    ]);

// Contratos
Route::resource("contratos", ContratoController::class)->middleware([
    "auth",
    "verified",
]);

// Categorias de Materiais
Route::resource("categorias", CategoriaMaterialController::class)->middleware([
    "auth",
    "verified",
]);

// Dispensas de Licitação
Route::prefix("dispensas")
    ->name("dispensas.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [DispensaLicitacaoController::class, "index"])->name(
            "index",
        );
        Route::post("/", [DispensaLicitacaoController::class, "store"])->name(
            "store",
        );
        Route::get("/create", [
            DispensaLicitacaoController::class,
            "create",
        ])->name("create");
        Route::get("/{dispensa}", [
            DispensaLicitacaoController::class,
            "show",
        ])->name("show");
        Route::put("/{dispensa}", [
            DispensaLicitacaoController::class,
            "update",
        ])->name("update");
        Route::delete("/{dispensa}", [
            DispensaLicitacaoController::class,
            "destroy",
        ])->name("destroy");
        Route::post("/{dispensa}/cancelar", [
            DispensaLicitacaoController::class,
            "cancelar",
        ])->name("cancelar");
        Route::post("/validar", [
            DispensaLicitacaoController::class,
            "validar",
        ])->name("validar");
    });

// Itens/Materiais
Route::resource("items", ItemController::class)->middleware([
    "auth",
    "verified",
]);

// Emitentes
Route::resource("emitentes", EmitenteController::class)->middleware([
    "auth",
    "verified",
]);

// Destinatarios
Route::resource("destinatarios", DestinatarioController::class)->middleware([
    "auth",
    "verified",
]);

// Pedidos de Compras
Route::prefix("pedidos-compras")
    ->name("pedidos-compras.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [PedidoCompraController::class, "index"])->name(
            "index",
        );
        Route::post("/", [PedidoCompraController::class, "store"])->name(
            "store",
        );
        Route::get("/create", [PedidoCompraController::class, "create"])->name(
            "create",
        );
        Route::get("/{pedido}", [PedidoCompraController::class, "show"])->name(
            "show",
        );
        Route::get("/{pedido}/edit", [
            PedidoCompraController::class,
            "edit",
        ])->name("edit");
        Route::put("/{pedido}", [
            PedidoCompraController::class,
            "update",
        ])->name("update");
        Route::delete("/{pedido}", [
            PedidoCompraController::class,
            "destroy",
        ])->name("destroy");
        Route::patch("/{pedido}/aprovar", [
            PedidoCompraController::class,
            "aprovar",
        ])->name("aprovar");
        Route::patch("/{pedido}/rejeitar", [
            PedidoCompraController::class,
            "rejeitar",
        ])->name("rejeitar");
    });

// Requisições
Route::prefix("requisicoes")
    ->name("requisicoes.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [RequisicaoController::class, "index"])->name("index");
        Route::post("/", [RequisicaoController::class, "store"])->name("store");
        Route::get("/create", [RequisicaoController::class, "create"])->name(
            "create",
        );
        Route::get("/{requisicao}", [
            RequisicaoController::class,
            "show",
        ])->name("show");
        Route::get("/{requisicao}/edit", [
            RequisicaoController::class,
            "edit",
        ])->name("edit");
        Route::put("/{requisicao}", [
            RequisicaoController::class,
            "update",
        ])->name("update");
        Route::delete("/{requisicao}", [
            RequisicaoController::class,
            "destroy",
        ])->name("destroy");
        Route::patch("/{requisicao}/aprovar", [
            RequisicaoController::class,
            "aprovar",
        ])->name("aprovar");
        Route::patch("/{requisicao}/rejeitar", [
            RequisicaoController::class,
            "rejeitar",
        ])->name("rejeitar");
        Route::patch("/{requisicao}/finalizar", [
            RequisicaoController::class,
            "finalizar",
        ])->name("finalizar");
    });

// Purchase Requests (Pedidos de Compra Simplificados)
Route::prefix("purchase-requests")
    ->name("purchase-requests.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", function () {
            return view("purchase-requests.index");
        })->name("index");
        Route::post("/", [PurchaseRequestController::class, "store"])->name(
            "store",
        );
        Route::get("/create", function () {
            return view("purchase-requests.create");
        })->name("create");
        Route::get("/{purchaseRequest}", function ($purchaseRequest) {
            return view("purchase-requests.show", [
                "purchaseRequest" => $purchaseRequest,
            ]);
        })->name("show");
        Route::get("/{purchaseRequest}/edit", function ($purchaseRequest) {
            return view("purchase-requests.edit", [
                "purchaseRequest" => $purchaseRequest,
            ]);
        })->name("edit");
        Route::put("/{purchaseRequest}", [
            PurchaseRequestController::class,
            "update",
        ])->name("update");
        Route::delete("/{purchaseRequest}", [
            PurchaseRequestController::class,
            "destroy",
        ])->name("destroy");

        // Status change endpoint
        Route::put("/{purchaseRequest}/status", [
            PurchaseRequestController::class,
            "updateStatus",
        ])->name("updateStatus");
        Route::get("/{purchaseRequest}/available-actions", [
            PurchaseRequestController::class,
            "getAvailableActions",
        ])->name("availableActions");

        // Forward to contracts endpoint
        Route::post("/{purchaseRequest}/forward-to-contracts", [
            PurchaseRequestController::class,
            "forwardToContracts",
        ])->name("forward-to-contracts");
    });

// Bidding Processes (Processos Licitatórios)
Route::prefix("bidding-processes")
    ->name("bidding-processes.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", function () {
            return view("bidding-processes.index");
        })->name("index");
        Route::get("/consolidate", function () {
            return view("bidding-processes.consolidate");
        })->name("consolidate");
        Route::get("/{biddingProcess}", function ($biddingProcess) {
            return view("bidding-processes.show", [
                "biddingProcess" => $biddingProcess,
            ]);
        })->name("show");
        Route::put("/{biddingProcess}/status", [
            BiddingProcessController::class,
            "updateStatus",
        ])->name("updateStatus");
        Route::delete("/{biddingProcess}", [
            BiddingProcessController::class,
            "destroy",
        ])->name("destroy");
    });

// API endpoints for Purchase Requests
Route::middleware(["auth", "verified"])
    ->prefix("api/purchase-requests")
    ->group(function () {
        Route::get("/", [PurchaseRequestController::class, "index"])->name(
            "api.index",
        );
        Route::post("/", [PurchaseRequestController::class, "store"])->name(
            "api.store",
        );
        Route::get("/{purchaseRequest}", [
            PurchaseRequestController::class,
            "show",
        ])->name("api.show");
        Route::put("/{purchaseRequest}/status", [
            PurchaseRequestController::class,
            "updateStatus",
        ])->name("api.updateStatus");
        Route::get("/{purchaseRequest}/available-actions", [
            PurchaseRequestController::class,
            "getAvailableActions",
        ])->name("api.availableActions");
        Route::post("/{purchaseRequest}/forward-to-contracts", [
            PurchaseRequestController::class,
            "forwardToContracts",
        ])->name("api.forward-to-contracts");
    });

// Conferências
Route::prefix("conferencias")
    ->name("conferencias.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [ConferenciaController::class, "index"])->name("index");
        Route::post("/", [ConferenciaController::class, "store"])->name(
            "store",
        );
        Route::get("/create", [ConferenciaController::class, "create"])->name(
            "create",
        );
        Route::get("/{conferencia}", [
            ConferenciaController::class,
            "show",
        ])->name("show");
        Route::get("/{conferencia}/edit", [
            ConferenciaController::class,
            "edit",
        ])->name("edit");
        Route::put("/{conferencia}", [
            ConferenciaController::class,
            "update",
        ])->name("update");
        Route::delete("/{conferencia}", [
            ConferenciaController::class,
            "destroy",
        ])->name("destroy");
        Route::patch("/{conferencia}/finalizar", [
            ConferenciaController::class,
            "finalizar",
        ])->name("finalizar");
    });

// Alertas de Limites
Route::prefix("alertas")
    ->name("alertas.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [LimiteDispensaAlertaController::class, "index"])->name(
            "index",
        );
        Route::get("/{alerta}", [
            LimiteDispensaAlertaController::class,
            "show",
        ])->name("show");
        Route::patch("/{alerta}/marcar-lida", [
            LimiteDispensaAlertaController::class,
            "marcarComoLida",
        ])->name("marcar-lida");
        Route::patch("/{alerta}/marcar-nao-lida", [
            LimiteDispensaAlertaController::class,
            "marcarComoNaoLida",
        ])->name("marcar-nao-lida");
        Route::patch("/marcar-todas-lidas", [
            LimiteDispensaAlertaController::class,
            "marcarTodasComoLidas",
        ])->name("marcar-todas-lidas");
        Route::get("/nao-lidas-count", [
            LimiteDispensaAlertaController::class,
            "contarNaoLidas",
        ])->name("nao-lidas-count");
    });

// API routes para AJAX
Route::middleware(["auth", "verified"])
    ->prefix("api")
    ->group(function () {
        Route::get("/fornecedores", [
            FornecedorController::class,
            "apiIndex",
        ])->name("api.fornecedores");

        // Bidding Processes API
        Route::get("/bidding-processes", [
            BiddingProcessController::class,
            "index",
        ])->name("api.bidding-processes");
        Route::post("/bidding-processes", [
            BiddingProcessController::class,
            "store",
        ])->name("api.bidding-processes.store");
        Route::post("/bidding-processes/consolidate", [
            BiddingProcessController::class,
            "consolidate",
        ])->name("api.bidding-processes.consolidate");
        Route::get("/bidding-processes/available-requests", [
            BiddingProcessController::class,
            "getAvailableRequests",
        ])->name("api.bidding-processes.available-requests");
        Route::get("/bidding-processes/{biddingProcess}", [
            BiddingProcessController::class,
            "show",
        ])->name("api.bidding-processes.show");
        Route::put("/bidding-processes/{biddingProcess}/status", [
            BiddingProcessController::class,
            "updateStatus",
        ])->name("api.bidding-processes.updateStatus");
        Route::delete("/bidding-processes/{biddingProcess}", [
            BiddingProcessController::class,
            "destroy",
        ])->name("api.bidding-processes.destroy");
        Route::get("/processos-licitatorios", [
            ProcessoLicitatorioController::class,
            "apiIndex",
        ])->name("api.processos-licitatorios");
        Route::get("/categoria-materiais", [
            CategoriaMaterialController::class,
            "index",
        ])->name("api.categoria-materiais");
        Route::get("/categoria-materiais/{id}/com-uso", [
            CategoriaMaterialController::class,
            "showWithUsage",
        ])->name("api.categoria-materiais.com-uso");
        Route::get("/dispensa-licitacoes", [
            DispensaLicitacaoController::class,
            "index",
        ])->name("api.dispensa-licitacoes");
        Route::get("/limite-alertas", [
            LimiteDispensaAlertaController::class,
            "index",
        ])->name("api.limite-alertas");
        Route::get("/limites-dashboard", [
            CategoriaMaterialController::class,
            "getDashboardData",
        ])->name("api.limites-dashboard");
        Route::get("/limite-alertas/check-new", [
            LimiteDispensaAlertaController::class,
            "checkNewAlerts",
        ])->name("api.limite-alertas.check-new");

        // PNCP Price Research
        Route::get("/price-research/pncp", [
            PesquisaPrecoController::class,
            "pesquisarPncp",
        ])->name("api.price-research.pncp");

        // Average Price Research Report
        Route::get("/reports/average-price-research", [
            AveragePriceReportController::class,
            "index",
        ])->name("api.reports.average-price-research");

        Route::get("/reports/average-price-research/filter-options", [
            AveragePriceReportController::class,
            "filterOptions",
        ])->name("api.reports.average-price-research.filter-options");
    });

// Autenticação
Route::middleware("guest")->group(function () {
    Route::get("register", [RegisteredUserController::class, "create"])->name(
        "register",
    );
    Route::post("register", [RegisteredUserController::class, "store"]);

    Route::get("login", [
        AuthenticatedSessionController::class,
        "create",
    ])->name("login");
    Route::post("login", [AuthenticatedSessionController::class, "store"]);

    Route::get("forgot-password", [
        PasswordResetLinkController::class,
        "create",
    ])->name("password.request");
    Route::post("forgot-password", [
        PasswordResetLinkController::class,
        "store",
    ])->name("password.email");

    Route::get("reset-password/{token}", [
        NewPasswordController::class,
        "create",
    ])->name("password.reset");
    Route::post("reset-password", [
        NewPasswordController::class,
        "store",
    ])->name("password.store");
});

Route::middleware("auth")->group(function () {
    Route::get("verify-email", [
        EmailVerificationNotificationController::class,
        "notification",
    ])->name("verification.notice");
    Route::post("email/verification-notification", [
        EmailVerificationNotificationController::class,
        "store",
    ])
        ->middleware("throttle:6,1")
        ->name("verification.send");

    Route::get("confirm-password", [
        AuthenticatedSessionController::class,
        "confirmPassword",
    ])->name("password.confirm");
    Route::post("confirm-password", [
        AuthenticatedSessionController::class,
        "storeConfirmedPassword",
    ]);

    Route::post("logout", [
        AuthenticatedSessionController::class,
        "destroy",
    ])->name("logout");
    Route::get("verify-email/{id}/{hash}", [
        VerifyEmailController::class,
        "__invoke",
    ])
        ->middleware("signed")
        ->name("verification.verify");
});

// Temporary test route for PNCP integration (remove in production)
Route::get("/test/pncp/{term}", function ($term) {
    $controller = new PesquisaPrecoController();
    $request = new \Illuminate\Http\Request();
    $request->merge(["term" => $term]);

    return $controller->pesquisarPncp($request);
});

// Temporary test route for Purchase Request status change (remove in production)
Route::get("/test/purchase-request-status/{id}", function ($id) {
    $purchaseRequest = \App\Models\PurchaseRequest::find($id);
    $user = \App\Models\User::first();

    if (!$purchaseRequest) {
        return response()->json(["error" => "Purchase request not found"], 404);
    }

    // Simulate different user types
    $currentType = request()->get("role", "purchasing_manager");

    $availableActions = $purchaseRequest->getAvailableActions($currentType);

    return response()->json([
        "purchase_request" => $purchaseRequest->load(["user", "secretaria"]),
        "current_user_role" => $currentType,
        "available_actions" => $availableActions,
        "valid_transitions" =>
            \App\Models\PurchaseRequest::getValidTransitions()[
                $purchaseRequest->status
            ] ?? [],
        "status_history" => $purchaseRequest->status_history,
        "status_display" => $purchaseRequest->getStatusDisplayText(),
    ]);
});

// Test status change (using GET for testing to avoid CSRF)
Route::get("/test/purchase-request-status/{id}/change", function ($id) {
    $purchaseRequest = \App\Models\PurchaseRequest::find($id);
    $user = \App\Models\User::first();

    if (!$purchaseRequest) {
        return response()->json(["error" => "Purchase request not found"], 404);
    }

    $newStatus = request()->get("newStatus", "price_research");
    $comment = request()->get("comment", "Test status change");
    $currentType = request()->get("role", "purchasing_manager");

    // Validate transition
    if (!$purchaseRequest->isValidTransition($newStatus)) {
        return response()->json(
            [
                "success" => false,
                "message" =>
                    "Invalid transition from " .
                    $purchaseRequest->status .
                    " to " .
                    $newStatus,
                "old_status" => $purchaseRequest->status,
                "new_status" => $newStatus,
                "valid_transitions" =>
                    \App\Models\PurchaseRequest::getValidTransitions()[
                        $purchaseRequest->status
                    ] ?? [],
            ],
            400,
        );
    }

    // Check permissions
    if (
        !\App\Models\PurchaseRequest::canUserPerformTransition(
            $purchaseRequest->status,
            $newStatus,
            $currentType,
        )
    ) {
        return response()->json(
            [
                "success" => false,
                "message" =>
                    "User with role " .
                    $currentType .
                    " cannot perform this transition",
                "role_permissions" => \App\Models\PurchaseRequest::getRolePermissions(),
                "current_status" => $purchaseRequest->status,
                "requested_status" => $newStatus,
            ],
            403,
        );
    }

    // Perform the transition
    $purchaseRequest->addStatusHistory($newStatus, $user->id, $comment);
    $purchaseRequest->status = $newStatus;
    $purchaseRequest->save();

    return response()->json([
        "success" => true,
        "message" => "Status changed successfully",
        "old_status" => $purchaseRequest->getOriginal("status"),
        "new_status" => $purchaseRequest->status,
        "new_status_display" => $purchaseRequest->getStatusDisplayText(),
        "user_role" => $currentType,
        "status_history" => $purchaseRequest->status_history,
        "available_actions" => $purchaseRequest->getAvailableActions(
            $currentType,
        ),
    ]);
});

require __DIR__ . "/auth.php";
