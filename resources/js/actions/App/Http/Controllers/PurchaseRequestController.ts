import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/purchase-requests'
*/
const store679dd15c4301781cc6b33570284d2483 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store679dd15c4301781cc6b33570284d2483.url(options),
    method: 'post',
})

store679dd15c4301781cc6b33570284d2483.definition = {
    methods: ["post"],
    url: '/purchase-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/purchase-requests'
*/
store679dd15c4301781cc6b33570284d2483.url = (options?: RouteQueryOptions) => {
    return store679dd15c4301781cc6b33570284d2483.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/purchase-requests'
*/
store679dd15c4301781cc6b33570284d2483.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store679dd15c4301781cc6b33570284d2483.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/purchase-requests'
*/
const store679dd15c4301781cc6b33570284d2483Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store679dd15c4301781cc6b33570284d2483.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/purchase-requests'
*/
store679dd15c4301781cc6b33570284d2483Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store679dd15c4301781cc6b33570284d2483.url(options),
    method: 'post',
})

store679dd15c4301781cc6b33570284d2483.form = store679dd15c4301781cc6b33570284d2483Form
/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/api/purchase-requests'
*/
const storec06745f665aaba38183702ecf8562c17 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storec06745f665aaba38183702ecf8562c17.url(options),
    method: 'post',
})

storec06745f665aaba38183702ecf8562c17.definition = {
    methods: ["post"],
    url: '/api/purchase-requests',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/api/purchase-requests'
*/
storec06745f665aaba38183702ecf8562c17.url = (options?: RouteQueryOptions) => {
    return storec06745f665aaba38183702ecf8562c17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/api/purchase-requests'
*/
storec06745f665aaba38183702ecf8562c17.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storec06745f665aaba38183702ecf8562c17.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/api/purchase-requests'
*/
const storec06745f665aaba38183702ecf8562c17Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storec06745f665aaba38183702ecf8562c17.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::store
* @see app/Http/Controllers/PurchaseRequestController.php:51
* @route '/api/purchase-requests'
*/
storec06745f665aaba38183702ecf8562c17Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storec06745f665aaba38183702ecf8562c17.url(options),
    method: 'post',
})

storec06745f665aaba38183702ecf8562c17.form = storec06745f665aaba38183702ecf8562c17Form

export const store = {
    '/purchase-requests': store679dd15c4301781cc6b33570284d2483,
    '/api/purchase-requests': storec06745f665aaba38183702ecf8562c17,
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::update
* @see app/Http/Controllers/PurchaseRequestController.php:261
* @route '/purchase-requests/{purchaseRequest}'
*/
export const update = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/purchase-requests/{purchaseRequest}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::update
* @see app/Http/Controllers/PurchaseRequestController.php:261
* @route '/purchase-requests/{purchaseRequest}'
*/
update.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return update.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::update
* @see app/Http/Controllers/PurchaseRequestController.php:261
* @route '/purchase-requests/{purchaseRequest}'
*/
update.put = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::update
* @see app/Http/Controllers/PurchaseRequestController.php:261
* @route '/purchase-requests/{purchaseRequest}'
*/
const updateForm = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::update
* @see app/Http/Controllers/PurchaseRequestController.php:261
* @route '/purchase-requests/{purchaseRequest}'
*/
updateForm.put = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PurchaseRequestController::destroy
* @see app/Http/Controllers/PurchaseRequestController.php:329
* @route '/purchase-requests/{purchaseRequest}'
*/
export const destroy = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/purchase-requests/{purchaseRequest}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::destroy
* @see app/Http/Controllers/PurchaseRequestController.php:329
* @route '/purchase-requests/{purchaseRequest}'
*/
destroy.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return destroy.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::destroy
* @see app/Http/Controllers/PurchaseRequestController.php:329
* @route '/purchase-requests/{purchaseRequest}'
*/
destroy.delete = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::destroy
* @see app/Http/Controllers/PurchaseRequestController.php:329
* @route '/purchase-requests/{purchaseRequest}'
*/
const destroyForm = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::destroy
* @see app/Http/Controllers/PurchaseRequestController.php:329
* @route '/purchase-requests/{purchaseRequest}'
*/
destroyForm.delete = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/purchase-requests/{purchaseRequest}/status'
*/
const updateStatusd4a734bc7124fe171161c96d21a9b3a9 = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatusd4a734bc7124fe171161c96d21a9b3a9.url(args, options),
    method: 'put',
})

