import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
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
* @see \App\Http\Controllers\EmitenteController::exportMethod
* @see app/Http/Controllers/EmitenteController.php:210
* @route '/emitentes-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/emitentes-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmitenteController::exportMethod
* @see app/Http/Controllers/EmitenteController.php:210
* @route '/emitentes-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmitenteController::exportMethod
* @see app/Http/Controllers/EmitenteController.php:210
* @route '/emitentes-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\EmitenteController::exportMethod
* @see app/Http/Controllers/EmitenteController.php:210
* @route '/emitentes-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

const EmitenteController = { index, create, store, show, edit, update, destroy, exportMethod, export: exportMethod }

export default EmitenteController