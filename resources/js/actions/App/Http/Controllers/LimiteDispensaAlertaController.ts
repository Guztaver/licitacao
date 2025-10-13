import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
const index1daf09739a392428785c3a8bd21de39d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1daf09739a392428785c3a8bd21de39d.url(options),
    method: 'get',
})

index1daf09739a392428785c3a8bd21de39d.definition = {
    methods: ["get","head"],
    url: '/alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
index1daf09739a392428785c3a8bd21de39d.url = (options?: RouteQueryOptions) => {
    return index1daf09739a392428785c3a8bd21de39d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
index1daf09739a392428785c3a8bd21de39d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index1daf09739a392428785c3a8bd21de39d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
index1daf09739a392428785c3a8bd21de39d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index1daf09739a392428785c3a8bd21de39d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
const index1daf09739a392428785c3a8bd21de39dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index1daf09739a392428785c3a8bd21de39d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
index1daf09739a392428785c3a8bd21de39dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index1daf09739a392428785c3a8bd21de39d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/alertas'
*/
index1daf09739a392428785c3a8bd21de39dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index1daf09739a392428785c3a8bd21de39d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index1daf09739a392428785c3a8bd21de39d.form = index1daf09739a392428785c3a8bd21de39dForm
/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
const indexb36504b3a3559e9f0438144b3a0af2d9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb36504b3a3559e9f0438144b3a0af2d9.url(options),
    method: 'get',
})

