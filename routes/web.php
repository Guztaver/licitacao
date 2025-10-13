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
        Route::get("/", [PedidoCompraController::class, "index"])->name("index");
        Route::post("/", [PedidoCompraController::class, "store"])->name("store");
        Route::get("/create", [PedidoCompraController::class, "create"])->name("create");
        Route::get("/{pedido}", [PedidoCompraController::class, "show"])->name("show");
        Route::get("/{pedido}/edit", [PedidoCompraController::class, "edit"])->name("edit");
        Route::put("/{pedido}", [PedidoCompraController::class, "update"])->name("update");
        Route::delete("/{pedido}", [PedidoCompraController::class, "destroy"])->name("destroy");
        Route::patch("/{pedido}/aprovar", [PedidoCompraController::class, "aprovar"])->name("aprovar");
        Route::patch("/{pedido}/rejeitar", [PedidoCompraController::class, "rejeitar"])->name("rejeitar");
    });

// Requisições
Route::prefix("requisicoes")
    ->name("requisicoes.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [RequisicaoController::class, "index"])->name("index");
        Route::post("/", [RequisicaoController::class, "store"])->name("store");
        Route::get("/create", [RequisicaoController::class, "create"])->name("create");
        Route::get("/{requisicao}", [RequisicaoController::class, "show"])->name("show");
        Route::get("/{requisicao}/edit", [RequisicaoController::class, "edit"])->name("edit");
        Route::put("/{requisicao}", [RequisicaoController::class, "update"])->name("update");
        Route::delete("/{requisicao}", [RequisicaoController::class, "destroy"])->name("destroy");
        Route::patch("/{requisicao}/aprovar", [RequisicaoController::class, "aprovar"])->name("aprovar");
        Route::patch("/{requisicao}/rejeitar", [RequisicaoController::class, "rejeitar"])->name("rejeitar");
        Route::patch("/{requisicao}/finalizar", [RequisicaoController::class, "finalizar"])->name("finalizar");
    });

// Conferências
Route::prefix("conferencias")
    ->name("conferencias.")
    ->middleware(["auth", "verified"])
    ->group(function () {
        Route::get("/", [ConferenciaController::class, "index"])->name("index");
        Route::post("/", [ConferenciaController::class, "store"])->name("store");
        Route::get("/create", [ConferenciaController::class, "create"])->name("create");
        Route::get("/{conferencia}", [ConferenciaController::class, "show"])->name("show");
        Route::get("/{conferencia}/edit", [ConferenciaController::class, "edit"])->name("edit");
        Route::put("/{conferencia}", [ConferenciaController::class, "update"])->name("update");
        Route::delete("/{conferencia}", [ConferenciaController::class, "destroy"])->name("destroy");
        Route::patch("/{conferencia}/finalizar", [ConferenciaController::class, "finalizar"])->name("finalizar");
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
Route::get('/test/pncp/{term}', function ($term) {
    $controller = new PesquisaPrecoController();
    $request = new \Illuminate\Http\Request();
    $request->merge(['term' => $term]);

    return $controller->pesquisarPncp($request);
});

require __DIR__ . "/auth.php";
