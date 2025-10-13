import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/categorias-materiais',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::index
* @see app/Http/Controllers/CategoriaMaterialController.php:18
* @route '/categorias-materiais'
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
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/categorias-materiais/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::create
* @see app/Http/Controllers/CategoriaMaterialController.php:83
* @route '/categorias-materiais/create'
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
* @route '/categorias-materiais'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/categorias-materiais',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias-materiais'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias-materiais'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias-materiais'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::store
* @see app/Http/Controllers/CategoriaMaterialController.php:101
* @route '/categorias-materiais'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
export const show = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/categorias-materiais/{categorias_materiai}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
show.url = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categorias_materiai: args }
    }

    if (Array.isArray(args)) {
        args = {
            categorias_materiai: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categorias_materiai: args.categorias_materiai,
    }

    return show.definition.url
            .replace('{categorias_materiai}', parsedArgs.categorias_materiai.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
show.get = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
show.head = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
const showForm = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
showForm.get = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::show
* @see app/Http/Controllers/CategoriaMaterialController.php:130
* @route '/categorias-materiais/{categorias_materiai}'
*/
showForm.head = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
export const edit = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/categorias-materiais/{categorias_materiai}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
edit.url = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categorias_materiai: args }
    }

    if (Array.isArray(args)) {
        args = {
            categorias_materiai: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categorias_materiai: args.categorias_materiai,
    }

    return edit.definition.url
            .replace('{categorias_materiai}', parsedArgs.categorias_materiai.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
edit.get = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
edit.head = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
const editForm = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
editForm.get = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::edit
* @see app/Http/Controllers/CategoriaMaterialController.php:246
* @route '/categorias-materiais/{categorias_materiai}/edit'
*/
editForm.head = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @route '/categorias-materiais/{categorias_materiai}'
*/
export const update = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/categorias-materiais/{categorias_materiai}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias-materiais/{categorias_materiai}'
*/
update.url = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categorias_materiai: args }
    }

    if (Array.isArray(args)) {
        args = {
            categorias_materiai: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categorias_materiai: args.categorias_materiai,
    }

    return update.definition.url
            .replace('{categorias_materiai}', parsedArgs.categorias_materiai.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias-materiais/{categorias_materiai}'
*/
update.put = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias-materiais/{categorias_materiai}'
*/
update.patch = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::update
* @see app/Http/Controllers/CategoriaMaterialController.php:265
* @route '/categorias-materiais/{categorias_materiai}'
*/
const updateForm = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/categorias-materiais/{categorias_materiai}'
*/
updateForm.put = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/categorias-materiais/{categorias_materiai}'
*/
updateForm.patch = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/categorias-materiais/{categorias_materiai}'
*/
export const destroy = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/categorias-materiais/{categorias_materiai}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias-materiais/{categorias_materiai}'
*/
destroy.url = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categorias_materiai: args }
    }

    if (Array.isArray(args)) {
        args = {
            categorias_materiai: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categorias_materiai: args.categorias_materiai,
    }

    return destroy.definition.url
            .replace('{categorias_materiai}', parsedArgs.categorias_materiai.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias-materiais/{categorias_materiai}'
*/
destroy.delete = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::destroy
* @see app/Http/Controllers/CategoriaMaterialController.php:297
* @route '/categorias-materiais/{categorias_materiai}'
*/
const destroyForm = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @route '/categorias-materiais/{categorias_materiai}'
*/
destroyForm.delete = (args: { categorias_materiai: string | number } | [categorias_materiai: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CategoriaMaterialController::toggleStatus
* @see app/Http/Controllers/CategoriaMaterialController.php:316
* @route '/categorias-materiais/{categoriaMaterial}/toggle-status'
*/
export const toggleStatus = (args: { categoriaMaterial: string | number | { id: string | number } } | [categoriaMaterial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/categorias-materiais/{categoriaMaterial}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::toggleStatus
* @see app/Http/Controllers/CategoriaMaterialController.php:316
* @route '/categorias-materiais/{categoriaMaterial}/toggle-status'
*/
toggleStatus.url = (args: { categoriaMaterial: string | number | { id: string | number } } | [categoriaMaterial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoriaMaterial: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { categoriaMaterial: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            categoriaMaterial: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        categoriaMaterial: typeof args.categoriaMaterial === 'object'
        ? args.categoriaMaterial.id
        : args.categoriaMaterial,
    }

    return toggleStatus.definition.url
            .replace('{categoriaMaterial}', parsedArgs.categoriaMaterial.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::toggleStatus
* @see app/Http/Controllers/CategoriaMaterialController.php:316
* @route '/categorias-materiais/{categoriaMaterial}/toggle-status'
*/
toggleStatus.post = (args: { categoriaMaterial: string | number | { id: string | number } } | [categoriaMaterial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::toggleStatus
* @see app/Http/Controllers/CategoriaMaterialController.php:316
* @route '/categorias-materiais/{categoriaMaterial}/toggle-status'
*/
const toggleStatusForm = (args: { categoriaMaterial: string | number | { id: string | number } } | [categoriaMaterial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::toggleStatus
* @see app/Http/Controllers/CategoriaMaterialController.php:316
* @route '/categorias-materiais/{categoriaMaterial}/toggle-status'
*/
toggleStatusForm.post = (args: { categoriaMaterial: string | number | { id: string | number } } | [categoriaMaterial: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.form = toggleStatusForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/categorias-materiais-search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::search
* @see app/Http/Controllers/CategoriaMaterialController.php:330
* @route '/categorias-materiais-search'
*/
searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: search.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

search.form = searchForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::checkLimits
* @see app/Http/Controllers/CategoriaMaterialController.php:358
* @route '/categorias-materiais/check-limits'
*/
export const checkLimits = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkLimits.url(options),
    method: 'post',
})

checkLimits.definition = {
    methods: ["post"],
    url: '/categorias-materiais/check-limits',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::checkLimits
* @see app/Http/Controllers/CategoriaMaterialController.php:358
* @route '/categorias-materiais/check-limits'
*/
checkLimits.url = (options?: RouteQueryOptions) => {
    return checkLimits.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::checkLimits
* @see app/Http/Controllers/CategoriaMaterialController.php:358
* @route '/categorias-materiais/check-limits'
*/
checkLimits.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: checkLimits.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::checkLimits
* @see app/Http/Controllers/CategoriaMaterialController.php:358
* @route '/categorias-materiais/check-limits'
*/
const checkLimitsForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkLimits.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::checkLimits
* @see app/Http/Controllers/CategoriaMaterialController.php:358
* @route '/categorias-materiais/check-limits'
*/
checkLimitsForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: checkLimits.url(options),
    method: 'post',
})

checkLimits.form = checkLimitsForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::gerarAlertas
* @see app/Http/Controllers/CategoriaMaterialController.php:403
* @route '/categorias-materiais/gerar-alertas'
*/
export const gerarAlertas = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gerarAlertas.url(options),
    method: 'post',
})

gerarAlertas.definition = {
    methods: ["post"],
    url: '/categorias-materiais/gerar-alertas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::gerarAlertas
* @see app/Http/Controllers/CategoriaMaterialController.php:403
* @route '/categorias-materiais/gerar-alertas'
*/
gerarAlertas.url = (options?: RouteQueryOptions) => {
    return gerarAlertas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::gerarAlertas
* @see app/Http/Controllers/CategoriaMaterialController.php:403
* @route '/categorias-materiais/gerar-alertas'
*/
gerarAlertas.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: gerarAlertas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::gerarAlertas
* @see app/Http/Controllers/CategoriaMaterialController.php:403
* @route '/categorias-materiais/gerar-alertas'
*/
const gerarAlertasForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: gerarAlertas.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::gerarAlertas
* @see app/Http/Controllers/CategoriaMaterialController.php:403
* @route '/categorias-materiais/gerar-alertas'
*/
gerarAlertasForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: gerarAlertas.url(options),
    method: 'post',
})

gerarAlertas.form = gerarAlertasForm

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
export const usageReport = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usageReport.url(options),
    method: 'get',
})

usageReport.definition = {
    methods: ["get","head"],
    url: '/categorias-materiais/usage-report',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
usageReport.url = (options?: RouteQueryOptions) => {
    return usageReport.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
usageReport.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usageReport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
usageReport.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: usageReport.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
const usageReportForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: usageReport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
usageReportForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: usageReport.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CategoriaMaterialController::usageReport
* @see app/Http/Controllers/CategoriaMaterialController.php:418
* @route '/categorias-materiais/usage-report'
*/
usageReportForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: usageReport.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

usageReport.form = usageReportForm

const CategoriaMaterialController = { index, create, store, show, edit, update, destroy, toggleStatus, search, checkLimits, gerarAlertas, usageReport }

export default CategoriaMaterialController