<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PesquisaPrecoController;

// Temporary test route for PNCP integration (remove in production)
Route::get('/test/pncp/{term}', function ($term) {
    $controller = new PesquisaPrecoController();
    $request = new \Illuminate\Http\Request();
    $request->merge(['term' => $term]);

    return $controller->pesquisarPncp($request);
});