updateStatusd4a734bc7124fe171161c96d21a9b3a9.definition = {
    methods: ["put"],
    url: '/purchase-requests/{purchaseRequest}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/purchase-requests/{purchaseRequest}/status'
*/
updateStatusd4a734bc7124fe171161c96d21a9b3a9.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return updateStatusd4a734bc7124fe171161c96d21a9b3a9.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/purchase-requests/{purchaseRequest}/status'
*/
updateStatusd4a734bc7124fe171161c96d21a9b3a9.put = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatusd4a734bc7124fe171161c96d21a9b3a9.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/purchase-requests/{purchaseRequest}/status'
*/
const updateStatusd4a734bc7124fe171161c96d21a9b3a9Form = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatusd4a734bc7124fe171161c96d21a9b3a9.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/purchase-requests/{purchaseRequest}/status'
*/
updateStatusd4a734bc7124fe171161c96d21a9b3a9Form.put = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatusd4a734bc7124fe171161c96d21a9b3a9.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateStatusd4a734bc7124fe171161c96d21a9b3a9.form = updateStatusd4a734bc7124fe171161c96d21a9b3a9Form
/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/api/purchase-requests/{purchaseRequest}/status'
*/
const updateStatus7e0495c904730c59bb4191547e6324eb = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus7e0495c904730c59bb4191547e6324eb.url(args, options),
    method: 'put',
})

updateStatus7e0495c904730c59bb4191547e6324eb.definition = {
    methods: ["put"],
    url: '/api/purchase-requests/{purchaseRequest}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/api/purchase-requests/{purchaseRequest}/status'
*/
updateStatus7e0495c904730c59bb4191547e6324eb.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return updateStatus7e0495c904730c59bb4191547e6324eb.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/api/purchase-requests/{purchaseRequest}/status'
*/
updateStatus7e0495c904730c59bb4191547e6324eb.put = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus7e0495c904730c59bb4191547e6324eb.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/api/purchase-requests/{purchaseRequest}/status'
*/
const updateStatus7e0495c904730c59bb4191547e6324ebForm = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus7e0495c904730c59bb4191547e6324eb.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::updateStatus
* @see app/Http/Controllers/PurchaseRequestController.php:122
* @route '/api/purchase-requests/{purchaseRequest}/status'
*/
updateStatus7e0495c904730c59bb4191547e6324ebForm.put = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus7e0495c904730c59bb4191547e6324eb.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateStatus7e0495c904730c59bb4191547e6324eb.form = updateStatus7e0495c904730c59bb4191547e6324ebForm

export const updateStatus = {
    '/purchase-requests/{purchaseRequest}/status': updateStatusd4a734bc7124fe171161c96d21a9b3a9,
    '/api/purchase-requests/{purchaseRequest}/status': updateStatus7e0495c904730c59bb4191547e6324eb,
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
const getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url(args, options),
    method: 'get',
})

getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.definition = {
    methods: ["get","head"],
    url: '/purchase-requests/{purchaseRequest}/available-actions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.get = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.head = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
const getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155edForm = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155edForm.get = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155edForm.head = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed.form = getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155edForm
/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
const getAvailableActions536f7401572cb4aa0fd96491ee598545 = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableActions536f7401572cb4aa0fd96491ee598545.url(args, options),
    method: 'get',
})

getAvailableActions536f7401572cb4aa0fd96491ee598545.definition = {
    methods: ["get","head"],
    url: '/api/purchase-requests/{purchaseRequest}/available-actions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActions536f7401572cb4aa0fd96491ee598545.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return getAvailableActions536f7401572cb4aa0fd96491ee598545.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActions536f7401572cb4aa0fd96491ee598545.get = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableActions536f7401572cb4aa0fd96491ee598545.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActions536f7401572cb4aa0fd96491ee598545.head = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAvailableActions536f7401572cb4aa0fd96491ee598545.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
const getAvailableActions536f7401572cb4aa0fd96491ee598545Form = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableActions536f7401572cb4aa0fd96491ee598545.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActions536f7401572cb4aa0fd96491ee598545Form.get = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableActions536f7401572cb4aa0fd96491ee598545.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::getAvailableActions
* @see app/Http/Controllers/PurchaseRequestController.php:228
* @route '/api/purchase-requests/{purchaseRequest}/available-actions'
*/
getAvailableActions536f7401572cb4aa0fd96491ee598545Form.head = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableActions536f7401572cb4aa0fd96491ee598545.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getAvailableActions536f7401572cb4aa0fd96491ee598545.form = getAvailableActions536f7401572cb4aa0fd96491ee598545Form

export const getAvailableActions = {
    '/purchase-requests/{purchaseRequest}/available-actions': getAvailableActionsa3ed7acb7dbeaf7cad8115d3ed4155ed,
    '/api/purchase-requests/{purchaseRequest}/available-actions': getAvailableActions536f7401572cb4aa0fd96491ee598545,
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
const forwardToContracts07add96fc43ed8cad00d74456edc9690 = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forwardToContracts07add96fc43ed8cad00d74456edc9690.url(args, options),
    method: 'post',
})

