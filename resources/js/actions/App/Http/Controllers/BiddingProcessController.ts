import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/bidding-processes/{biddingProcess}/status'
*/
const updateStatus12d8a0ea9cbeccceb973f4e83ef68920 = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus12d8a0ea9cbeccceb973f4e83ef68920.url(args, options),
    method: 'put',
})

updateStatus12d8a0ea9cbeccceb973f4e83ef68920.definition = {
    methods: ["put"],
    url: '/bidding-processes/{biddingProcess}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/bidding-processes/{biddingProcess}/status'
*/
updateStatus12d8a0ea9cbeccceb973f4e83ef68920.url = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biddingProcess: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biddingProcess: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biddingProcess: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biddingProcess: typeof args.biddingProcess === 'object'
        ? args.biddingProcess.id
        : args.biddingProcess,
    }

    return updateStatus12d8a0ea9cbeccceb973f4e83ef68920.definition.url
            .replace('{biddingProcess}', parsedArgs.biddingProcess.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/bidding-processes/{biddingProcess}/status'
*/
updateStatus12d8a0ea9cbeccceb973f4e83ef68920.put = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus12d8a0ea9cbeccceb973f4e83ef68920.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/bidding-processes/{biddingProcess}/status'
*/
const updateStatus12d8a0ea9cbeccceb973f4e83ef68920Form = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus12d8a0ea9cbeccceb973f4e83ef68920.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/bidding-processes/{biddingProcess}/status'
*/
updateStatus12d8a0ea9cbeccceb973f4e83ef68920Form.put = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus12d8a0ea9cbeccceb973f4e83ef68920.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateStatus12d8a0ea9cbeccceb973f4e83ef68920.form = updateStatus12d8a0ea9cbeccceb973f4e83ef68920Form
/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/api/bidding-processes/{biddingProcess}/status'
*/
const updateStatus44af319287a2b0ec7266a9c2de6b851a = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus44af319287a2b0ec7266a9c2de6b851a.url(args, options),
    method: 'put',
})

updateStatus44af319287a2b0ec7266a9c2de6b851a.definition = {
    methods: ["put"],
    url: '/api/bidding-processes/{biddingProcess}/status',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/api/bidding-processes/{biddingProcess}/status'
*/
updateStatus44af319287a2b0ec7266a9c2de6b851a.url = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biddingProcess: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biddingProcess: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biddingProcess: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biddingProcess: typeof args.biddingProcess === 'object'
        ? args.biddingProcess.id
        : args.biddingProcess,
    }

    return updateStatus44af319287a2b0ec7266a9c2de6b851a.definition.url
            .replace('{biddingProcess}', parsedArgs.biddingProcess.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/api/bidding-processes/{biddingProcess}/status'
*/
updateStatus44af319287a2b0ec7266a9c2de6b851a.put = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateStatus44af319287a2b0ec7266a9c2de6b851a.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/api/bidding-processes/{biddingProcess}/status'
*/
const updateStatus44af319287a2b0ec7266a9c2de6b851aForm = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus44af319287a2b0ec7266a9c2de6b851a.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::updateStatus
* @see app/Http/Controllers/BiddingProcessController.php:226
* @route '/api/bidding-processes/{biddingProcess}/status'
*/
updateStatus44af319287a2b0ec7266a9c2de6b851aForm.put = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateStatus44af319287a2b0ec7266a9c2de6b851a.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateStatus44af319287a2b0ec7266a9c2de6b851a.form = updateStatus44af319287a2b0ec7266a9c2de6b851aForm

export const updateStatus = {
    '/bidding-processes/{biddingProcess}/status': updateStatus12d8a0ea9cbeccceb973f4e83ef68920,
    '/api/bidding-processes/{biddingProcess}/status': updateStatus44af319287a2b0ec7266a9c2de6b851a,
}

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/bidding-processes/{biddingProcess}'
*/
const destroy7421ee0c7f8b89eaccf8ff3fb534ff75 = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy7421ee0c7f8b89eaccf8ff3fb534ff75.url(args, options),
    method: 'delete',
})

destroy7421ee0c7f8b89eaccf8ff3fb534ff75.definition = {
    methods: ["delete"],
    url: '/bidding-processes/{biddingProcess}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/bidding-processes/{biddingProcess}'
*/
destroy7421ee0c7f8b89eaccf8ff3fb534ff75.url = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biddingProcess: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biddingProcess: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biddingProcess: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biddingProcess: typeof args.biddingProcess === 'object'
        ? args.biddingProcess.id
        : args.biddingProcess,
    }

    return destroy7421ee0c7f8b89eaccf8ff3fb534ff75.definition.url
            .replace('{biddingProcess}', parsedArgs.biddingProcess.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/bidding-processes/{biddingProcess}'
*/
destroy7421ee0c7f8b89eaccf8ff3fb534ff75.delete = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy7421ee0c7f8b89eaccf8ff3fb534ff75.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/bidding-processes/{biddingProcess}'
*/
const destroy7421ee0c7f8b89eaccf8ff3fb534ff75Form = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy7421ee0c7f8b89eaccf8ff3fb534ff75.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/bidding-processes/{biddingProcess}'
*/
destroy7421ee0c7f8b89eaccf8ff3fb534ff75Form.delete = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy7421ee0c7f8b89eaccf8ff3fb534ff75.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy7421ee0c7f8b89eaccf8ff3fb534ff75.form = destroy7421ee0c7f8b89eaccf8ff3fb534ff75Form
/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/api/bidding-processes/{biddingProcess}'
*/
const destroyf8fca53b38028355e58d8640a0f8693c = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyf8fca53b38028355e58d8640a0f8693c.url(args, options),
    method: 'delete',
})

