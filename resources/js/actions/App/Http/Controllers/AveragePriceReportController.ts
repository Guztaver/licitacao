import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/reports/average-price-research',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::index
* @see app/Http/Controllers/AveragePriceReportController.php:15
* @route '/api/reports/average-price-research'
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
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
export const filterOptions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filterOptions.url(options),
    method: 'get',
})

filterOptions.definition = {
    methods: ["get","head"],
    url: '/api/reports/average-price-research/filter-options',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
filterOptions.url = (options?: RouteQueryOptions) => {
    return filterOptions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
filterOptions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filterOptions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
filterOptions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filterOptions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
const filterOptionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: filterOptions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
filterOptionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: filterOptions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AveragePriceReportController::filterOptions
* @see app/Http/Controllers/AveragePriceReportController.php:138
* @route '/api/reports/average-price-research/filter-options'
*/
filterOptionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: filterOptions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

filterOptions.form = filterOptionsForm

const AveragePriceReportController = { index, filterOptions }

export default AveragePriceReportController