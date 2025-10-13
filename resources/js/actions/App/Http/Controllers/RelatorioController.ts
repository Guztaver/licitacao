import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:28
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
* @see app/Http/Controllers/RelatorioController.php:28
* @route '/relatorios'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:28
* @route '/relatorios'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:28
* @route '/relatorios'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:28
* @route '/relatorios'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:28
* @route '/relatorios'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::index
* @see app/Http/Controllers/RelatorioController.php:28
* @route '/relatorios'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
export const getDashboardData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDashboardData.url(options),
    method: 'get',
})

getDashboardData.definition = {
    methods: ["get","head"],
    url: '/relatorios/api/dashboard-data',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
getDashboardData.url = (options?: RouteQueryOptions) => {
    return getDashboardData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
getDashboardData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDashboardData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
getDashboardData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDashboardData.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
const getDashboardDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDashboardData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
getDashboardDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDashboardData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDashboardData
* @see app/Http/Controllers/RelatorioController.php:36
* @route '/relatorios/api/dashboard-data'
*/
getDashboardDataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDashboardData.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getDashboardData.form = getDashboardDataForm

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
export const getDadosMateriais = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDadosMateriais.url(options),
    method: 'get',
})

getDadosMateriais.definition = {
    methods: ["get","head"],
    url: '/relatorios/api/materiais',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
getDadosMateriais.url = (options?: RouteQueryOptions) => {
    return getDadosMateriais.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
getDadosMateriais.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDadosMateriais.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
getDadosMateriais.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDadosMateriais.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
const getDadosMateriaisForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDadosMateriais.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
getDadosMateriaisForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDadosMateriais.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosMateriais
* @see app/Http/Controllers/RelatorioController.php:214
* @route '/relatorios/api/materiais'
*/
getDadosMateriaisForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDadosMateriais.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getDadosMateriais.form = getDadosMateriaisForm

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
export const getDadosContratos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDadosContratos.url(options),
    method: 'get',
})

getDadosContratos.definition = {
    methods: ["get","head"],
    url: '/relatorios/api/contratos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
getDadosContratos.url = (options?: RouteQueryOptions) => {
    return getDadosContratos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
getDadosContratos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDadosContratos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
getDadosContratos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDadosContratos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
const getDadosContratosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDadosContratos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
getDadosContratosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDadosContratos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::getDadosContratos
* @see app/Http/Controllers/RelatorioController.php:236
* @route '/relatorios/api/contratos'
*/
getDadosContratosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDadosContratos.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getDadosContratos.form = getDadosContratosForm

/**
* @see \App\Http\Controllers\RelatorioController::gerar
* @see app/Http/Controllers/RelatorioController.php:105
* @route '/relatorios/gerar'
*/
export const gerar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gerar.url(options),
    method: 'post',
})

gerar.definition = {
    methods: ["post"],
    url: '/relatorios/gerar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RelatorioController::gerar
* @see app/Http/Controllers/RelatorioController.php:105
* @route '/relatorios/gerar'
*/
gerar.url = (options?: RouteQueryOptions) => {
    return gerar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::gerar
* @see app/Http/Controllers/RelatorioController.php:105
* @route '/relatorios/gerar'
*/
gerar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gerar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RelatorioController::gerar
* @see app/Http/Controllers/RelatorioController.php:105
* @route '/relatorios/gerar'
*/
const gerarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: gerar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RelatorioController::gerar
* @see app/Http/Controllers/RelatorioController.php:105
* @route '/relatorios/gerar'
*/
gerarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: gerar.url(options),
    method: 'post',
})

gerar.form = gerarForm

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
export const listar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listar.url(options),
    method: 'get',
})

listar.definition = {
    methods: ["get","head"],
    url: '/relatorios/api/listar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
listar.url = (options?: RouteQueryOptions) => {
    return listar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
listar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
listar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
const listarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
listarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listar.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::listar
* @see app/Http/Controllers/RelatorioController.php:149
* @route '/relatorios/api/listar'
*/
listarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listar.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listar.form = listarForm

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
export const download = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/relatorios/download/{relatorio}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
download.url = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { relatorio: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { relatorio: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            relatorio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        relatorio: typeof args.relatorio === 'object'
        ? args.relatorio.id
        : args.relatorio,
    }

    return download.definition.url
            .replace('{relatorio}', parsedArgs.relatorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
download.get = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
download.head = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
const downloadForm = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
downloadForm.get = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RelatorioController::download
* @see app/Http/Controllers/RelatorioController.php:161
* @route '/relatorios/download/{relatorio}'
*/
downloadForm.head = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

/**
* @see \App\Http\Controllers\RelatorioController::excluir
* @see app/Http/Controllers/RelatorioController.php:182
* @route '/relatorios/{relatorio}'
*/
export const excluir = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: excluir.url(args, options),
    method: 'delete',
})

excluir.definition = {
    methods: ["delete"],
    url: '/relatorios/{relatorio}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RelatorioController::excluir
* @see app/Http/Controllers/RelatorioController.php:182
* @route '/relatorios/{relatorio}'
*/
excluir.url = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { relatorio: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { relatorio: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            relatorio: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        relatorio: typeof args.relatorio === 'object'
        ? args.relatorio.id
        : args.relatorio,
    }

    return excluir.definition.url
            .replace('{relatorio}', parsedArgs.relatorio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RelatorioController::excluir
* @see app/Http/Controllers/RelatorioController.php:182
* @route '/relatorios/{relatorio}'
*/
excluir.delete = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: excluir.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RelatorioController::excluir
* @see app/Http/Controllers/RelatorioController.php:182
* @route '/relatorios/{relatorio}'
*/
const excluirForm = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: excluir.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RelatorioController::excluir
* @see app/Http/Controllers/RelatorioController.php:182
* @route '/relatorios/{relatorio}'
*/
excluirForm.delete = (args: { relatorio: string | number | { id: string | number } } | [relatorio: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: excluir.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

excluir.form = excluirForm

const RelatorioController = { index, getDashboardData, getDadosMateriais, getDadosContratos, gerar, listar, download, excluir }

export default RelatorioController