destroyf8fca53b38028355e58d8640a0f8693c.definition = {
    methods: ["delete"],
    url: '/api/bidding-processes/{biddingProcess}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/api/bidding-processes/{biddingProcess}'
*/
destroyf8fca53b38028355e58d8640a0f8693c.url = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biddingProcess: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biddingProcess: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biddingProcess: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biddingProcess: typeof args.biddingProcess === 'object'
        ? args.biddingProcess.id
        : args.biddingProcess,
    }

    return destroyf8fca53b38028355e58d8640a0f8693c.definition.url
            .replace('{biddingProcess}', parsedArgs.biddingProcess.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/api/bidding-processes/{biddingProcess}'
*/
destroyf8fca53b38028355e58d8640a0f8693c.delete = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyf8fca53b38028355e58d8640a0f8693c.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/api/bidding-processes/{biddingProcess}'
*/
const destroyf8fca53b38028355e58d8640a0f8693cForm = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyf8fca53b38028355e58d8640a0f8693c.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::destroy
* @see app/Http/Controllers/BiddingProcessController.php:289
* @route '/api/bidding-processes/{biddingProcess}'
*/
destroyf8fca53b38028355e58d8640a0f8693cForm.delete = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyf8fca53b38028355e58d8640a0f8693c.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyf8fca53b38028355e58d8640a0f8693c.form = destroyf8fca53b38028355e58d8640a0f8693cForm

export const destroy = {
    '/bidding-processes/{biddingProcess}': destroy7421ee0c7f8b89eaccf8ff3fb534ff75,
    '/api/bidding-processes/{biddingProcess}': destroyf8fca53b38028355e58d8640a0f8693c,
}

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/bidding-processes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::index
* @see app/Http/Controllers/BiddingProcessController.php:19
* @route '/api/bidding-processes'
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
* @see \App\Http\Controllers\BiddingProcessController::store
* @see app/Http/Controllers/BiddingProcessController.php:34
* @route '/api/bidding-processes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/bidding-processes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::store
* @see app/Http/Controllers/BiddingProcessController.php:34
* @route '/api/bidding-processes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::store
* @see app/Http/Controllers/BiddingProcessController.php:34
* @route '/api/bidding-processes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::store
* @see app/Http/Controllers/BiddingProcessController.php:34
* @route '/api/bidding-processes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::store
* @see app/Http/Controllers/BiddingProcessController.php:34
* @route '/api/bidding-processes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\BiddingProcessController::consolidate
* @see app/Http/Controllers/BiddingProcessController.php:77
* @route '/api/bidding-processes/consolidate'
*/
export const consolidate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidate.url(options),
    method: 'post',
})

consolidate.definition = {
    methods: ["post"],
    url: '/api/bidding-processes/consolidate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::consolidate
* @see app/Http/Controllers/BiddingProcessController.php:77
* @route '/api/bidding-processes/consolidate'
*/
consolidate.url = (options?: RouteQueryOptions) => {
    return consolidate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::consolidate
* @see app/Http/Controllers/BiddingProcessController.php:77
* @route '/api/bidding-processes/consolidate'
*/
consolidate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::consolidate
* @see app/Http/Controllers/BiddingProcessController.php:77
* @route '/api/bidding-processes/consolidate'
*/
const consolidateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: consolidate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::consolidate
* @see app/Http/Controllers/BiddingProcessController.php:77
* @route '/api/bidding-processes/consolidate'
*/
consolidateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: consolidate.url(options),
    method: 'post',
})

consolidate.form = consolidateForm

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
export const getAvailableRequests = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableRequests.url(options),
    method: 'get',
})

getAvailableRequests.definition = {
    methods: ["get","head"],
    url: '/api/bidding-processes/available-requests',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
getAvailableRequests.url = (options?: RouteQueryOptions) => {
    return getAvailableRequests.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
getAvailableRequests.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getAvailableRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
getAvailableRequests.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getAvailableRequests.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
const getAvailableRequestsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
getAvailableRequestsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableRequests.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::getAvailableRequests
* @see app/Http/Controllers/BiddingProcessController.php:203
* @route '/api/bidding-processes/available-requests'
*/
getAvailableRequestsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getAvailableRequests.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

getAvailableRequests.form = getAvailableRequestsForm

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
export const show = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/bidding-processes/{biddingProcess}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
show.url = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { biddingProcess: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { biddingProcess: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            biddingProcess: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        biddingProcess: typeof args.biddingProcess === 'object'
        ? args.biddingProcess.id
        : args.biddingProcess,
    }

    return show.definition.url
            .replace('{biddingProcess}', parsedArgs.biddingProcess.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
show.get = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
show.head = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
const showForm = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
showForm.get = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\BiddingProcessController::show
* @see app/Http/Controllers/BiddingProcessController.php:66
* @route '/api/bidding-processes/{biddingProcess}'
*/
showForm.head = (args: { biddingProcess: number | { id: number } } | [biddingProcess: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const BiddingProcessController = { updateStatus, destroy, index, store, consolidate, getAvailableRequests, show }

export default BiddingProcessController