import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::index
* @see app/Http/Controllers/DashboardController.php:17
* @route '/dashboard'
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
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
export const getStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

getStats.definition = {
    methods: ["get","head"],
    url: '/api/dashboard/stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
getStats.url = (options?: RouteQueryOptions) => {
    return getStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
getStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
getStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
const getStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
getStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DashboardController::getStats
* @see app/Http/Controllers/DashboardController.php:0
* @route '/api/dashboard/stats'
*/
getStatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getStats.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getStats.form = getStatsForm

const DashboardController = { index, getStats }

export default DashboardController