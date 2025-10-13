import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::index
* @see app/Http/Controllers/PedidoCompraController.php:24
* @route '/pedidos-compras'
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
* @see \App\Http\Controllers\PedidoCompraController::store
* @see app/Http/Controllers/PedidoCompraController.php:150
* @route '/pedidos-compras'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pedidos-compras',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::store
* @see app/Http/Controllers/PedidoCompraController.php:150
* @route '/pedidos-compras'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::store
* @see app/Http/Controllers/PedidoCompraController.php:150
* @route '/pedidos-compras'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::store
* @see app/Http/Controllers/PedidoCompraController.php:150
* @route '/pedidos-compras'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::store
* @see app/Http/Controllers/PedidoCompraController.php:150
* @route '/pedidos-compras'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::create
* @see app/Http/Controllers/PedidoCompraController.php:131
* @route '/pedidos-compras/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
export const show = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras/{pedido}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
show.url = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedido: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedido: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedido: args.pedido,
    }

    return show.definition.url
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
show.get = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
show.head = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
const showForm = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
showForm.get = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedido}'
*/
showForm.head = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
export const edit = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras/{pedido}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
edit.url = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedido: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedido: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedido: args.pedido,
    }

    return edit.definition.url
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
edit.get = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
edit.head = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
const editForm = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
editForm.get = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedido}/edit'
*/
editForm.head = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

edit.form = editForm

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedido}'
*/
export const update = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/pedidos-compras/{pedido}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedido}'
*/
update.url = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedido: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedido: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedido: args.pedido,
    }

    return update.definition.url
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedido}'
*/
update.put = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedido}'
*/
const updateForm = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedido}'
*/
updateForm.put = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedido}'
*/
export const destroy = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/pedidos-compras/{pedido}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedido}'
*/
destroy.url = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedido: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedido: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedido: args.pedido,
    }

    return destroy.definition.url
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedido}'
*/
destroy.delete = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedido}'
*/
const destroyForm = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedido}'
*/
destroyForm.delete = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedido}/aprovar'
*/
export const aprovar = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: aprovar.url(args, options),
    method: 'patch',
})

aprovar.definition = {
    methods: ["patch"],
    url: '/pedidos-compras/{pedido}/aprovar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedido}/aprovar'
*/
aprovar.url = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedido: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedido: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedido: args.pedido,
    }

    return aprovar.definition.url
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedido}/aprovar'
*/
aprovar.patch = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: aprovar.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedido}/aprovar'
*/
const aprovarForm = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: aprovar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedido}/aprovar'
*/
aprovarForm.patch = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: aprovar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

aprovar.form = aprovarForm

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedido}/rejeitar'
*/
export const rejeitar = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejeitar.url(args, options),
    method: 'patch',
})

rejeitar.definition = {
    methods: ["patch"],
    url: '/pedidos-compras/{pedido}/rejeitar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedido}/rejeitar'
*/
rejeitar.url = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedido: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedido: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedido: args.pedido,
    }

    return rejeitar.definition.url
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedido}/rejeitar'
*/
rejeitar.patch = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejeitar.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedido}/rejeitar'
*/
const rejeitarForm = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejeitar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedido}/rejeitar'
*/
rejeitarForm.patch = (args: { pedido: string | number } | [pedido: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejeitar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

rejeitar.form = rejeitarForm

const PedidoCompraController = { index, store, create, show, edit, update, destroy, aprovar, rejeitar }

export default PedidoCompraController