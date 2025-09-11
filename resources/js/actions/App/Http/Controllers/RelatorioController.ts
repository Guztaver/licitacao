import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RelatorioController::exportRequisicoes
* @see app/Http/Controllers/RelatorioController.php:284
* @route '/relatorios/requisicoes/export'
*/
export const exportRequisicoes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRequisicoes.url(options),
    method: 'get',
})

exportRequisicoes.definition = {
    methods: ["get","head"],
    url: '/relatorios/requisicoes/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::exportRequisicoes
* @see app/Http/Controllers/RelatorioController.php:284
* @route '/relatorios/requisicoes/export'
*/
exportRequisicoes.url = (options?: RouteQueryOptions) => {
    return exportRequisicoes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::exportRequisicoes
* @see app/Http/Controllers/RelatorioController.php:284
* @route '/relatorios/requisicoes/export'
*/
exportRequisicoes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportRequisicoes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::exportRequisicoes
* @see app/Http/Controllers/RelatorioController.php:284
* @route '/relatorios/requisicoes/export'
*/
exportRequisicoes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportRequisicoes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::exportFornecedores
* @see app/Http/Controllers/RelatorioController.php:375
* @route '/relatorios/fornecedores/export'
*/
export const exportFornecedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFornecedores.url(options),
    method: 'get',
})

exportFornecedores.definition = {
    methods: ["get","head"],
    url: '/relatorios/fornecedores/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::exportFornecedores
* @see app/Http/Controllers/RelatorioController.php:375
* @route '/relatorios/fornecedores/export'
*/
exportFornecedores.url = (options?: RouteQueryOptions) => {
    return exportFornecedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::exportFornecedores
* @see app/Http/Controllers/RelatorioController.php:375
* @route '/relatorios/fornecedores/export'
*/
exportFornecedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportFornecedores.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::exportFornecedores
* @see app/Http/Controllers/RelatorioController.php:375
* @route '/relatorios/fornecedores/export'
*/
exportFornecedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportFornecedores.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::exportConferencias
* @see app/Http/Controllers/RelatorioController.php:474
* @route '/relatorios/conferencias/export'
*/
export const exportConferencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportConferencias.url(options),
    method: 'get',
})

exportConferencias.definition = {
    methods: ["get","head"],
    url: '/relatorios/conferencias/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::exportConferencias
* @see app/Http/Controllers/RelatorioController.php:474
* @route '/relatorios/conferencias/export'
*/
exportConferencias.url = (options?: RouteQueryOptions) => {
    return exportConferencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::exportConferencias
* @see app/Http/Controllers/RelatorioController.php:474
* @route '/relatorios/conferencias/export'
*/
exportConferencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportConferencias.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::exportConferencias
* @see app/Http/Controllers/RelatorioController.php:474
* @route '/relatorios/conferencias/export'
*/
exportConferencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportConferencias.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:17
* @route '/relatorios'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/relatorios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:17
* @route '/relatorios'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:17
* @route '/relatorios'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:17
* @route '/relatorios'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::requisicoes
* @see app/Http/Controllers/RelatorioController.php:51
* @route '/relatorios/requisicoes'
*/
export const requisicoes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requisicoes.url(options),
    method: 'get',
})

requisicoes.definition = {
    methods: ["get","head"],
    url: '/relatorios/requisicoes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::requisicoes
* @see app/Http/Controllers/RelatorioController.php:51
* @route '/relatorios/requisicoes'
*/
requisicoes.url = (options?: RouteQueryOptions) => {
    return requisicoes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::requisicoes
* @see app/Http/Controllers/RelatorioController.php:51
* @route '/relatorios/requisicoes'
*/
requisicoes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: requisicoes.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::requisicoes
* @see app/Http/Controllers/RelatorioController.php:51
* @route '/relatorios/requisicoes'
*/
requisicoes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: requisicoes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::fornecedores
* @see app/Http/Controllers/RelatorioController.php:142
* @route '/relatorios/fornecedores'
*/
export const fornecedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fornecedores.url(options),
    method: 'get',
})

fornecedores.definition = {
    methods: ["get","head"],
    url: '/relatorios/fornecedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::fornecedores
* @see app/Http/Controllers/RelatorioController.php:142
* @route '/relatorios/fornecedores'
*/
fornecedores.url = (options?: RouteQueryOptions) => {
    return fornecedores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::fornecedores
* @see app/Http/Controllers/RelatorioController.php:142
* @route '/relatorios/fornecedores'
*/
fornecedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fornecedores.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::fornecedores
* @see app/Http/Controllers/RelatorioController.php:142
* @route '/relatorios/fornecedores'
*/
fornecedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fornecedores.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::conferencias
* @see app/Http/Controllers/RelatorioController.php:212
* @route '/relatorios/conferencias'
*/
export const conferencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conferencias.url(options),
    method: 'get',
})

conferencias.definition = {
    methods: ["get","head"],
    url: '/relatorios/conferencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::conferencias
* @see app/Http/Controllers/RelatorioController.php:212
* @route '/relatorios/conferencias'
*/
conferencias.url = (options?: RouteQueryOptions) => {
    return conferencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::conferencias
* @see app/Http/Controllers/RelatorioController.php:212
* @route '/relatorios/conferencias'
*/
conferencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conferencias.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::conferencias
* @see app/Http/Controllers/RelatorioController.php:212
* @route '/relatorios/conferencias'
*/
conferencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conferencias.url(options),
    method: 'head',
})

const RelatorioController = { exportRequisicoes, exportFornecedores, exportConferencias, index, requisicoes, fornecedores, conferencias }

export default RelatorioController