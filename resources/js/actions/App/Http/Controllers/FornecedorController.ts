import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedor}'
*/
export const show = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/fornecedores/{fornecedor}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedor}'
*/
show.url = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fornecedor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedor: typeof args.fornecedor === 'object'
        ? args.fornecedor.id
        : args.fornecedor,
    }

    return show.definition.url
            .replace('{fornecedor}', parsedArgs.fornecedor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedor}'
*/
show.get = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::show
* @see app/Http/Controllers/FornecedorController.php:123
* @route '/fornecedores/{fornecedor}'
*/
show.head = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedor}/edit'
*/
export const edit = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/fornecedores/{fornecedor}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedor}/edit'
*/
edit.url = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fornecedor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedor: typeof args.fornecedor === 'object'
        ? args.fornecedor.id
        : args.fornecedor,
    }

    return edit.definition.url
            .replace('{fornecedor}', parsedArgs.fornecedor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedor}/edit'
*/
edit.get = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::edit
* @see app/Http/Controllers/FornecedorController.php:207
* @route '/fornecedores/{fornecedor}/edit'
*/
edit.head = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedor}'
*/
export const update = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/fornecedores/{fornecedor}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedor}'
*/
update.url = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fornecedor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedor: typeof args.fornecedor === 'object'
        ? args.fornecedor.id
        : args.fornecedor,
    }

    return update.definition.url
            .replace('{fornecedor}', parsedArgs.fornecedor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedor}'
*/
update.put = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\FornecedorController::update
* @see app/Http/Controllers/FornecedorController.php:230
* @route '/fornecedores/{fornecedor}'
*/
update.patch = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedor}'
*/
export const destroy = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/fornecedores/{fornecedor}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedor}'
*/
destroy.url = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { fornecedor: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { fornecedor: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            fornecedor: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        fornecedor: typeof args.fornecedor === 'object'
        ? args.fornecedor.id
        : args.fornecedor,
    }

    return destroy.definition.url
            .replace('{fornecedor}', parsedArgs.fornecedor.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::destroy
* @see app/Http/Controllers/FornecedorController.php:255
* @route '/fornecedores/{fornecedor}'
*/
destroy.delete = (args: { fornecedor: number | { id: number } } | [fornecedor: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\FornecedorController::exportMethod
* @see app/Http/Controllers/FornecedorController.php:271
* @route '/fornecedores-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/fornecedores-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::exportMethod
* @see app/Http/Controllers/FornecedorController.php:271
* @route '/fornecedores-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::exportMethod
* @see app/Http/Controllers/FornecedorController.php:271
* @route '/fornecedores-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::exportMethod
* @see app/Http/Controllers/FornecedorController.php:271
* @route '/fornecedores-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\FornecedorController::search
* @see app/Http/Controllers/FornecedorController.php:344
* @route '/fornecedores-search'
*/
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/fornecedores-search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FornecedorController::search
* @see app/Http/Controllers/FornecedorController.php:344
* @route '/fornecedores-search'
*/
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FornecedorController::search
* @see app/Http/Controllers/FornecedorController.php:344
* @route '/fornecedores-search'
*/
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FornecedorController::search
* @see app/Http/Controllers/FornecedorController.php:344
* @route '/fornecedores-search'
*/
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

const FornecedorController = { index, create, store, show, edit, update, destroy, exportMethod, search, export: exportMethod }

export default FornecedorController