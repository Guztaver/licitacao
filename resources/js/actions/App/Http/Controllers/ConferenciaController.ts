import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/conferencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::index
* @see app/Http/Controllers/ConferenciaController.php:21
* @route '/conferencias'
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
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/conferencias/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:134
* @route '/conferencias/create'
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
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:149
* @route '/conferencias'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/conferencias',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:149
* @route '/conferencias'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:149
* @route '/conferencias'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:149
* @route '/conferencias'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:149
* @route '/conferencias'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
export const show = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/conferencias/{conferencia}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
show.url = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conferencia: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conferencia: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conferencia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conferencia: typeof args.conferencia === 'object'
        ? args.conferencia.id
        : args.conferencia,
    }

    return show.definition.url
            .replace('{conferencia}', parsedArgs.conferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
show.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
show.head = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
const showForm = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
showForm.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:227
* @route '/conferencias/{conferencia}'
*/
showForm.head = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
export const edit = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/conferencias/{conferencia}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
edit.url = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conferencia: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conferencia: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conferencia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conferencia: typeof args.conferencia === 'object'
        ? args.conferencia.id
        : args.conferencia,
    }

    return edit.definition.url
            .replace('{conferencia}', parsedArgs.conferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
edit.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
edit.head = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
const editForm = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
editForm.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:275
* @route '/conferencias/{conferencia}/edit'
*/
editForm.head = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
export const update = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/conferencias/{conferencia}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
update.url = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conferencia: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conferencia: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conferencia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conferencia: typeof args.conferencia === 'object'
        ? args.conferencia.id
        : args.conferencia,
    }

    return update.definition.url
            .replace('{conferencia}', parsedArgs.conferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
update.put = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
update.patch = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
const updateForm = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
updateForm.put = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:368
* @route '/conferencias/{conferencia}'
*/
updateForm.patch = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:626
* @route '/conferencias/{conferencia}'
*/
export const destroy = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/conferencias/{conferencia}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:626
* @route '/conferencias/{conferencia}'
*/
destroy.url = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conferencia: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conferencia: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conferencia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conferencia: typeof args.conferencia === 'object'
        ? args.conferencia.id
        : args.conferencia,
    }

    return destroy.definition.url
            .replace('{conferencia}', parsedArgs.conferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:626
* @route '/conferencias/{conferencia}'
*/
destroy.delete = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:626
* @route '/conferencias/{conferencia}'
*/
const destroyForm = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:626
* @route '/conferencias/{conferencia}'
*/
destroyForm.delete = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/conferencias-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::exportMethod
* @see app/Http/Controllers/ConferenciaController.php:513
* @route '/conferencias-export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
export const fornecedor = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fornecedor.url(args, options),
    method: 'get',
})

fornecedor.definition = {
    methods: ["get","head"],
    url: '/conferencias/fornecedor/{fornecedor}/{periodo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
fornecedor.url = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            fornecedor: args[0],
            periodo: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedor: args.fornecedor,
        periodo: args.periodo,
    }

    return fornecedor.definition.url
            .replace('{fornecedor}', parsedArgs.fornecedor.toString())
            .replace('{periodo}', parsedArgs.periodo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
fornecedor.get = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fornecedor.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
fornecedor.head = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fornecedor.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
const fornecedorForm = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fornecedor.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
fornecedorForm.get = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fornecedor.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::fornecedor
* @see app/Http/Controllers/ConferenciaController.php:415
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}'
*/
fornecedorForm.head = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fornecedor.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fornecedor.form = fornecedorForm

/**
* @see \App\Http\Controllers\ConferenciaController::storePedidoManual
* @see app/Http/Controllers/ConferenciaController.php:638
* @route '/conferencias/pedidos-manuais'
*/
export const storePedidoManual = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePedidoManual.url(options),
    method: 'post',
})

storePedidoManual.definition = {
    methods: ["post"],
    url: '/conferencias/pedidos-manuais',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConferenciaController::storePedidoManual
* @see app/Http/Controllers/ConferenciaController.php:638
* @route '/conferencias/pedidos-manuais'
*/
storePedidoManual.url = (options?: RouteQueryOptions) => {
    return storePedidoManual.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::storePedidoManual
* @see app/Http/Controllers/ConferenciaController.php:638
* @route '/conferencias/pedidos-manuais'
*/
storePedidoManual.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePedidoManual.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::storePedidoManual
* @see app/Http/Controllers/ConferenciaController.php:638
* @route '/conferencias/pedidos-manuais'
*/
const storePedidoManualForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePedidoManual.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::storePedidoManual
* @see app/Http/Controllers/ConferenciaController.php:638
* @route '/conferencias/pedidos-manuais'
*/
storePedidoManualForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePedidoManual.url(options),
    method: 'post',
})

