import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
export const pesquisarPncp = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pesquisarPncp.url(options),
    method: 'get',
})

pesquisarPncp.definition = {
    methods: ["get","head"],
    url: '/api/price-research/pncp',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
pesquisarPncp.url = (options?: RouteQueryOptions) => {
    return pesquisarPncp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
pesquisarPncp.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pesquisarPncp.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
pesquisarPncp.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pesquisarPncp.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
const pesquisarPncpForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pesquisarPncp.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
pesquisarPncpForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pesquisarPncp.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PesquisaPrecoController::pesquisarPncp
* @see app/Http/Controllers/PesquisaPrecoController.php:19
* @route '/api/price-research/pncp'
*/
pesquisarPncpForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pesquisarPncp.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pesquisarPncp.form = pesquisarPncpForm

const PesquisaPrecoController = { pesquisarPncp }

export default PesquisaPrecoController