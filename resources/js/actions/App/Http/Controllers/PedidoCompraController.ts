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
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
export const show = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras/{pedidos_compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
show.url = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidos_compra: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedidos_compra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidos_compra: args.pedidos_compra,
    }

    return show.definition.url
            .replace('{pedidos_compra}', parsedArgs.pedidos_compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
show.get = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
show.head = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
const showForm = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
showForm.get = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::show
* @see app/Http/Controllers/PedidoCompraController.php:212
* @route '/pedidos-compras/{pedidos_compra}'
*/
showForm.head = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
export const edit = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras/{pedidos_compra}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
edit.url = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidos_compra: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedidos_compra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidos_compra: args.pedidos_compra,
    }

    return edit.definition.url
            .replace('{pedidos_compra}', parsedArgs.pedidos_compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
edit.get = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
edit.head = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
const editForm = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
editForm.get = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::edit
* @see app/Http/Controllers/PedidoCompraController.php:301
* @route '/pedidos-compras/{pedidos_compra}/edit'
*/
editForm.head = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @route '/pedidos-compras/{pedidos_compra}'
*/
export const update = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/pedidos-compras/{pedidos_compra}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedidos_compra}'
*/
update.url = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidos_compra: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedidos_compra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidos_compra: args.pedidos_compra,
    }

    return update.definition.url
            .replace('{pedidos_compra}', parsedArgs.pedidos_compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedidos_compra}'
*/
update.put = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedidos_compra}'
*/
update.patch = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::update
* @see app/Http/Controllers/PedidoCompraController.php:351
* @route '/pedidos-compras/{pedidos_compra}'
*/
const updateForm = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/pedidos-compras/{pedidos_compra}'
*/
updateForm.put = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/pedidos-compras/{pedidos_compra}'
*/
updateForm.patch = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedidos_compra}'
*/
export const destroy = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/pedidos-compras/{pedidos_compra}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedidos_compra}'
*/
destroy.url = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidos_compra: args }
    }

    if (Array.isArray(args)) {
        args = {
            pedidos_compra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidos_compra: args.pedidos_compra,
    }

    return destroy.definition.url
            .replace('{pedidos_compra}', parsedArgs.pedidos_compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedidos_compra}'
*/
destroy.delete = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::destroy
* @see app/Http/Controllers/PedidoCompraController.php:436
* @route '/pedidos-compras/{pedidos_compra}'
*/
const destroyForm = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/pedidos-compras/{pedidos_compra}'
*/
destroyForm.delete = (args: { pedidos_compra: string | number } | [pedidos_compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PedidoCompraController::enviarParaAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:454
* @route '/pedidos-compras/{pedidoCompra}/enviar-aprovacao'
*/
export const enviarParaAprovacao = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarParaAprovacao.url(args, options),
    method: 'post',
})

enviarParaAprovacao.definition = {
    methods: ["post"],
    url: '/pedidos-compras/{pedidoCompra}/enviar-aprovacao',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::enviarParaAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:454
* @route '/pedidos-compras/{pedidoCompra}/enviar-aprovacao'
*/
enviarParaAprovacao.url = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidoCompra: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { pedidoCompra: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            pedidoCompra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidoCompra: typeof args.pedidoCompra === 'object'
        ? args.pedidoCompra.id
        : args.pedidoCompra,
    }

    return enviarParaAprovacao.definition.url
            .replace('{pedidoCompra}', parsedArgs.pedidoCompra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::enviarParaAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:454
* @route '/pedidos-compras/{pedidoCompra}/enviar-aprovacao'
*/
enviarParaAprovacao.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarParaAprovacao.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::enviarParaAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:454
* @route '/pedidos-compras/{pedidoCompra}/enviar-aprovacao'
*/
const enviarParaAprovacaoForm = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: enviarParaAprovacao.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::enviarParaAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:454
* @route '/pedidos-compras/{pedidoCompra}/enviar-aprovacao'
*/
enviarParaAprovacaoForm.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: enviarParaAprovacao.url(args, options),
    method: 'post',
})

enviarParaAprovacao.form = enviarParaAprovacaoForm

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedidoCompra}/aprovar'
*/
export const aprovar = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprovar.url(args, options),
    method: 'post',
})

