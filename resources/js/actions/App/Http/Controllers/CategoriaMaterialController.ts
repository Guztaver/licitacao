import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
const indexc33b2cdf68d55993591904d2ec298d4b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexc33b2cdf68d55993591904d2ec298d4b.url(options),
    method: 'get',
})

indexc33b2cdf68d55993591904d2ec298d4b.definition = {
    methods: ["get","head"],
    url: '/categorias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
indexc33b2cdf68d55993591904d2ec298d4b.url = (options?: RouteQueryOptions) => {
    return indexc33b2cdf68d55993591904d2ec298d4b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
indexc33b2cdf68d55993591904d2ec298d4b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexc33b2cdf68d55993591904d2ec298d4b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
indexc33b2cdf68d55993591904d2ec298d4b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexc33b2cdf68d55993591904d2ec298d4b.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
const indexc33b2cdf68d55993591904d2ec298d4bForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexc33b2cdf68d55993591904d2ec298d4b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
indexc33b2cdf68d55993591904d2ec298d4bForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexc33b2cdf68d55993591904d2ec298d4b.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias'
*/
indexc33b2cdf68d55993591904d2ec298d4bForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexc33b2cdf68d55993591904d2ec298d4b.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexc33b2cdf68d55993591904d2ec298d4b.form = indexc33b2cdf68d55993591904d2ec298d4bForm
/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
const indexf8a9902e3952eb206b3f37135a913a85 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexf8a9902e3952eb206b3f37135a913a85.url(options),
    method: 'get',
})

indexf8a9902e3952eb206b3f37135a913a85.definition = {
    methods: ["get","head"],
    url: '/api/categoria-materiais',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
indexf8a9902e3952eb206b3f37135a913a85.url = (options?: RouteQueryOptions) => {
    return indexf8a9902e3952eb206b3f37135a913a85.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
indexf8a9902e3952eb206b3f37135a913a85.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexf8a9902e3952eb206b3f37135a913a85.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
indexf8a9902e3952eb206b3f37135a913a85.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexf8a9902e3952eb206b3f37135a913a85.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
const indexf8a9902e3952eb206b3f37135a913a85Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexf8a9902e3952eb206b3f37135a913a85.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
indexf8a9902e3952eb206b3f37135a913a85Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexf8a9902e3952eb206b3f37135a913a85.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/api/categoria-materiais'
*/
indexf8a9902e3952eb206b3f37135a913a85Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexf8a9902e3952eb206b3f37135a913a85.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexf8a9902e3952eb206b3f37135a913a85.form = indexf8a9902e3952eb206b3f37135a913a85Form

export const index = {
    '/categorias': indexc33b2cdf68d55993591904d2ec298d4b,
    '/api/categoria-materiais': indexf8a9902e3952eb206b3f37135a913a85,
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/categorias/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias/create'
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
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/categorias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
export const show = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/categorias/{categoria}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
show.url = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoria: args }
    }

    if (Array.isArray(args)) {
        args = {
            categoria: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categoria: args.categoria,
    }

    return show.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
show.get = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
show.head = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
const showForm = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
showForm.get = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias/{categoria}'
*/
showForm.head = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
export const edit = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/categorias/{categoria}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
edit.url = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoria: args }
    }

    if (Array.isArray(args)) {
        args = {
            categoria: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categoria: args.categoria,
    }

    return edit.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
edit.get = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
edit.head = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
const editForm = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
editForm.get = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias/{categoria}/edit'
*/
editForm.head = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
export const update = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/categorias/{categoria}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
update.url = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoria: args }
    }

    if (Array.isArray(args)) {
        args = {
            categoria: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categoria: args.categoria,
    }

    return update.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
update.put = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
update.patch = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
const updateForm = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
updateForm.put = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias/{categoria}'
*/
updateForm.patch = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias/{categoria}'
*/
export const destroy = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/categorias/{categoria}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias/{categoria}'
*/
destroy.url = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoria: args }
    }

    if (Array.isArray(args)) {
        args = {
            categoria: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categoria: args.categoria,
    }

    return destroy.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias/{categoria}'
*/
destroy.delete = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias/{categoria}'
*/
const destroyForm = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias/{categoria}'
*/
destroyForm.delete = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
export const showWithUsage = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showWithUsage.url(args, options),
    method: 'get',
})

showWithUsage.definition = {
    methods: ["get","head"],
    url: '/api/categoria-materiais/{id}/com-uso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
showWithUsage.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return showWithUsage.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
showWithUsage.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showWithUsage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
showWithUsage.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showWithUsage.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
const showWithUsageForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showWithUsage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
showWithUsageForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showWithUsage.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::showWithUsage
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/categoria-materiais/{id}/com-uso'
*/
showWithUsageForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: showWithUsage.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

showWithUsage.form = showWithUsageForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
*/
export const getDashboardData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDashboardData.url(options),
    method: 'get',
})

getDashboardData.definition = {
    methods: ["get","head"],
    url: '/api/limites-dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
*/
getDashboardData.url = (options?: RouteQueryOptions) => {
    return getDashboardData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
*/
getDashboardData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDashboardData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
*/
getDashboardData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDashboardData.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
*/
const getDashboardDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDashboardData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
*/
getDashboardDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: getDashboardData.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::getDashboardData
* @see app/Http/Controllers/CategoriaMaterialController.php:0
* @route '/api/limites-dashboard'
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

const CategoriaMaterialController = { index, create, store, show, edit, update, destroy, showWithUsage, getDashboardData }

export default CategoriaMaterialController