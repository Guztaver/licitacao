import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/requisicoes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::index
* @see app/Http/Controllers/RequisicaoController.php:23
* @route '/requisicoes'
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
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:194
* @route '/requisicoes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/requisicoes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:194
* @route '/requisicoes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:194
* @route '/requisicoes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:194
* @route '/requisicoes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::store
* @see app/Http/Controllers/RequisicaoController.php:194
* @route '/requisicoes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/requisicoes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::create
* @see app/Http/Controllers/RequisicaoController.php:165
* @route '/requisicoes/create'
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
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
export const show = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
show.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return show.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
show.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
show.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
const showForm = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
showForm.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::show
* @see app/Http/Controllers/RequisicaoController.php:283
* @route '/requisicoes/{requisicao}'
*/
showForm.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
export const edit = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/requisicoes/{requisicao}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
edit.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return edit.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
edit.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
edit.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
const editForm = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
editForm.get = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\RequisicaoController::edit
* @see app/Http/Controllers/RequisicaoController.php:410
* @route '/requisicoes/{requisicao}/edit'
*/
editForm.head = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:470
* @route '/requisicoes/{requisicao}'
*/
export const update = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:470
* @route '/requisicoes/{requisicao}'
*/
update.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return update.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:470
* @route '/requisicoes/{requisicao}'
*/
update.put = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:470
* @route '/requisicoes/{requisicao}'
*/
const updateForm = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::update
* @see app/Http/Controllers/RequisicaoController.php:470
* @route '/requisicoes/{requisicao}'
*/
updateForm.put = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:614
* @route '/requisicoes/{requisicao}'
*/
export const destroy = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/requisicoes/{requisicao}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:614
* @route '/requisicoes/{requisicao}'
*/
destroy.url = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { requisicao: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: typeof args.requisicao === 'object'
        ? args.requisicao.id
        : args.requisicao,
    }

    return destroy.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:614
* @route '/requisicoes/{requisicao}'
*/
destroy.delete = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:614
* @route '/requisicoes/{requisicao}'
*/
const destroyForm = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::destroy
* @see app/Http/Controllers/RequisicaoController.php:614
* @route '/requisicoes/{requisicao}'
*/
destroyForm.delete = (args: { requisicao: number | { id: number } } | [requisicao: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RequisicaoController::aprovar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/aprovar'
*/
export const aprovar = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: aprovar.url(args, options),
    method: 'patch',
})

aprovar.definition = {
    methods: ["patch"],
    url: '/requisicoes/{requisicao}/aprovar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RequisicaoController::aprovar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/aprovar'
*/
aprovar.url = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: args.requisicao,
    }

    return aprovar.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::aprovar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/aprovar'
*/
aprovar.patch = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: aprovar.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RequisicaoController::aprovar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/aprovar'
*/
const aprovarForm = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: aprovar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::aprovar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/aprovar'
*/
aprovarForm.patch = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\RequisicaoController::rejeitar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/rejeitar'
*/
export const rejeitar = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejeitar.url(args, options),
    method: 'patch',
})

rejeitar.definition = {
    methods: ["patch"],
    url: '/requisicoes/{requisicao}/rejeitar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RequisicaoController::rejeitar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/rejeitar'
*/
rejeitar.url = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: args.requisicao,
    }

    return rejeitar.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::rejeitar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/rejeitar'
*/
rejeitar.patch = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: rejeitar.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RequisicaoController::rejeitar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/rejeitar'
*/
const rejeitarForm = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejeitar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::rejeitar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/rejeitar'
*/
rejeitarForm.patch = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rejeitar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

rejeitar.form = rejeitarForm

/**
* @see \App\Http\Controllers\RequisicaoController::finalizar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/finalizar'
*/
export const finalizar = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: finalizar.url(args, options),
    method: 'patch',
})

finalizar.definition = {
    methods: ["patch"],
    url: '/requisicoes/{requisicao}/finalizar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\RequisicaoController::finalizar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/finalizar'
*/
finalizar.url = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { requisicao: args }
    }

    if (Array.isArray(args)) {
        args = {
            requisicao: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        requisicao: args.requisicao,
    }

    return finalizar.definition.url
            .replace('{requisicao}', parsedArgs.requisicao.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RequisicaoController::finalizar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/finalizar'
*/
finalizar.patch = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: finalizar.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\RequisicaoController::finalizar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/finalizar'
*/
const finalizarForm = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalizar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RequisicaoController::finalizar
* @see app/Http/Controllers/RequisicaoController.php:0
* @route '/requisicoes/{requisicao}/finalizar'
*/
finalizarForm.patch = (args: { requisicao: string | number } | [requisicao: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalizar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

finalizar.form = finalizarForm

const RequisicaoController = { index, store, create, show, edit, update, destroy, aprovar, rejeitar, finalizar }

export default RequisicaoController