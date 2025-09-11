import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\DestinatarioController::index
* @see app/Http/Controllers/DestinatarioController.php:16
* @route '/destinatarios'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/destinatarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DestinatarioController::index
* @see app/Http/Controllers/DestinatarioController.php:16
* @route '/destinatarios'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::index
* @see app/Http/Controllers/DestinatarioController.php:16
* @route '/destinatarios'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DestinatarioController::index
* @see app/Http/Controllers/DestinatarioController.php:16
* @route '/destinatarios'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DestinatarioController::create
* @see app/Http/Controllers/DestinatarioController.php:66
* @route '/destinatarios/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/destinatarios/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DestinatarioController::create
* @see app/Http/Controllers/DestinatarioController.php:66
* @route '/destinatarios/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::create
* @see app/Http/Controllers/DestinatarioController.php:66
* @route '/destinatarios/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DestinatarioController::create
* @see app/Http/Controllers/DestinatarioController.php:66
* @route '/destinatarios/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DestinatarioController::store
* @see app/Http/Controllers/DestinatarioController.php:74
* @route '/destinatarios'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/destinatarios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\DestinatarioController::store
* @see app/Http/Controllers/DestinatarioController.php:74
* @route '/destinatarios'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::store
* @see app/Http/Controllers/DestinatarioController.php:74
* @route '/destinatarios'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\DestinatarioController::show
* @see app/Http/Controllers/DestinatarioController.php:94
* @route '/destinatarios/{destinatario}'
*/
export const show = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/destinatarios/{destinatario}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DestinatarioController::show
* @see app/Http/Controllers/DestinatarioController.php:94
* @route '/destinatarios/{destinatario}'
*/
show.url = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { destinatario: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { destinatario: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            destinatario: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        destinatario: typeof args.destinatario === 'object'
        ? args.destinatario.id
        : args.destinatario,
    }

    return show.definition.url
            .replace('{destinatario}', parsedArgs.destinatario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::show
* @see app/Http/Controllers/DestinatarioController.php:94
* @route '/destinatarios/{destinatario}'
*/
show.get = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DestinatarioController::show
* @see app/Http/Controllers/DestinatarioController.php:94
* @route '/destinatarios/{destinatario}'
*/
show.head = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DestinatarioController::edit
* @see app/Http/Controllers/DestinatarioController.php:155
* @route '/destinatarios/{destinatario}/edit'
*/
export const edit = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/destinatarios/{destinatario}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DestinatarioController::edit
* @see app/Http/Controllers/DestinatarioController.php:155
* @route '/destinatarios/{destinatario}/edit'
*/
edit.url = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { destinatario: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { destinatario: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            destinatario: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        destinatario: typeof args.destinatario === 'object'
        ? args.destinatario.id
        : args.destinatario,
    }

    return edit.definition.url
            .replace('{destinatario}', parsedArgs.destinatario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::edit
* @see app/Http/Controllers/DestinatarioController.php:155
* @route '/destinatarios/{destinatario}/edit'
*/
edit.get = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DestinatarioController::edit
* @see app/Http/Controllers/DestinatarioController.php:155
* @route '/destinatarios/{destinatario}/edit'
*/
edit.head = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\DestinatarioController::update
* @see app/Http/Controllers/DestinatarioController.php:172
* @route '/destinatarios/{destinatario}'
*/
export const update = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/destinatarios/{destinatario}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\DestinatarioController::update
* @see app/Http/Controllers/DestinatarioController.php:172
* @route '/destinatarios/{destinatario}'
*/
update.url = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { destinatario: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { destinatario: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            destinatario: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        destinatario: typeof args.destinatario === 'object'
        ? args.destinatario.id
        : args.destinatario,
    }

    return update.definition.url
            .replace('{destinatario}', parsedArgs.destinatario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::update
* @see app/Http/Controllers/DestinatarioController.php:172
* @route '/destinatarios/{destinatario}'
*/
update.put = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\DestinatarioController::update
* @see app/Http/Controllers/DestinatarioController.php:172
* @route '/destinatarios/{destinatario}'
*/
update.patch = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\DestinatarioController::destroy
* @see app/Http/Controllers/DestinatarioController.php:191
* @route '/destinatarios/{destinatario}'
*/
export const destroy = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/destinatarios/{destinatario}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\DestinatarioController::destroy
* @see app/Http/Controllers/DestinatarioController.php:191
* @route '/destinatarios/{destinatario}'
*/
destroy.url = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { destinatario: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { destinatario: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            destinatario: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        destinatario: typeof args.destinatario === 'object'
        ? args.destinatario.id
        : args.destinatario,
    }

    return destroy.definition.url
            .replace('{destinatario}', parsedArgs.destinatario.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::destroy
* @see app/Http/Controllers/DestinatarioController.php:191
* @route '/destinatarios/{destinatario}'
*/
destroy.delete = (args: { destinatario: number | { id: number } } | [destinatario: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\DestinatarioController::exportMethod
* @see app/Http/Controllers/DestinatarioController.php:208
* @route '/destinatarios-export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/destinatarios-export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\DestinatarioController::exportMethod
* @see app/Http/Controllers/DestinatarioController.php:208
* @route '/destinatarios-export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\DestinatarioController::exportMethod
* @see app/Http/Controllers/DestinatarioController.php:208
* @route '/destinatarios-export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\DestinatarioController::exportMethod
* @see app/Http/Controllers/DestinatarioController.php:208
* @route '/destinatarios-export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

const DestinatarioController = { index, create, store, show, edit, update, destroy, exportMethod, export: exportMethod }

export default DestinatarioController