aprovar.definition = {
    methods: ["post"],
    url: '/pedidos-compras/{pedidoCompra}/aprovar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedidoCompra}/aprovar'
*/
aprovar.url = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidoCompra: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { pedidoCompra: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            pedidoCompra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidoCompra: typeof args.pedidoCompra === 'object'
        ? args.pedidoCompra.id
        : args.pedidoCompra,
    }

    return aprovar.definition.url
            .replace('{pedidoCompra}', parsedArgs.pedidoCompra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedidoCompra}/aprovar'
*/
aprovar.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprovar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedidoCompra}/aprovar'
*/
const aprovarForm = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: aprovar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::aprovar
* @see app/Http/Controllers/PedidoCompraController.php:472
* @route '/pedidos-compras/{pedidoCompra}/aprovar'
*/
aprovarForm.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: aprovar.url(args, options),
    method: 'post',
})

aprovar.form = aprovarForm

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedidoCompra}/rejeitar'
*/
export const rejeitar = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejeitar.url(args, options),
    method: 'post',
})

rejeitar.definition = {
    methods: ["post"],
    url: '/pedidos-compras/{pedidoCompra}/rejeitar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedidoCompra}/rejeitar'
*/
rejeitar.url = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidoCompra: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { pedidoCompra: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            pedidoCompra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidoCompra: typeof args.pedidoCompra === 'object'
        ? args.pedidoCompra.id
        : args.pedidoCompra,
    }

    return rejeitar.definition.url
            .replace('{pedidoCompra}', parsedArgs.pedidoCompra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedidoCompra}/rejeitar'
*/
rejeitar.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rejeitar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedidoCompra}/rejeitar'
*/
const rejeitarForm = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejeitar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::rejeitar
* @see app/Http/Controllers/PedidoCompraController.php:490
* @route '/pedidos-compras/{pedidoCompra}/rejeitar'
*/
rejeitarForm.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejeitar.url(args, options),
    method: 'post',
})

rejeitar.form = rejeitarForm

/**
* @see \App\Http\Controllers\PedidoCompraController::cancelar
* @see app/Http/Controllers/PedidoCompraController.php:512
* @route '/pedidos-compras/{pedidoCompra}/cancelar'
*/
export const cancelar = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/pedidos-compras/{pedidoCompra}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::cancelar
* @see app/Http/Controllers/PedidoCompraController.php:512
* @route '/pedidos-compras/{pedidoCompra}/cancelar'
*/
cancelar.url = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pedidoCompra: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { pedidoCompra: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            pedidoCompra: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        pedidoCompra: typeof args.pedidoCompra === 'object'
        ? args.pedidoCompra.id
        : args.pedidoCompra,
    }

    return cancelar.definition.url
            .replace('{pedidoCompra}', parsedArgs.pedidoCompra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::cancelar
* @see app/Http/Controllers/PedidoCompraController.php:512
* @route '/pedidos-compras/{pedidoCompra}/cancelar'
*/
cancelar.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::cancelar
* @see app/Http/Controllers/PedidoCompraController.php:512
* @route '/pedidos-compras/{pedidoCompra}/cancelar'
*/
const cancelarForm = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::cancelar
* @see app/Http/Controllers/PedidoCompraController.php:512
* @route '/pedidos-compras/{pedidoCompra}/cancelar'
*/
cancelarForm.post = (args: { pedidoCompra: string | number | { id: string | number } } | [pedidoCompra: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: cancelar.url(args, options),
    method: 'post',
})

cancelar.form = cancelarForm

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
export const pendentesAprovacao = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendentesAprovacao.url(options),
    method: 'get',
})

pendentesAprovacao.definition = {
    methods: ["get","head"],
    url: '/pedidos-compras-pendentes-aprovacao',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
pendentesAprovacao.url = (options?: RouteQueryOptions) => {
    return pendentesAprovacao.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
pendentesAprovacao.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pendentesAprovacao.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
pendentesAprovacao.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pendentesAprovacao.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
const pendentesAprovacaoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendentesAprovacao.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
pendentesAprovacaoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendentesAprovacao.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PedidoCompraController::pendentesAprovacao
* @see app/Http/Controllers/PedidoCompraController.php:528
* @route '/pedidos-compras-pendentes-aprovacao'
*/
pendentesAprovacaoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pendentesAprovacao.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pendentesAprovacao.form = pendentesAprovacaoForm

const PedidoCompraController = { index, create, store, show, edit, update, destroy, enviarParaAprovacao, aprovar, rejeitar, cancelar, pendentesAprovacao }

export default PedidoCompraController