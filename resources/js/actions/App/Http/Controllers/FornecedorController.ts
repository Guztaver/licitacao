import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/fornecedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::index
* @see app/Http/Controllers/FornecedorController.php:17
* @route '/fornecedores'
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
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/fornecedores/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::create
* @see app/Http/Controllers/FornecedorController.php:89
* @route '/fornecedores/create'
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
* @see \App\Http\Controllers\FornecedorController::store
* @see app/Http/Controllers/FornecedorController.php:97
* @route '/fornecedores'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/fornecedores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\FornecedorController::store
* @see app/Http/Controllers/FornecedorController.php:97
* @route '/fornecedores'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::store
* @see app/Http/Controllers/FornecedorController.php:97
* @route '/fornecedores'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FornecedorController::store
* @see app/Http/Controllers/FornecedorController.php:97
* @route '/fornecedores'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FornecedorController::store
* @see app/Http/Controllers/FornecedorController.php:97
* @route '/fornecedores'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
export const show = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/fornecedores/{fornecedore}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
show.url = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedore: args }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedore: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedore: args.fornecedore,
    }

    return show.definition.url
            .replace('{fornecedore}', parsedArgs.fornecedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
show.get = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
show.head = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
const showForm = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
showForm.get = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedore}'
*/
showForm.head = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
export const edit = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/fornecedores/{fornecedore}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
edit.url = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedore: args }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedore: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedore: args.fornecedore,
    }

    return edit.definition.url
            .replace('{fornecedore}', parsedArgs.fornecedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
edit.get = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
edit.head = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
const editForm = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
editForm.get = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedore}/edit'
*/
editForm.head = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
export const update = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/fornecedores/{fornecedore}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
update.url = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedore: args }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedore: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedore: args.fornecedore,
    }

    return update.definition.url
            .replace('{fornecedore}', parsedArgs.fornecedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
update.put = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
update.patch = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
const updateForm = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
updateForm.put = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedore}'
*/
updateForm.patch = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedore}'
*/
export const destroy = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/fornecedores/{fornecedore}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedore}'
*/
destroy.url = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedore: args }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedore: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedore: args.fornecedore,
    }

    return destroy.definition.url
            .replace('{fornecedore}', parsedArgs.fornecedore.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedore}'
*/
destroy.delete = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedore}'
*/
const destroyForm = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedore}'
*/
destroyForm.delete = (args: { fornecedore: string | number } | [fornecedore: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/fornecedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
const apiIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
apiIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiIndex.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::apiIndex
* @see app/Http/Controllers/FornecedorController.php:0
* @route '/api/fornecedores'
*/
apiIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: apiIndex.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

apiIndex.form = apiIndexForm

const FornecedorController = { index, create, store, show, edit, update, destroy, apiIndex }

export default FornecedorController