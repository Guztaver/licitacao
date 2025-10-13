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
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:147
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
* @see app/Http/Controllers/ConferenciaController.php:147
* @route '/conferencias'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:147
* @route '/conferencias'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:147
* @route '/conferencias'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::store
* @see app/Http/Controllers/ConferenciaController.php:147
* @route '/conferencias'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:132
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
* @see app/Http/Controllers/ConferenciaController.php:132
* @route '/conferencias/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:132
* @route '/conferencias/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:132
* @route '/conferencias/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:132
* @route '/conferencias/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:132
* @route '/conferencias/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::create
* @see app/Http/Controllers/ConferenciaController.php:132
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
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:223
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
* @see app/Http/Controllers/ConferenciaController.php:223
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
* @see app/Http/Controllers/ConferenciaController.php:223
* @route '/conferencias/{conferencia}'
*/
show.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:223
* @route '/conferencias/{conferencia}'
*/
show.head = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:223
* @route '/conferencias/{conferencia}'
*/
const showForm = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:223
* @route '/conferencias/{conferencia}'
*/
showForm.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::show
* @see app/Http/Controllers/ConferenciaController.php:223
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
* @see app/Http/Controllers/ConferenciaController.php:269
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
* @see app/Http/Controllers/ConferenciaController.php:269
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
* @see app/Http/Controllers/ConferenciaController.php:269
* @route '/conferencias/{conferencia}/edit'
*/
edit.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:269
* @route '/conferencias/{conferencia}/edit'
*/
edit.head = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:269
* @route '/conferencias/{conferencia}/edit'
*/
const editForm = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:269
* @route '/conferencias/{conferencia}/edit'
*/
editForm.get = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConferenciaController::edit
* @see app/Http/Controllers/ConferenciaController.php:269
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
* @see app/Http/Controllers/ConferenciaController.php:360
* @route '/conferencias/{conferencia}'
*/
export const update = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/conferencias/{conferencia}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:360
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
* @see app/Http/Controllers/ConferenciaController.php:360
* @route '/conferencias/{conferencia}'
*/
update.put = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\ConferenciaController::update
* @see app/Http/Controllers/ConferenciaController.php:360
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
* @see app/Http/Controllers/ConferenciaController.php:360
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

update.form = updateForm

/**
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:617
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
* @see app/Http/Controllers/ConferenciaController.php:617
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
* @see app/Http/Controllers/ConferenciaController.php:617
* @route '/conferencias/{conferencia}'
*/
destroy.delete = (args: { conferencia: number | { id: number } } | [conferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\ConferenciaController::destroy
* @see app/Http/Controllers/ConferenciaController.php:617
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
* @see app/Http/Controllers/ConferenciaController.php:617
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
* @see \App\Http\Controllers\ConferenciaController::finalizar
* @see app/Http/Controllers/ConferenciaController.php:0
* @route '/conferencias/{conferencia}/finalizar'
*/
export const finalizar = (args: { conferencia: string | number } | [conferencia: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: finalizar.url(args, options),
    method: 'patch',
})

finalizar.definition = {
    methods: ["patch"],
    url: '/conferencias/{conferencia}/finalizar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ConferenciaController::finalizar
* @see app/Http/Controllers/ConferenciaController.php:0
* @route '/conferencias/{conferencia}/finalizar'
*/
finalizar.url = (args: { conferencia: string | number } | [conferencia: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conferencia: args }
    }

    if (Array.isArray(args)) {
        args = {
            conferencia: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conferencia: args.conferencia,
    }

    return finalizar.definition.url
            .replace('{conferencia}', parsedArgs.conferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConferenciaController::finalizar
* @see app/Http/Controllers/ConferenciaController.php:0
* @route '/conferencias/{conferencia}/finalizar'
*/
finalizar.patch = (args: { conferencia: string | number } | [conferencia: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: finalizar.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\ConferenciaController::finalizar
* @see app/Http/Controllers/ConferenciaController.php:0
* @route '/conferencias/{conferencia}/finalizar'
*/
const finalizarForm = (args: { conferencia: string | number } | [conferencia: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalizar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ConferenciaController::finalizar
* @see app/Http/Controllers/ConferenciaController.php:0
* @route '/conferencias/{conferencia}/finalizar'
*/
finalizarForm.patch = (args: { conferencia: string | number } | [conferencia: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: finalizar.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

finalizar.form = finalizarForm

const ConferenciaController = { index, store, create, show, edit, update, destroy, finalizar }

export default ConferenciaController