forwardToContracts07add96fc43ed8cad00d74456edc9690.definition = {
    methods: ["post"],
    url: '/purchase-requests/{purchaseRequest}/forward-to-contracts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
forwardToContracts07add96fc43ed8cad00d74456edc9690.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return forwardToContracts07add96fc43ed8cad00d74456edc9690.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
forwardToContracts07add96fc43ed8cad00d74456edc9690.post = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forwardToContracts07add96fc43ed8cad00d74456edc9690.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
const forwardToContracts07add96fc43ed8cad00d74456edc9690Form = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forwardToContracts07add96fc43ed8cad00d74456edc9690.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
forwardToContracts07add96fc43ed8cad00d74456edc9690Form.post = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forwardToContracts07add96fc43ed8cad00d74456edc9690.url(args, options),
    method: 'post',
})

forwardToContracts07add96fc43ed8cad00d74456edc9690.form = forwardToContracts07add96fc43ed8cad00d74456edc9690Form
/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/api/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
const forwardToContractsac36821283c5526306187806c670a657 = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forwardToContractsac36821283c5526306187806c670a657.url(args, options),
    method: 'post',
})

forwardToContractsac36821283c5526306187806c670a657.definition = {
    methods: ["post"],
    url: '/api/purchase-requests/{purchaseRequest}/forward-to-contracts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/api/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
forwardToContractsac36821283c5526306187806c670a657.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return forwardToContractsac36821283c5526306187806c670a657.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/api/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
forwardToContractsac36821283c5526306187806c670a657.post = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: forwardToContractsac36821283c5526306187806c670a657.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/api/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
const forwardToContractsac36821283c5526306187806c670a657Form = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forwardToContractsac36821283c5526306187806c670a657.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::forwardToContracts
* @see app/Http/Controllers/PurchaseRequestController.php:370
* @route '/api/purchase-requests/{purchaseRequest}/forward-to-contracts'
*/
forwardToContractsac36821283c5526306187806c670a657Form.post = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: forwardToContractsac36821283c5526306187806c670a657.url(args, options),
    method: 'post',
})

forwardToContractsac36821283c5526306187806c670a657.form = forwardToContractsac36821283c5526306187806c670a657Form

export const forwardToContracts = {
    '/purchase-requests/{purchaseRequest}/forward-to-contracts': forwardToContracts07add96fc43ed8cad00d74456edc9690,
    '/api/purchase-requests/{purchaseRequest}/forward-to-contracts': forwardToContractsac36821283c5526306187806c670a657,
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/purchase-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::index
* @see app/Http/Controllers/PurchaseRequestController.php:18
* @route '/api/purchase-requests'
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
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
export const show = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/purchase-requests/{purchaseRequest}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
show.url = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseRequest: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseRequest: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseRequest: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseRequest: typeof args.purchaseRequest === 'object'
        ? args.purchaseRequest.id
        : args.purchaseRequest,
    }

    return show.definition.url
            .replace('{purchaseRequest}', parsedArgs.purchaseRequest.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
show.get = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
show.head = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
const showForm = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
showForm.get = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PurchaseRequestController::show
* @see app/Http/Controllers/PurchaseRequestController.php:94
* @route '/api/purchase-requests/{purchaseRequest}'
*/
showForm.head = (args: { purchaseRequest: number | { id: number } } | [purchaseRequest: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const PurchaseRequestController = { store, update, destroy, updateStatus, getAvailableActions, forwardToContracts, index, show }

export default PurchaseRequestController