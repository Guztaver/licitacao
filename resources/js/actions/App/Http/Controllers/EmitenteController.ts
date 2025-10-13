import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/emitentes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::index
* @see app/Http/Controllers/EmitenteController.php:16
* @route '/emitentes'
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
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/emitentes/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::create
* @see app/Http/Controllers/EmitenteController.php:67
* @route '/emitentes/create'
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
* @see \App\Http\Controllers\EmitenteController::store
* @see app/Http/Controllers/EmitenteController.php:75
* @route '/emitentes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/emitentes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmitenteController::store
* @see app/Http/Controllers/EmitenteController.php:75
* @route '/emitentes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::store
* @see app/Http/Controllers/EmitenteController.php:75
* @route '/emitentes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmitenteController::store
* @see app/Http/Controllers/EmitenteController.php:75
* @route '/emitentes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmitenteController::store
* @see app/Http/Controllers/EmitenteController.php:75
* @route '/emitentes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
export const show = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/emitentes/{emitente}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
show.url = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emitente: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { emitente: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            emitente: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        emitente: typeof args.emitente === 'object'
        ? args.emitente.id
        : args.emitente,
    }

    return show.definition.url
            .replace('{emitente}', parsedArgs.emitente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
show.get = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
show.head = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
const showForm = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
showForm.get = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::show
* @see app/Http/Controllers/EmitenteController.php:95
* @route '/emitentes/{emitente}'
*/
showForm.head = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
export const edit = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/emitentes/{emitente}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
edit.url = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emitente: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { emitente: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            emitente: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        emitente: typeof args.emitente === 'object'
        ? args.emitente.id
        : args.emitente,
    }

    return edit.definition.url
            .replace('{emitente}', parsedArgs.emitente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
edit.get = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
edit.head = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
const editForm = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
editForm.get = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::edit
* @see app/Http/Controllers/EmitenteController.php:157
* @route '/emitentes/{emitente}/edit'
*/
editForm.head = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
export const update = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/emitentes/{emitente}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
update.url = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emitente: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { emitente: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            emitente: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        emitente: typeof args.emitente === 'object'
        ? args.emitente.id
        : args.emitente,
    }

    return update.definition.url
            .replace('{emitente}', parsedArgs.emitente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
update.put = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
update.patch = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
const updateForm = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
updateForm.put = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmitenteController::update
* @see app/Http/Controllers/EmitenteController.php:174
* @route '/emitentes/{emitente}'
*/
updateForm.patch = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\EmitenteController::destroy
* @see app/Http/Controllers/EmitenteController.php:193
* @route '/emitentes/{emitente}'
*/
export const destroy = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/emitentes/{emitente}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmitenteController::destroy
* @see app/Http/Controllers/EmitenteController.php:193
* @route '/emitentes/{emitente}'
*/
destroy.url = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { emitente: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { emitente: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            emitente: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        emitente: typeof args.emitente === 'object'
        ? args.emitente.id
        : args.emitente,
    }

    return destroy.definition.url
            .replace('{emitente}', parsedArgs.emitente.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::destroy
* @see app/Http/Controllers/EmitenteController.php:193
* @route '/emitentes/{emitente}'
*/
destroy.delete = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmitenteController::destroy
* @see app/Http/Controllers/EmitenteController.php:193
* @route '/emitentes/{emitente}'
*/
const destroyForm = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmitenteController::destroy
* @see app/Http/Controllers/EmitenteController.php:193
* @route '/emitentes/{emitente}'
*/
destroyForm.delete = (args: { emitente: number | { id: number } } | [emitente: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const EmitenteController = { index, create, store, show, edit, update, destroy }

export default EmitenteController