indexb36504b3a3559e9f0438144b3a0af2d9.definition = {
    methods: ["get","head"],
    url: '/api/limite-alertas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
indexb36504b3a3559e9f0438144b3a0af2d9.url = (options?: RouteQueryOptions) => {
    return indexb36504b3a3559e9f0438144b3a0af2d9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
indexb36504b3a3559e9f0438144b3a0af2d9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb36504b3a3559e9f0438144b3a0af2d9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
indexb36504b3a3559e9f0438144b3a0af2d9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb36504b3a3559e9f0438144b3a0af2d9.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
const indexb36504b3a3559e9f0438144b3a0af2d9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb36504b3a3559e9f0438144b3a0af2d9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
indexb36504b3a3559e9f0438144b3a0af2d9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb36504b3a3559e9f0438144b3a0af2d9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::index
* @see [unknown]:0
* @route '/api/limite-alertas'
*/
indexb36504b3a3559e9f0438144b3a0af2d9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexb36504b3a3559e9f0438144b3a0af2d9.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexb36504b3a3559e9f0438144b3a0af2d9.form = indexb36504b3a3559e9f0438144b3a0af2d9Form

export const index = {
    '/alertas': index1daf09739a392428785c3a8bd21de39d,
    '/api/limite-alertas': indexb36504b3a3559e9f0438144b3a0af2d9,
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
export const show = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/alertas/{alerta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
show.url = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alerta: args }
    }

    if (Array.isArray(args)) {
        args = {
            alerta: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alerta: args.alerta,
    }

    return show.definition.url
            .replace('{alerta}', parsedArgs.alerta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
show.get = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
show.head = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
const showForm = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
showForm.get = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::show
* @see [unknown]:0
* @route '/alertas/{alerta}'
*/
showForm.head = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-lida'
*/
export const marcarComoLida = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarComoLida.url(args, options),
    method: 'patch',
})

marcarComoLida.definition = {
    methods: ["patch"],
    url: '/alertas/{alerta}/marcar-lida',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-lida'
*/
marcarComoLida.url = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alerta: args }
    }

    if (Array.isArray(args)) {
        args = {
            alerta: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alerta: args.alerta,
    }

    return marcarComoLida.definition.url
            .replace('{alerta}', parsedArgs.alerta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-lida'
*/
marcarComoLida.patch = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarComoLida.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-lida'
*/
const marcarComoLidaForm = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: marcarComoLida.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-lida'
*/
marcarComoLidaForm.patch = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: marcarComoLida.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

marcarComoLida.form = marcarComoLidaForm

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoNaoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-nao-lida'
*/
export const marcarComoNaoLida = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarComoNaoLida.url(args, options),
    method: 'patch',
})

marcarComoNaoLida.definition = {
    methods: ["patch"],
    url: '/alertas/{alerta}/marcar-nao-lida',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoNaoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-nao-lida'
*/
marcarComoNaoLida.url = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { alerta: args }
    }

    if (Array.isArray(args)) {
        args = {
            alerta: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        alerta: args.alerta,
    }

    return marcarComoNaoLida.definition.url
            .replace('{alerta}', parsedArgs.alerta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoNaoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-nao-lida'
*/
marcarComoNaoLida.patch = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarComoNaoLida.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoNaoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-nao-lida'
*/
const marcarComoNaoLidaForm = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: marcarComoNaoLida.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarComoNaoLida
* @see [unknown]:0
* @route '/alertas/{alerta}/marcar-nao-lida'
*/
marcarComoNaoLidaForm.patch = (args: { alerta: string | number } | [alerta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: marcarComoNaoLida.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

marcarComoNaoLida.form = marcarComoNaoLidaForm

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarTodasComoLidas
* @see [unknown]:0
* @route '/alertas/marcar-todas-lidas'
*/
export const marcarTodasComoLidas = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarTodasComoLidas.url(options),
    method: 'patch',
})

marcarTodasComoLidas.definition = {
    methods: ["patch"],
    url: '/alertas/marcar-todas-lidas',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarTodasComoLidas
* @see [unknown]:0
* @route '/alertas/marcar-todas-lidas'
*/
marcarTodasComoLidas.url = (options?: RouteQueryOptions) => {
    return marcarTodasComoLidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarTodasComoLidas
* @see [unknown]:0
* @route '/alertas/marcar-todas-lidas'
*/
marcarTodasComoLidas.patch = (options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: marcarTodasComoLidas.url(options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarTodasComoLidas
* @see [unknown]:0
* @route '/alertas/marcar-todas-lidas'
*/
const marcarTodasComoLidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: marcarTodasComoLidas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::marcarTodasComoLidas
* @see [unknown]:0
* @route '/alertas/marcar-todas-lidas'
*/
marcarTodasComoLidasForm.patch = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: marcarTodasComoLidas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

marcarTodasComoLidas.form = marcarTodasComoLidasForm

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
export const contarNaoLidas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contarNaoLidas.url(options),
    method: 'get',
})

contarNaoLidas.definition = {
    methods: ["get","head"],
    url: '/alertas/nao-lidas-count',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
contarNaoLidas.url = (options?: RouteQueryOptions) => {
    return contarNaoLidas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
contarNaoLidas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: contarNaoLidas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
contarNaoLidas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: contarNaoLidas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
const contarNaoLidasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contarNaoLidas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
contarNaoLidasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contarNaoLidas.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::contarNaoLidas
* @see [unknown]:0
* @route '/alertas/nao-lidas-count'
*/
contarNaoLidasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: contarNaoLidas.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

contarNaoLidas.form = contarNaoLidasForm

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
export const checkNewAlerts = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkNewAlerts.url(options),
    method: 'get',
})

checkNewAlerts.definition = {
    methods: ["get","head"],
    url: '/api/limite-alertas/check-new',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
checkNewAlerts.url = (options?: RouteQueryOptions) => {
    return checkNewAlerts.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
checkNewAlerts.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkNewAlerts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
checkNewAlerts.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkNewAlerts.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
const checkNewAlertsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkNewAlerts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
checkNewAlertsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkNewAlerts.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LimiteDispensaAlertaController::checkNewAlerts
* @see [unknown]:0
* @route '/api/limite-alertas/check-new'
*/
checkNewAlertsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkNewAlerts.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkNewAlerts.form = checkNewAlertsForm

const LimiteDispensaAlertaController = { index, show, marcarComoLida, marcarComoNaoLida, marcarTodasComoLidas, contarNaoLidas, checkNewAlerts }

export default LimiteDispensaAlertaController