storePedidoManual.form = storePedidoManualForm

/**
* @see \App\Http\Controllers\ConferenciaController::destroyPedidoManual
* @see app/Http/Controllers/ConferenciaController.php:676
* @route '/conferencias/{conferencia}/pedidos-manuais/{pedido}'
*/
export const destroyPedidoManual = (args: { conferencia: string | number, pedido: string | number } | [conferencia: string | number, pedido: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPedidoManual.url(args, options),
    method: 'delete',
})

destroyPedidoManual.definition = {
    methods: ["delete"],
    url: '/conferencias/{conferencia}/pedidos-manuais/{pedido}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ConferenciaController::destroyPedidoManual
* @see app/Http/Controllers/ConferenciaController.php:676
* @route '/conferencias/{conferencia}/pedidos-manuais/{pedido}'
*/
destroyPedidoManual.url = (args: { conferencia: string | number, pedido: string | number } | [conferencia: string | number, pedido: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            conferencia: args[0],
            pedido: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conferencia: args.conferencia,
        pedido: args.pedido,
    }

    return destroyPedidoManual.definition.url
            .replace('{conferencia}', parsedArgs.conferencia.toString())
            .replace('{pedido}', parsedArgs.pedido.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::destroyPedidoManual
* @see app/Http/Controllers/ConferenciaController.php:676
* @route '/conferencias/{conferencia}/pedidos-manuais/{pedido}'
*/
destroyPedidoManual.delete = (args: { conferencia: string | number, pedido: string | number } | [conferencia: string | number, pedido: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPedidoManual.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ConferenciaController::destroyPedidoManual
* @see app/Http/Controllers/ConferenciaController.php:676
* @route '/conferencias/{conferencia}/pedidos-manuais/{pedido}'
*/
const destroyPedidoManualForm = (args: { conferencia: string | number, pedido: string | number } | [conferencia: string | number, pedido: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPedidoManual.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::destroyPedidoManual
* @see app/Http/Controllers/ConferenciaController.php:676
* @route '/conferencias/{conferencia}/pedidos-manuais/{pedido}'
*/
destroyPedidoManualForm.delete = (args: { conferencia: string | number, pedido: string | number } | [conferencia: string | number, pedido: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPedidoManual.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyPedidoManual.form = destroyPedidoManualForm

/**
* @see \App\Http\Controllers\ConferenciaController::finalizarConferencia
* @see app/Http/Controllers/ConferenciaController.php:714
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}/finalizar'
*/
export const finalizarConferencia = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizarConferencia.url(args, options),
    method: 'post',
})

finalizarConferencia.definition = {
    methods: ["post"],
    url: '/conferencias/fornecedor/{fornecedor}/{periodo}/finalizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConferenciaController::finalizarConferencia
* @see app/Http/Controllers/ConferenciaController.php:714
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}/finalizar'
*/
finalizarConferencia.url = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            fornecedor: args[0],
            periodo: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedor: args.fornecedor,
        periodo: args.periodo,
    }

    return finalizarConferencia.definition.url
            .replace('{fornecedor}', parsedArgs.fornecedor.toString())
            .replace('{periodo}', parsedArgs.periodo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::finalizarConferencia
* @see app/Http/Controllers/ConferenciaController.php:714
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}/finalizar'
*/
finalizarConferencia.post = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizarConferencia.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::finalizarConferencia
* @see app/Http/Controllers/ConferenciaController.php:714
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}/finalizar'
*/
const finalizarConferenciaForm = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalizarConferencia.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::finalizarConferencia
* @see app/Http/Controllers/ConferenciaController.php:714
* @route '/conferencias/fornecedor/{fornecedor}/{periodo}/finalizar'
*/
finalizarConferenciaForm.post = (args: { fornecedor: string | number, periodo: string | number } | [fornecedor: string | number, periodo: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalizarConferencia.url(args, options),
    method: 'post',
})

finalizarConferencia.form = finalizarConferenciaForm

const ConferenciaController = { index, create, store, show, edit, update, destroy, exportMethod, fornecedor, storePedidoManual, destroyPedidoManual, finalizarConferencia, export: exportMethod }

export default ConferenciaControllerrtMethod, fornecedor, storePedidoManual, destroyPedidoManual, finalizarConferencia, export: exportMethod }

export default ConferenciaController